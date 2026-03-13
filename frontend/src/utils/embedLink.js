const parseUrl = (value) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const getTwitterStatusId = (url) => {
  const match = url.pathname.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

const getYoutubeVideoId = (url) => {
  if (url.hostname.includes('youtu.be')) {
    return url.pathname.split('/').filter(Boolean)[0] || null;
  }

  if (url.searchParams.get('v')) {
    return url.searchParams.get('v');
  }

  const match = url.pathname.match(/\/(embed|shorts|v)\/([^/?]+)/);
  return match ? match[2] : null;
};

const getInstagramCode = (url) => {
  const match = url.pathname.match(/\/(p|reel|tv)\/([^/?]+)/);
  return match ? match[2] : null;
};

const getTikTokVideoId = (url) => {
  const match = url.pathname.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
};

const getSpotifyParts = (url) => {
  const match = url.pathname.match(/\/(track|album|playlist|episode|show)\/([^/?]+)/);
  return match ? { entityType: match[1], id: match[2] } : null;
};

const getPinterestId = (url) => {
  const match = url.pathname.match(/\/pin\/(\d+)/);
  return match ? match[1] : null;
};

const getFacebookEmbedUrl = (rawUrl) => {
  return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(rawUrl)}&show_text=true&width=500`;
};

const getRedditEmbedUrl = (url) => {
  return `https://www.redditmedia.com${url.pathname}?ref_source=embed&ref=share&embed=true`;
};

const getFallbackPreview = (rawUrl, type) => {
  const parsedUrl = parseUrl(rawUrl);
  const hostname = parsedUrl?.hostname?.replace(/^www\./, '') || 'external link';
  const pathname = parsedUrl?.pathname === '/' ? '' : parsedUrl?.pathname || '';
  const search = parsedUrl?.search || '';
  const previewText = `${hostname}${pathname}${search}`;

  return {
    mode: 'fallback',
    type,
    hostname,
    previewText,
    rawUrl,
  };
};

export const getEmbedPreview = (rawUrl, type) => {
  const parsedUrl = parseUrl(rawUrl);

  if (!parsedUrl) {
    return getFallbackPreview(rawUrl, type);
  }

  if (type === 'YOUTUBE') {
    const videoId = getYoutubeVideoId(parsedUrl);
    if (videoId) {
      return {
        mode: 'embed',
        src: `https://www.youtube.com/embed/${videoId}`,
        title: 'YouTube preview',
        aspectClassName: 'aspect-video',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      };
    }
  }

  if (type === 'TWITTER') {
    const statusId = getTwitterStatusId(parsedUrl);
    if (statusId) {
      return {
        mode: 'embed',
        src: `https://platform.twitter.com/embed/Tweet.html?id=${statusId}`,
        title: 'Tweet preview',
        aspectClassName: 'aspect-[4/5]',
      };
    }
  }

  if (type === 'INSTAGRAM') {
    const code = getInstagramCode(parsedUrl);
    if (code) {
      return {
        mode: 'embed',
        src: `https://www.instagram.com/p/${code}/embed`,
        title: 'Instagram preview',
        aspectClassName: 'aspect-[4/5]',
      };
    }
  }

  if (type === 'TIKTOK') {
    const videoId = getTikTokVideoId(parsedUrl);
    if (videoId) {
      return {
        mode: 'embed',
        src: `https://www.tiktok.com/embed/v2/${videoId}`,
        title: 'TikTok preview',
        aspectClassName: 'aspect-[9/16]',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      };
    }
  }

  if (type === 'SPOTIFY') {
    const spotifyParts = getSpotifyParts(parsedUrl);
    if (spotifyParts) {
      return {
        mode: 'embed',
        src: `https://open.spotify.com/embed/${spotifyParts.entityType}/${spotifyParts.id}`,
        title: 'Spotify preview',
        aspectClassName: 'aspect-square',
        allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      };
    }
  }

  if (type === 'FIGMA') {
    return {
      mode: 'embed',
      src: `https://www.figma.com/embed?embed_host=brainly&url=${encodeURIComponent(rawUrl)}`,
      title: 'Figma preview',
      aspectClassName: 'aspect-[4/3]',
    };
  }

  if (type === 'PINTEREST') {
    const pinId = getPinterestId(parsedUrl);
    if (pinId) {
      return {
        mode: 'embed',
        src: `https://assets.pinterest.com/ext/embed.html?id=${pinId}`,
        title: 'Pinterest preview',
        aspectClassName: 'aspect-[4/5]',
      };
    }
  }

  if (type === 'FACEBOOK') {
    return {
      mode: 'embed',
      src: getFacebookEmbedUrl(rawUrl),
      title: 'Facebook preview',
      aspectClassName: 'aspect-[4/5]',
        allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
    };
  }

  if (type === 'REDDIT') {
    return {
      mode: 'embed',
      src: getRedditEmbedUrl(parsedUrl),
      title: 'Reddit preview',
      aspectClassName: 'aspect-[4/5]',
    };
  }

  return getFallbackPreview(rawUrl, type);
};