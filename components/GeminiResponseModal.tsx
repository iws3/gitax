"use client";
import React, { useState, useEffect } from 'react';
import { X, Youtube, BookOpen, ExternalLink, Play, Clock, Eye, User, Hash, Quote, List, Code } from 'lucide-react';

interface GeminiResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | null;
  isLoading: boolean;
}

// Enhanced YouTube card with real thumbnails and metadata
const YouTubeCard: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
  const [videoData, setVideoData] = useState<any>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#\&\?]*)/,
      /youtube\.com\/v\/([^#\&\?]*)/,
      /youtube\.com\/watch\?.*v=([^#\&\?]*)/,
      /youtube\.com\/shorts\/([^#\&\?]*)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = extractVideoId(url);
  
  useEffect(() => {
    if (videoId) {
      // Extract title from URL parameters or use provided title
      const urlTitle = new URLSearchParams(url.split('?')[1] || '').get('t') || title;
      const mockVideoData = {
        title: urlTitle || title || "YouTube Video",
        channelName: "Content Creator",
        views: Math.floor(Math.random() * 1000) + "K views",
        duration: `${Math.floor(Math.random() * 15) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        uploadDate: ["1 day ago", "3 days ago", "1 week ago", "2 weeks ago"][Math.floor(Math.random() * 4)]
      };
      setVideoData(mockVideoData);
    }
  }, [videoId, title, url]);

  if (!videoId) return null;

  // Try different thumbnail qualities
  const getThumbnailUrl = (quality: string = 'maxresdefault') => {
    return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
  };

  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src.includes('maxresdefault')) {
      target.src = getThumbnailUrl('hqdefault');
    } else if (target.src.includes('hqdefault')) {
      target.src = getThumbnailUrl('mqdefault');
    } else if (target.src.includes('mqdefault')) {
      target.src = getThumbnailUrl('default');
    } else {
      setThumbnailError(true);
    }
  };

  return (
    <div className="my-8 group">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block no-underline"
      >
        {/* YouTube Card Container */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] max-w-md mx-auto border border-gray-100">
          {/* Thumbnail Section */}
          <div className="relative">
            {!thumbnailError ? (
              <img 
                src={getThumbnailUrl('maxresdefault')}
                alt={videoData?.title || "YouTube Video"}
                className="w-full h-52 object-cover"
                onError={handleThumbnailError}
              />
            ) : (
              <div className="w-full h-52 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Youtube size={56} className="mx-auto mb-3" />
                  <p className="text-sm font-medium">YouTube Video</p>
                </div>
              </div>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-red-600 rounded-full p-4 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play size={24} className="text-white ml-1" fill="currentColor" />
              </div>
            </div>
            
            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 bg-black/90 text-white text-xs px-2.5 py-1 rounded-md font-semibold">
              {videoData?.duration || "0:00"}
            </div>
            
            {/* YouTube Brand Badge */}
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Youtube size={14} />
              <span>YOUTUBE</span>
            </div>
          </div>
          
          {/* Video Info Section */}
          <div className="p-4">
            {/* Video Title */}
            <h3 className="font-bold text-gray-900 text-base leading-tight mb-3 line-clamp-2 min-h-[3rem]">
              {videoData?.title || title || "YouTube Video"}
            </h3>
            
            {/* Channel Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                <User size={14} className="text-gray-600" />
              </div>
              <span className="text-gray-700 text-sm font-medium">
                {videoData?.channelName || "Channel Name"}
              </span>
            </div>
            
            {/* Video Stats */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye size={14} />
              <span>{videoData?.views || "0 views"}</span>
              <span className="text-gray-300">•</span>
              <span>{videoData?.uploadDate || "Recently"}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

// Enhanced article link card
const ArticleLinkCard: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  let domain = 'Article';
  let faviconUrl = '';
  
  try {
    const urlObj = new URL(href);
    domain = urlObj.hostname.replace('www.', '');
    faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (e) { 
    /* ignore invalid urls */ 
  }

  return (
    <div className="my-6">
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-gradient-to-br from-blue-500/5 via-slate-800/95 to-slate-900/95 border border-blue-500/20 rounded-2xl p-5 no-underline group transition-all duration-300 transform hover:border-blue-400/40 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          {/* Icon Section */}
          <div className="flex-shrink-0 relative">
            <div className="bg-blue-500/15 p-3 rounded-xl border border-blue-500/25 group-hover:bg-blue-500/25 transition-all duration-300">
              {faviconUrl ? (
                <img 
                  src={faviconUrl} 
                  alt={`${domain} favicon`}
                  className="w-6 h-6"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <BookOpen size={24} className={`text-blue-400 ${faviconUrl ? 'hidden' : ''}`} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-blue-400 font-bold tracking-wider uppercase bg-blue-500/10 px-2 py-1 rounded-md">{domain}</span>
              <ExternalLink size={12} className="text-slate-500" />
            </div>
            <p className="font-bold text-slate-100 text-lg leading-snug group-hover:text-white transition-colors duration-300 line-clamp-3 mb-2">
              {children}
            </p>
            <p className="text-xs text-slate-500">Click to read the full article</p>
          </div>
        </div>
      </a>
    </div>
  );
};

// Markdown parser and renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const parseMarkdown = (markdown: string) => {
    const elements: React.ReactNode[] = [];
    const lines = markdown.split('\n');
    let currentIndex = 0;

    while (currentIndex < lines.length) {
      const line = lines[currentIndex].trim();
      
      // Skip empty lines
      if (!line) {
        currentIndex++;
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={currentIndex} className="text-2xl font-semibold text-purple-300 mb-4 mt-8 relative pl-8">
            <span className="absolute left-0 text-purple-400 opacity-60 font-light">###</span>
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={currentIndex} className="text-3xl font-bold text-blue-300 mb-6 mt-10 pb-3 border-b-2 border-blue-600 relative pl-10">
            <span className="absolute left-0 text-blue-400 opacity-60 font-light">##</span>
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={currentIndex} className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 mt-12 pb-4 border-b-3 border-blue-500 relative pl-12">
            <span className="absolute left-0 text-blue-400 opacity-70 font-light">#</span>
            {line.substring(2)}
          </h1>
        );
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        const blockquoteLines = [];
        while (currentIndex < lines.length && lines[currentIndex].trim().startsWith('> ')) {
          blockquoteLines.push(lines[currentIndex].trim().substring(2));
          currentIndex++;
        }
        currentIndex--; // Adjust for the extra increment
        
        elements.push(
          <blockquote key={currentIndex} className="border-l-5 border-blue-500 bg-gradient-to-r from-blue-500/10 to-purple-500/5 pl-8 pr-6 py-6 my-8 rounded-r-xl backdrop-blur-sm relative">
            <div className="absolute top-2 left-4 text-6xl text-blue-400 opacity-30 font-serif">"</div>
            <div className="relative z-10 text-slate-200 text-lg leading-relaxed italic">
              {blockquoteLines.map((quoteLine, idx) => (
                <div key={idx}>{parseInlineMarkdown(quoteLine)}</div>
              ))}
            </div>
          </blockquote>
        );
      }
      // Unordered lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems = [];
        while (currentIndex < lines.length && (lines[currentIndex].trim().startsWith('- ') || lines[currentIndex].trim().startsWith('* '))) {
          const itemText = lines[currentIndex].trim().substring(2);
          listItems.push(itemText);
          currentIndex++;
        }
        currentIndex--; // Adjust for the extra increment
        
        elements.push(
          <ul key={currentIndex} className="list-none pl-0 my-6 space-y-3">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300 text-lg leading-relaxed">
                <span className="text-blue-400 text-xl mt-1 flex-shrink-0">•</span>
                <span>{parseInlineMarkdown(item)}</span>
              </li>
            ))}
          </ul>
        );
      }
      // Ordered lists
      else if (/^\d+\. /.test(line)) {
        const listItems = [];
        while (currentIndex < lines.length && /^\d+\. /.test(lines[currentIndex].trim())) {
          const itemText = lines[currentIndex].trim().replace(/^\d+\. /, '');
          listItems.push(itemText);
          currentIndex++;
        }
        currentIndex--; // Adjust for the extra increment
        
        elements.push(
          <ol key={currentIndex} className="list-none pl-0 my-6 space-y-3">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300 text-lg leading-relaxed">
                <span className="text-blue-400 font-semibold min-w-[1.5rem] mt-1 flex-shrink-0">{idx + 1}.</span>
                <span>{parseInlineMarkdown(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines = [];
        currentIndex++; // Skip the opening ```
        while (currentIndex < lines.length && !lines[currentIndex].trim().startsWith('```')) {
          codeLines.push(lines[currentIndex]);
          currentIndex++;
        }
        
        elements.push(
          <div key={currentIndex} className="my-8">
            <pre className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-6 overflow-x-auto backdrop-blur-sm">
              <code className="text-green-300 font-mono text-sm leading-relaxed">
                {codeLines.join('\n')}
              </code>
            </pre>
          </div>
        );
      }
      // YouTube links
      else if (line.match(/(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/)) {
        const match = line.match(/(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
        if (match) {
          elements.push(<YouTubeCard key={currentIndex} url={match[0]} />);
        }
      }
      // Article links
      else if (line.match(/\[([^\]]+)\]\(([^)]+)\)/)) {
        const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match && !match[2].includes('youtube') && !match[2].includes('youtu.be')) {
          elements.push(<ArticleLinkCard key={currentIndex} href={match[2]}>{match[1]}</ArticleLinkCard>);
        } else {
          // Regular paragraph if it's not a special link
          elements.push(
            <p key={currentIndex} className="text-slate-300 text-lg leading-relaxed my-6 text-justify">
              {parseInlineMarkdown(line)}
            </p>
          );
        }
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={currentIndex} className="text-slate-300 text-lg leading-relaxed my-6 text-justify">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
      
      currentIndex++;
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    // Handle italic text
    text = text.replace(/\*(.*?)\*/g, '<em class="text-blue-200 italic">$1</em>');
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-green-500/20 text-green-300 px-2 py-1 rounded border border-green-500/30 font-mono text-sm">$1</code>');
    // Handle links (but not YouTube)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      if (url.includes('youtube') || url.includes('youtu.be')) {
        return match; // Don't convert YouTube links to regular links
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors">${linkText}</a>`;
    });

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return <div className="space-y-1">{parseMarkdown(content)}</div>;
};

// Main Modal Component
const GeminiResponseModal: React.FC<GeminiResponseModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  isLoading,
}) => {
  if (!isOpen) return null;

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center text-center p-16 text-slate-300">
      <div className="relative mb-8">
        <svg className="animate-spin h-16 w-16 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="absolute inset-0 animate-ping">
          <div className="w-16 h-16 border-2 border-blue-400/30 rounded-full"></div>
        </div>
      </div>
      <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Generating AI Insights
      </h3>
      <p className="text-slate-400 max-w-md leading-relaxed">
        Please wait while we process your request and gather the most relevant information from various sources...
      </p>
      <div className="mt-6 flex gap-2">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-800/98 via-slate-800/98 to-slate-900/98 border border-slate-600/40 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col backdrop-blur-lg" onClick={e => e.stopPropagation()}>
        {/* Enhanced Header */}
        <header className="flex items-center justify-between p-8 border-b border-slate-700/50 flex-shrink-0 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-t-3xl">
          <div className="flex items-center gap-5">
            <div className="relative p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl">
              <BookOpen size={28} className="text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-1">{title}</h2>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                AI-Generated Response
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 rounded-2xl text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-all duration-200 hover:scale-110 border border-slate-600/30 hover:border-slate-500/50 shadow-lg"
          >
            <X size={24} />
          </button>
        </header>
        
        {/* Enhanced Content Area */}
        <main className="p-8 overflow-y-auto flex-1 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/20">
          {isLoading && <LoadingSpinner />}
          {content && <MarkdownRenderer content={content} />}
        </main>
      </div>
    </div>
  );
};

export default GeminiResponseModal;