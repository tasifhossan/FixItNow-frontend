'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Droplet,
  Zap,
  Sparkles,
  Scissors,
  Hammer,
  Car,
  CheckCircle,
  X,
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  servicesCount: number;
  status: 'Active' | 'Inactive';
  iconKey: string;
}

interface ServiceOffer {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  droplet: <Droplet className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  scissors: <Scissors className="h-5 w-5" />,
  hammer: <Hammer className="h-5 w-5" />,
  car: <Car className="h-5 w-5" />,
};

// ─── Main Page Component ─────────────────────────────────────────────────────

interface BackendCategory {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    services: number;
  };
}

interface BackendService {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  basePrice: number;
  price?: number;
  isActive?: boolean;
}

export default function AdminCategoriesServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceOffer[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);

  // Form States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('droplet');

  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  const [editingService, setEditingService] = useState<ServiceOffer | null>(null);

  // Category Edit and Delete States
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const loadServicesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const categoriesRes = await api.get('/categories');
      const apiCategories = categoriesRes.data.data || [];
      
      const formattedCategories: Category[] = apiCategories.map((c: BackendCategory, index: number) => ({
        id: c.id,
        name: c.name,
        servicesCount: c._count?.services || 0,
        status: 'Active',
        iconKey: index % 3 === 0 ? 'droplet' : index % 3 === 1 ? 'zap' : 'sparkles',
      }));

      setCategories(formattedCategories);
      if (formattedCategories.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(formattedCategories[0].id);
      }

      const servicesRes = await api.get('/services');
      const apiServices = servicesRes.data.data?.data || servicesRes.data.data || [];
      const formattedServices: ServiceOffer[] = apiServices.map((s: BackendService) => ({
        id: s.id,
        categoryId: s.categoryId,
        name: s.name,
        description: s.description || '',
        basePrice: s.basePrice || s.price || 0,
        isActive: s.isActive ?? true,
      }));
      setServices(formattedServices);
    } catch (err) {
      console.error('Failed to fetch categories or services:', err);
      showToast('Failed to load data from backend api.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId]);

  // Initial Load
  useEffect(() => {
    loadServicesData();
  }, [loadServicesData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Category Filtering
  const filteredCategories = useMemo(() => {
    return categories.filter(c =>
      c.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categories, categorySearchQuery]);

  // Selected Category Info
  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  // Services inside Selected Category
  const activeServices = useMemo(() => {
    return services.filter(s => s.categoryId === selectedCategoryId);
  }, [services, selectedCategoryId]);

  if (isLoading) {
    return (
      <div className="space-y-6 text-left animate-pulse">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-850 rounded" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
          {/* Categories Panel Skeleton */}
          <div className="lg:col-span-4 space-y-4">
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-20 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Services Panel Skeleton */}
          <div className="lg:col-span-8 space-y-4">
            <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-96 w-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // Toggle Service Status
  const handleToggleServiceStatus = (serviceId: string) => {
    const targetService = services.find(s => s.id === serviceId);
    if (!targetService) return;
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s))
    );
    showToast('Service status updated successfully!');
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await api.post('/categories', {
        name: newCategoryName,
      });
      const created = res.data.data;
      const newCat: Category = {
        id: created.id,
        name: created.name,
        servicesCount: 0,
        status: 'Active',
        iconKey: newCategoryIcon,
      };
      setCategories(prev => [...prev, newCat]);
      setSelectedCategoryId(created.id);
      setShowAddCategoryModal(false);
      setNewCategoryName('');
      showToast(`Category "${created.name}" created successfully!`);
    } catch (err) {
      console.error('Failed to create category:', err);
      showToast('Failed to create category.');
    }
  };

  // Handle Edit Category Save
  const handleEditCategorySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;

    try {
      const res = await api.patch(`/categories/${editingCategory.id}`, {
        name: editCategoryName,
      });
      const updated = res.data.data;
      
      setCategories(prev =>
        prev.map(c => (c.id === editingCategory.id ? { ...c, name: updated.name } : c))
      );
      setShowEditCategoryModal(false);
      setEditingCategory(null);
      showToast('Category updated successfully!');
    } catch (err: unknown) {
      console.error(err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to update category.';
      toast.error(msg);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (cat: Category) => {
    if (cat.servicesCount > 0) {
      toast.error(`Cannot delete category "${cat.name}" as it contains ${cat.servicesCount} linked services.`);
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the category "${cat.name}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/categories/${cat.id}`);
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      if (selectedCategoryId === cat.id) {
        setSelectedCategoryId('');
      }
      showToast('Category deleted successfully.');
    } catch (err: unknown) {
      console.error(err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to delete category.';
      toast.error(msg);
    }
  };

  // Add Service Handler
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice.trim()) return;

    const basePriceNum = parseFloat(newServicePrice);
    if (isNaN(basePriceNum)) return;

    try {
      const res = await api.post('/services', {
        name: newServiceName,
        description: newServiceDesc,
        basePrice: basePriceNum,
        categoryId: selectedCategoryId,
      });
      const created = res.data.data;
      const newSrv: ServiceOffer = {
        id: created.id,
        categoryId: selectedCategoryId,
        name: created.name,
        description: created.description || '',
        basePrice: created.basePrice || created.price || 0,
        isActive: true,
      };
      setServices(prev => [...prev, newSrv]);
      setCategories(prev =>
        prev.map(c =>
          c.id === selectedCategoryId ? { ...c, servicesCount: c.servicesCount + 1 } : c
        )
      );
      setShowAddServiceModal(false);
      setNewServiceName('');
      setNewServiceDesc('');
      setNewServicePrice('');
      showToast(`Service "${created.name}" created successfully!`);
    } catch (err) {
      console.error('Failed to create service:', err);
      showToast('Failed to create service.');
    }
  };

  // Edit Service Clicked
  const handleOpenEditServiceModal = (srv: ServiceOffer) => {
    setEditingService(srv);
    setNewServiceName(srv.name);
    setNewServiceDesc(srv.description);
    setNewServicePrice(srv.basePrice.toString());
    setShowEditServiceModal(true);
  };

  // Edit Service Save
  const handleEditServiceSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !newServiceName.trim() || !newServicePrice.trim()) return;

    const basePriceNum = parseFloat(newServicePrice);
    if (isNaN(basePriceNum)) return;

    try {
      await api.patch(`/services/${editingService.id}`, {
        name: newServiceName,
        description: newServiceDesc,
        basePrice: basePriceNum,
      });
      setServices(prev =>
        prev.map(s =>
          s.id === editingService.id
            ? { ...s, name: newServiceName, description: newServiceDesc, basePrice: basePriceNum }
            : s
        )
      );
      setShowEditServiceModal(false);
      setEditingService(null);
      setNewServiceName('');
      setNewServiceDesc('');
      setNewServicePrice('');
      showToast('Service updated successfully!');
    } catch (err) {
      console.error('Failed to edit service:', err);
      showToast('Failed to update service.');
    }
  };

  // Delete Service
  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/services/${serviceId}`);
      setServices(prev => prev.filter(s => s.id !== serviceId));
      setCategories(prev =>
        prev.map(c =>
          c.id === selectedCategoryId ? { ...c, servicesCount: Math.max(0, c.servicesCount - 1) } : c
        )
      );
      showToast('Service deleted successfully.');
    } catch (err) {
      console.error('Failed to delete service:', err);
      showToast('Failed to delete service.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Categories & Services</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage service categories, pricing, and availability.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-800 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Categories List (Left) & Services Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ─── Left Side: Categories Panel (1/3rd width) ─── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            {/* Search Categories */}
            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 w-full max-w-[200px]">
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[11px] focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
            
            {/* Add Category Button */}
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm ml-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Category
            </button>
          </div>

          {/* Categories List Cards */}
          <div className="space-y-3">
            {filteredCategories.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10 bg-white border border-slate-100 rounded-2xl shadow-sm">
                No categories found.
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`relative border cursor-pointer rounded-2xl p-4 flex items-center justify-between transition-all duration-300 select-none shadow-sm ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-200 border-l-[4px] border-l-blue-600 pl-[15px]'
                        : 'bg-white border-slate-200/60 border-l-[4px] border-l-transparent pl-[15px] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {ICON_MAP[cat.iconKey] || <Droplet className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-none">{cat.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 mt-2 block">
                          {cat.servicesCount} Services
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(cat);
                          setEditCategoryName(cat.name);
                          setShowEditCategoryModal(true);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat);
                        }}
                        disabled={cat.servicesCount > 0}
                        className={`p-1 rounded-lg transition-colors ${
                          cat.servicesCount > 0 
                            ? 'text-slate-200 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-red-600 hover:bg-slate-50'
                        }`}
                        title={cat.servicesCount > 0 ? "Cannot delete category with services" : "Delete Category"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ─── Right Side: Selected Category Services (2/3rd width) ─── */}
        <div className="lg:col-span-8">
          {selectedCategory ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
              
              {/* Category Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl">
                    {ICON_MAP[selectedCategory?.iconKey || ''] || <Droplet className="h-6 w-6" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800 leading-none">
                      {selectedCategory?.name} Services
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-2">
                      Manage specific offerings within {selectedCategory?.name}.
                    </p>
                  </div>
                </div>

                {/* Add Service Button */}
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="flex items-center gap-1 px-4 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Service
                </button>
              </div>

              {/* Services List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Service Name</th>
                      <th className="px-6 py-4">Base Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {activeServices.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-slate-400 text-xs font-medium">
                          No services available in this category. Click &quot;Add Service&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      activeServices.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50/40 transition-colors">
                          
                          {/* Name & Description */}
                          <td className="px-6 py-4 max-w-[280px]">
                            <h4 className="font-semibold text-slate-800 text-sm leading-tight">
                              {srv.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium mt-1.5 truncate">
                              {srv.description}
                            </p>
                          </td>

                          {/* Base Price */}
                          <td className="px-6 py-4 font-extrabold text-slate-800">
                            ৳{srv.basePrice.toFixed(2)}
                          </td>

                          {/* Status Switch */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleServiceStatus(srv.id)}
                              className={`relative w-9 h-[20px] rounded-full transition-colors duration-300 ${
                                srv.isActive ? 'bg-blue-600' : 'bg-slate-200'
                              }`}
                            >
                              <span
                                className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                  srv.isActive ? 'left-[17px]' : 'left-[2px]'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditServiceModal(srv)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(srv.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            <div className="text-center text-slate-400 py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
              Please select a category on the left side to manage its services.
            </div>
          )}
        </div>

      </div>

      {/* ─── Add Category Modal ─── */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Add New Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appliance Repair"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Category Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {Object.keys(ICON_MAP).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewCategoryIcon(key)}
                      className={`p-3 border rounded-xl flex items-center justify-center transition-all ${
                        newCategoryIcon === key
                          ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                          : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {ICON_MAP[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Category Modal ─── */}
      {showEditCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Edit Category</h3>
              <button
                onClick={() => { setShowEditCategoryModal(false); setEditingCategory(null); }}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleEditCategorySave} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appliance Repair"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setShowEditCategoryModal(false); setEditingCategory(null); }}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Add Service to {selectedCategory?.name}</h3>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleAddService} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basin Leak Fix"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Description
                </label>
                <textarea
                  required
                  placeholder="Describe what this service covers..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Base Price (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="85.00"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Service Modal ─── */}
      {showEditServiceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Edit Service</h3>
              <button
                onClick={() => { setShowEditServiceModal(false); setEditingService(null); }}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleEditServiceSave} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basin Leak Fix"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Description
                </label>
                <textarea
                  required
                  placeholder="Describe what this service covers..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Base Price (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="85.00"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setShowEditServiceModal(false); setEditingService(null); }}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
