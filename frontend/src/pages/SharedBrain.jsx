import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Brain } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import { shareAPI } from '../services/api';

const SharedBrain = () => {
  const { shareId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const response = await shareAPI.getSharedContent(shareId);
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shared content');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-4 px-8">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Second Brain</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Shared Brain
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Shared by {data?.email}
          </p>
        </div>

        {data?.contents?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No content shared</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.contents?.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SharedBrain;
