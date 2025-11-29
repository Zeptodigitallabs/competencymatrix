import React, { useState, useEffect } from 'react';
import CompetencyService from '../../services/CompetencyService';

const CompetencyMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState(null);
  const [competencies, setCompetencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    competencyName: '',
    compCategoryId: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [comps, cats] = await Promise.all([
          CompetencyService.getCompetencies(),
          CompetencyService.getCompetencyCategories()
        ]);
        
        setCompetencies(Array.isArray(comps) ? comps : []);
        setCategories(Array.isArray(cats) ? cats : (cats?.data || []));
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setEditingCompetency(null);
    setFormData({
      competencyName: '',
      compCategoryId: categories[0]?.compCategoryId || ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (competency) => {
    setEditingCompetency(competency);
    setFormData({
      competencyName: competency.competencyName || '',
      compCategoryId: competency.compCategoryId || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (competencyId) => {
    if (window.confirm('Are you sure you want to delete this competency?')) {
      try {
        setIsLoading(true);
        await CompetencyService.deleteCompetency(competencyId);
        setCompetencies(prev => prev.filter(comp => comp.competencyId !== competencyId));
      } catch (err) {
        setError('Failed to delete competency');
        console.error('Error deleting competency:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.competencyName || !formData.compCategoryId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      if (editingCompetency) {
        await CompetencyService.updateCompetency(editingCompetency.competencyId, formData);
        setCompetencies(competencies.map(comp => 
          comp.competencyId === editingCompetency.competencyId 
            ? { ...comp, ...formData } 
            : comp
        ));
      } else {
        const newCompetency = await CompetencyService.saveCompetency(formData);
        setCompetencies([...competencies, newCompetency]);
      }
      setIsModalOpen(false);
      setFormData({ competencyName: '', compCategoryId: '' });
    } catch (error) {
      setError(`Failed to ${editingCompetency ? 'update' : 'create'} competency`);
      console.error('Error saving competency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter competencies based on search term
  const filteredCompetencies = competencies.filter(comp => 
    comp.competencyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categories.find(cat => cat.compCategoryId === comp.compCategoryId)?.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.compCategoryId === categoryId);
    return category ? category.categoryName : 'Uncategorized';
  };

  if (isLoading && competencies.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Competencies</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : '+ Add Competency'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="Search competencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Competencies Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competency Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompetencies.length > 0 ? (
                filteredCompetencies.map((competency) => (
                  <tr key={competency.competencyId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{competency.competencyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getCategoryName(competency.compCategoryId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(competency)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        disabled={isLoading}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(competency.competencyId)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No competencies found. {searchTerm ? 'Try a different search term.' : 'Add a new competency to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {editingCompetency ? 'Edit Competency' : 'Add New Competency'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Competency Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="competencyName"
                    value={formData.competencyName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="compCategoryId"
                    value={formData.compCategoryId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isLoading || categories.length === 0}
                  >
                    {categories.length === 0 ? (
                      <option value="">Loading categories...</option>
                    ) : (
                      categories.map(category => (
                        <option key={category.compCategoryId} value={category.compCategoryId}>
                          {category.categoryName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetencyMaster;
