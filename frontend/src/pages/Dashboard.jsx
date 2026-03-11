import { useState, useEffect } from 'react';
import { Share2, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ContentCard from '../components/ContentCard';
import ShareModal from '../components/ShareModal';
import AddContentModal from '../components/AddContentModal';
import { contentAPI } from '../services/api';
import { getLinkTypeName } from '../utils/linkDetector';

const Dashboard = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchContents = async () => {
    try {
      const response = await contentAPI.getAll();
      setContents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await contentAPI.delete(id);
      setContents(contents.filter((content) => content.id !== id));
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const filteredContents = activeFilter
    ? contents.filter((content) => content.type === activeFilter)
    : contents;

  const getTitle = () => {
    if (!activeFilter) return 'All Notes';
    return getLinkTypeName(activeFilter) + 's';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
            >
              <Share2 className="w-4 h-4" />
              Share Brain
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Add Content
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No content found</p>
            <p className="text-sm mt-1">Click "Add Content" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        contentCount={contents.length}
      />

      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onContentAdded={fetchContents}
      />
    </div>
  );
};

export default Dashboard;
