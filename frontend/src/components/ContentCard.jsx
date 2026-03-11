import { Twitter, Youtube, FileText, Trash2, Instagram, Linkedin, Github, Link, Music, PenTool, Globe } from 'lucide-react';
import { getLinkTypeName } from '../utils/linkDetector';

const ContentCard = ({ content, onDelete }) => {
  const getIcon = () => {
    const icons = {
      TWITTER: <Twitter className="w-5 h-5 text-blue-400" />,
      YOUTUBE: <Youtube className="w-5 h-5 text-red-500" />,
      INSTAGRAM: <Instagram className="w-5 h-5 text-pink-500" />,
      LINKEDIN: <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      GITHUB: <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />,
      SPOTIFY: <Music className="w-5 h-5 text-green-500" />,
      FIGMA: <PenTool className="w-5 h-5 text-purple-500" />,
      DRIBBBLE: <PenTool className="w-5 h-5 text-pink-400" />,
      MEDIUM: <FileText className="w-5 h-5 text-gray-800 dark:text-gray-200" />,
      NOTION: <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      REDDIT: <Globe className="w-5 h-5 text-orange-500" />,
      FACEBOOK: <Globe className="w-5 h-5 text-blue-500" />,
      TIKTOK: <Globe className="w-5 h-5 text-gray-800 dark:text-gray-200" />,
      PINTEREST: <Globe className="w-5 h-5 text-red-600" />,
      LINK: <Link className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
    };
    return icons[content.type] || <Link className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
  };

  const getYoutubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = content.type === 'YOUTUBE' ? getYoutubeId(content.link) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md dark:shadow-gray-900/30 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
            {getLinkTypeName(content.type)}
          </h3>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(content.id)}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {content.type === 'YOUTUBE' && videoId ? (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline text-sm break-all"
          >
            {content.link}
          </a>
        </div>
      )}

      {content.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {content.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Added on {new Date(content.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ContentCard;
