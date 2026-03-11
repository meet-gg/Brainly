import { Brain, Twitter, Youtube, FileText, Link, LogOut, Instagram, Linkedin, Github, Music, Globe, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeFilter, setActiveFilter }) => {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'TWITTER', label: 'Tweets', icon: Twitter },
    { id: 'YOUTUBE', label: 'Videos', icon: Youtube },
    { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram },
    { id: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin },
    { id: 'GITHUB', label: 'GitHub', icon: Github },
    { id: 'SPOTIFY', label: 'Music', icon: Music },
    { id: 'LINK', label: 'Other Links', icon: Link },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-screen fixed left-0 top-0 flex flex-col transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Brainly</span>
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveFilter(null)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                activeFilter === null
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">All Notes</span>
            </button>
          </li>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveFilter(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                  activeFilter === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
