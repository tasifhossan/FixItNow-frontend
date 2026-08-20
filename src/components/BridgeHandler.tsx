'use client';

/**
 * BridgeHandler — mounts once in the root layout.
 *
 * Handles two query params injected by the backend bridge redirect:
 *
 * ?bridge_code=<uuid>
 *   POSTs the code to /auth/bridge/exchange → gets { accessToken, refreshToken }
 *   → stores both (same as login flow), clears bridge_attempted flag, strips URL param.
 *
 * ?bridge_failed=1
 *   Strips the param, clears bridge state, and lets refreshSession() fall through
 *   to a clean guest state (the flag is already set so no second redirect loop).
 */

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { setAccessToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const BRIDGE_ATTEMPTED_KEY = 'fin_bridge_attempted';

export default function BridgeHandler() {
  const { refreshSession } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bridgeCode = params.get('bridge_code');
    const bridgeFailed = params.get('bridge_failed');

    // Nothing bridge-related in the URL — nothing to do
    if (!bridgeCode && !bridgeFailed) return;

    // Strip both params from URL bar immediately so codes are never bookmarked
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('bridge_code');
    cleanUrl.searchParams.delete('bridge_failed');
    window.history.replaceState({}, '', cleanUrl.toString());

    if (bridgeFailed) {
      // Bridge endpoint said the backend cookie was missing/invalid.
      // Clear state and show a friendly message.
      sessionStorage.removeItem(BRIDGE_ATTEMPTED_KEY);
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      toast.error('Session expired — please log in again.');
      return;
    }

    if (bridgeCode) {
      // Exchange the single-use code for a real token pair
      api
        .post('/auth/bridge/exchange', { bridge_code: bridgeCode })
        .then(({ data }) => {
          const { accessToken: token, refreshToken: rToken } = data.data;

          // Store exactly the same way as the normal login flow
          setAccessToken(token);
          document.cookie = `accessToken=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`;
          if (rToken) {
            document.cookie = `refreshToken=${rToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`;
          }

          // Clear bridge flag — migration succeeded
          sessionStorage.removeItem(BRIDGE_ATTEMPTED_KEY);

          // Re-run refreshSession so AuthContext picks up the new tokens and fetches the user
          refreshSession();
        })
        .catch(() => {
          // Code was invalid/expired — treat as failed bridge
          sessionStorage.removeItem(BRIDGE_ATTEMPTED_KEY);
          toast.error('Session could not be restored — please log in again.');
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // renders nothing
}
