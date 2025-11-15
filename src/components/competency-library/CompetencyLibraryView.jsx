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
        category: comp.competencyName, // We'll map this to category name later
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
    setEditingCompetency(null);
    setIsModalOpen(true);
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
      // Save the competency
      await CompetencyService.saveCompetency(competency);

        // Close the modal
      setIsModalOpen(false);
      
      // After successful save, refresh the entire competencies list
      await fetchCompetencies();
      
    
      
      // Show success message
    } catch (err) {
      setError('Failed to save competency');
      console.error('Error saving competency:', {
        error: err,
        message: err.message,
        response: err.response
      });
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
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linked Roles
                </th> */}
                <th className="w-32 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {competency.linkedRoles?.join(', ') || 'None'}
                      </div>
                    </td> */}
                    <td className="w-32 px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(competency)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(competency.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
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
