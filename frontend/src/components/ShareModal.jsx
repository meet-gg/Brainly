import { useEffect, useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { shareAPI } from '../services/api';

const ShareModal = ({ isOpen, onClose, contentCount }) => {
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchShareStatus = async () => {
      setStatusLoading(true);
      try {
        const response = await shareAPI.getStatus();
        const { shared: isShared, shareLink: link } = response.data.data;
        setShared(isShared);
        setShareLink(isShared && link ? `${window.location.origin}${link}` : null);
      } catch (error) {
        console.error('Failed to load share status:', error);
        setShared(false);
        setShareLink(null);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchShareStatus();
  }, [isOpen]);

  const handleShare = async () => {
    setLoading(true);
    try {
      const response = await shareAPI.toggle();
      const { shared: isShared, shareLink: link } = response.data.data;
      setShared(isShared);
      if (isShared && link) {
        setShareLink(`${window.location.origin}${link}`);
      } else {
        setShareLink(null);
      }
    } catch (error) {
      console.error('Failed to toggle share:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShareLink(null);
    setShared(false);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  const isBusy = loading || statusLoading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Share Your Second Brain
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Share your entire collection of notes, documents, tweets, and videos with others. They'll be able to import your content into their own Second Brain.
        </p>

        {statusLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : shareLink ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={handleShare}
              disabled={isBusy}
              className="w-full py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Stop Sharing'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleShare}
            disabled={isBusy}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            <Copy className="w-5 h-5" />
            {loading ? 'Processing...' : shared ? 'Stop Sharing' : 'Share Brain'}
          </button>
        )}

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
          {contentCount} items will be shared
        </p>
      </div>
    </div>
  );
};

export default ShareModal;
