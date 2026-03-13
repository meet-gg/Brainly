import { Twitter, Youtube, FileText, Trash2, Instagram, Linkedin, Github, Link, Music, PenTool, Globe, ExternalLink } from 'lucide-react';
import { getLinkTypeName } from '../utils/linkDetector';
import { getEmbedPreview } from '../utils/embedLink';

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

  const preview = getEmbedPreview(content.link, content.type);

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

      {preview.mode === 'embed' ? (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-700">
          <iframe
            src={preview.src}
            title={preview.title}
            className={`w-full ${preview.aspectClassName}`}
            allow={preview.allow}
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                {preview.hostname}
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 break-all">
                {preview.previewText}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
              {getIcon()}
            </div>
          </div>

          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            Open source
            <ExternalLink className="w-4 h-4" />
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
