import { useState, useEffect } from 'react';
import { X, Youtube, Twitter, Instagram, Linkedin, Github, Link, Music, FileText, AlertCircle } from 'lucide-react';
import { contentAPI } from '../services/api';
import { detectLinkType, getLinkTypeName } from '../utils/linkDetector';

const typeIcons = {
  YOUTUBE: <Youtube className="w-5 h-5 text-red-500" />,
  TWITTER: <Twitter className="w-5 h-5 text-blue-400" />,
  INSTAGRAM: <Instagram className="w-5 h-5 text-pink-500" />,
  LINKEDIN: <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  GITHUB: <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />,
  SPOTIFY: <Music className="w-5 h-5 text-green-500" />,
  LINK: <Link className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
};

const AddContentModal = ({ isOpen, onClose, onContentAdded }) => {
  const [link, setLink] = useState('');
  const [detectedType, setDetectedType] = useState('LINK');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (link) {
      setDetectedType(detectLinkType(link));
    } else {
      setDetectedType('LINK');
    }
  }, [link]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const tagsArray = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);
      
      if (tagsArray.length === 0) {
        setFieldErrors({ tags: 'At least one tag is required' });
        setLoading(false);
        return;
      }

      await contentAPI.create({
        link,
        type: detectedType,
        tags: tagsArray,
      });

      setLink('');
      setTags('');
      setDetectedType('LINK');
      onContentAdded();
      onClose();
    } catch (err) {
      const response = err.response?.data;
      
      // Handle field-specific validation errors
      if (response?.errors && Array.isArray(response.errors)) {
        const errors = {};
        response.errors.forEach((e) => {
          if (e.field) {
            errors[e.field] = e.message;
          }
        });
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
        } else {
          setError(response?.message || 'Failed to add content');
        }
      } else {
        setError(response?.message || 'Failed to add content');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLink('');
    setTags('');
    setDetectedType('LINK');
    setError('');
    setFieldErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Content</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-start gap-2 select-text cursor-default">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 pointer-events-none" />
              <span className="pointer-events-auto">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                fieldErrors.link ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'
              }`}
              placeholder="Paste any link here..."
              required
            />
            {fieldErrors.link && (
              <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1 select-text">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fieldErrors.link}</span>
              </p>
            )}
          </div>

          {link && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {typeIcons[detectedType] || <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Detected as <span className="font-medium text-gray-900 dark:text-white">{getLinkTypeName(detectedType)}</span>
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                fieldErrors.tags ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'
              }`}
              placeholder="productivity, learning, tech"
              required
            />
            {fieldErrors.tags && (
              <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1 select-text">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fieldErrors.tags}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Content'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContentModal;
