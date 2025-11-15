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
    name: '',
    category: '',
    levels: 5
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
    setLocalCompetency(competency || {
      name: '',
      category: '',
      levels: 5
    });
  }, [competency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get institutionId from Redux store
    const state = store.getState();
    const institutionId = state.user?.userInfo?.institutionId;
    
    if (!institutionId) {
      setError('Institution ID not found. Please try again.');
      return;
    }
    
    // Find the selected category to get its ID
    const selectedCategory = categories.find(
      cat => cat.name === localCompetency.category || cat.value === localCompetency.category
    );
    
    if (!selectedCategory) {
      setError('Please select a valid category');
      return;
    }
    
    // Format the data according to the API's expected structure
    const competencyData = {
      competencyId: localCompetency.id || 0, // 0 for new competency
      compCategoryId: selectedCategory.id,
      institutionId: institutionId,
      competencyName: localCompetency.name,
      minLevel: 1, // Default minimum level
      maxLevel: localCompetency.levels || 5,
      isActive: true,
      isDeleted: false
    };
    
    console.log('Saving competency:', competencyData);
    onSave(competencyData);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">
            {localCompetency.id ? 'Edit Competency' : 'Add New Competency'}
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
              value={localCompetency.name}
              onChange={(e) => setLocalCompetency(prev => ({ ...prev, name: e.target.value }))}
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
                value={localCompetency.category}
                onChange={(e) => setLocalCompetency(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={loading}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Levels (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={localCompetency.levels || 5}
              onChange={(e) => setLocalCompetency(prev => ({ 
                ...prev, 
                levels: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) 
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
                {localCompetency.id ? 'Update' : 'Create'} Competency
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetencyModal;
