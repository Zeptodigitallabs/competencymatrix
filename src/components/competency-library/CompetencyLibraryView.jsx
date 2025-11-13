import React, { useState, useEffect } from 'react';
import CompetencyModal from './CompetencyModal';
import CompetencyService from '../../services/CompetencyService';

function CompetencyLibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState(null);
  const [competencies, setCompetencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch competencies on component mount
  useEffect(() => {
    fetchCompetencies();
  }, []);

  const fetchCompetencies = async () => {
    try {
      setIsLoading(true);
      const data = await CompetencyService.getCompetencies();
      // Map the API response to match your component's expected format
      const formattedCompetencies = data.map(comp => ({
        id: comp.competencyId,
        name: comp.competencyName,
        category: comp.compCategoryId, // We'll map this to category name later
        levels: comp.maxLevel, // Using maxLevel as the number of levels
        minLevel: comp.minLevel,
        isActive: comp.isActive,
        // We'll need to fetch category names separately and map them
        linkedRoles: [] // This would come from a different API endpoint
      }));
      setCompetencies(formattedCompetencies);
    } catch (err) {
      setError('Failed to load competencies');
      console.error('Error fetching competencies:', err);
      // Optionally show a toast/notification to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add new competency
  const handleAddClick = () => {
    console.log('Add button clicked');
    setEditingCompetency(null);
    console.log('Setting isModalOpen to true');
    setIsModalOpen(true);
    console.log('isModalOpen should now be true');
  };

  // Handle edit competency
  const handleEditClick = (competency) => {
    setEditingCompetency(competency);
    setIsModalOpen(true);
  };

  // Handle save competency
  const handleSave = async (competency) => {
    try {
      setIsLoading(true);
      if (competency.id) {
        // Update existing competency
        const updatedCompetency = await CompetencyService.saveCompetency(competency);
        setCompetencies(prev => 
          prev.map(comp => comp.id === updatedCompetency.id ? updatedCompetency : comp)
        );
      } else {
        // Add new competency
        const newCompetency = await CompetencyService.saveCompetency(competency);
        setCompetencies(prev => [...prev, newCompetency]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save competency');
      console.error('Error saving competency:', err);
      throw err; // Re-throw to handle in the modal
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete competency
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this competency?')) {
      try {
        setIsLoading(true);
        // Call delete API
        await CompetencyService.deleteCompetency(id);
        // Remove the deleted competency from the local state
        setCompetencies(prev => prev.filter(comp => comp.id !== id));
        
        // Show success message or notification
        alert('Competency deleted successfully');
      } catch (err) {
        setError('Failed to delete competency');
        console.error('Error deleting competency:', err);
        // Show error message to the user
        alert('Failed to delete competency. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get unique categories for filter
  const categories = ['All', ...new Set(competencies.map(comp => comp.category))];

  // Filter competencies based on search and category
  const filteredCompetencies = competencies.filter(comp => {
    const name = comp?.name || '';
    const category = comp?.category || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = name.toLowerCase().includes(searchTermLower);
    const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
      {/* Header with title and Add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Competency Library</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          + Add Competency
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search competencies..."
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Competencies Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Levels
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linked Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompetencies.length > 0 ? (
                filteredCompetencies.map((competency) => (
                  <tr key={competency.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{competency.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{competency.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-4 h-4 rounded-full ${level <= (competency.levels || 5) ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            title={`Level ${level}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {competency.linkedRoles?.join(', ') || 'None'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(competency)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(competency.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No competencies found. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competency Modal */}
      {isModalOpen && (
        <CompetencyModal
          competency={editingCompetency}
          onClose={() => {
            console.log('Closing modal');
            setIsModalOpen(false);
          }}
          onSave={handleSave}
          onDelete={editingCompetency?.id ? handleDelete : null}
        />
      )}
    </div>
  );
}

export default CompetencyLibraryView;
