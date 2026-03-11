// Detect link type from URL
export const detectLinkType = (url) => {
  if (!url) return 'LINK';
  
  const lowerUrl = url.toLowerCase();
  
  // YouTube
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'YOUTUBE';
  }
  
  // Twitter/X
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return 'TWITTER';
  }
  
  // Instagram
  if (lowerUrl.includes('instagram.com')) {
    return 'INSTAGRAM';
  }
  
  // LinkedIn
  if (lowerUrl.includes('linkedin.com')) {
    return 'LINKEDIN';
  }
  
  // GitHub
  if (lowerUrl.includes('github.com')) {
    return 'GITHUB';
  }
  
  // Reddit
  if (lowerUrl.includes('reddit.com')) {
    return 'REDDIT';
  }
  
  // Facebook
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
    return 'FACEBOOK';
  }
  
  // TikTok
  if (lowerUrl.includes('tiktok.com')) {
    return 'TIKTOK';
  }
  
  // Medium
  if (lowerUrl.includes('medium.com')) {
    return 'MEDIUM';
  }
  
  // Notion
  if (lowerUrl.includes('notion.so') || lowerUrl.includes('notion.site')) {
    return 'NOTION';
  }
  
  // Figma
  if (lowerUrl.includes('figma.com')) {
    return 'FIGMA';
  }
  
  // Dribbble
  if (lowerUrl.includes('dribbble.com')) {
    return 'DRIBBBLE';
  }
  
  // Spotify
  if (lowerUrl.includes('spotify.com')) {
    return 'SPOTIFY';
  }
  
  // Pinterest
  if (lowerUrl.includes('pinterest.com')) {
    return 'PINTEREST';
  }
  
  // Default
  return 'LINK';
};

// Get display name for link type
export const getLinkTypeName = (type) => {
  const names = {
    YOUTUBE: 'Video',
    TWITTER: 'Tweet',
    INSTAGRAM: 'Instagram',
    LINKEDIN: 'LinkedIn',
    GITHUB: 'GitHub',
    REDDIT: 'Reddit',
    FACEBOOK: 'Facebook',
    TIKTOK: 'TikTok',
    MEDIUM: 'Article',
    NOTION: 'Notion',
    FIGMA: 'Design',
    DRIBBBLE: 'Design',
    SPOTIFY: 'Music',
    PINTEREST: 'Pin',
    LINK: 'Link',
  };
  return names[type] || 'Link';
};
