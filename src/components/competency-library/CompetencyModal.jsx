import React, { useState, useEffect } from 'react';
import { store } from '../../store';
import CompetencyService from '../../services/CompetencyService';
import CompetencyCategoriesService from '../../services/CompetencyCategoriesService';

const CompetencyModal = ({ 
  competency, 
  onClose, 
  onSave,
  onDelete
}) => {
  const [localCompetency, setLocalCompetency] = useState(competency || {
    competencyId: 0,  // 0 indicates a new competency
    competencyName: '',
    compCategoryId: null,
    categoryName: '',
    minLevel: 1,
    maxLevel: 5,
    isActive: true,
    isDeleted: false
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await CompetencyCategoriesService.getCompetencyCategories();
        console.log('Categories response:', response);
        
        // Handle the response format from CompetencyCategoriesService
        const categoriesData = response;
        
        // Ensure we have an array of objects with at least id and name
        const formattedCategories = categoriesData.map(cat => ({
          id: cat.compCategoryId || cat.id,
          name: cat.categoryName || cat.name,
          value: cat.categoryName || cat.name
        }));
        
        setCategories(formattedCategories);
        
        // If this is a new competency and we have categories, set the first one as default
        if (!competency?.id && formattedCategories.length > 0) {
          setLocalCompetency(prev => ({
            ...prev,
            category: formattedCategories[0].value
          }));
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', {
          error: err,
          message: err.message,
          response: err.response
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [competency]);

  useEffect(() => {
    console.log('Competency:', competency);
    if (competency) {
      setLocalCompetency({
        ...competency
      });
    } else if (categories.length > 0) {
      // Set default values when creating a new competency
      setLocalCompetency({
        competencyId: 0,
        competencyName: '',
        compCategoryId: categories[0]?.id || null,
        categoryName: categories[0]?.name || '',
        minLevel: 1,
        maxLevel: 5,
        isActive: true,
        isDeleted: false
      });
    }
  }, [competency, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get institutionId from Redux store
    const state = store.getState();
    const institutionId = state.user?.userInfo?.institutionId;
    
    if (!institutionId) {
      setError('Institution ID not found. Please try again.');
      return;
    }
    
    // Find the selected category
    const selectedCategory = categories.find(cat => cat.id === localCompetency.compCategoryId);
    
    if (!selectedCategory && categories.length > 0) {
      // If no category is selected but we have categories, use the first one
      setLocalCompetency(prev => ({
        ...prev,
        compCategoryId: categories[0].id,
        categoryName: categories[0].name
      }));
      return;
    }
    
    // Prepare the data for the API
    const competencyData = {
      ...localCompetency,
      institutionId: institutionId,
      // Ensure we have the correct ID field name for the API
      competencyId: localCompetency.competencyId || 0
    };
    
    // Make sure we have the category ID
    if (selectedCategory) {
      competencyData.compCategoryId = selectedCategory.id;
      competencyData.categoryName = selectedCategory.name;
    }
    
    console.log('Saving competency:', competencyData);
    onSave(competencyData);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">
            {localCompetency.competencyId ? 'Edit Competency' : 'Add New Competency'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={localCompetency.competencyName || ''}
              onChange={(e) => setLocalCompetency(prev => ({
                ...prev,
                competencyName: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            {loading ? (
              <div className="mt-1 h-10 bg-gray-100 rounded-md animate-pulse"></div>
            ) : error ? (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            ) : (
              <select
                value={localCompetency.compCategoryId || ''}
                onChange={(e) => {
                  const selectedCategory = categories.find(cat => cat.id.toString() === e.target.value);
                  setLocalCompetency(prev => ({
                    ...prev,
                    compCategoryId: selectedCategory?.id || null,
                    categoryName: selectedCategory?.name || ''
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={loading || categories.length === 0}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
            
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Number of Levels (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={localCompetency.maxLevel || 5}
              onChange={(e) => setLocalCompetency(prev => ({ 
                ...prev, 
                maxLevel: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) 
              }))}
              className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <div>
              {localCompetency.id && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(localCompetency.id)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {localCompetency.competencyId ? 'Update' : 'Create'} Competency
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetencyModal;
