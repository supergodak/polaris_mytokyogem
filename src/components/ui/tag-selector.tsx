'use client';

import { useState, useRef, useEffect } from 'react';
import { searchTags, getLocalizedTag, PRIMARY_CATEGORIES, GENRE_TAGS, TRAVEL_STYLE_TAGS, Tag } from '@/lib/tags';
import { useLanguage } from '@/contexts/LanguageContext';

interface TagSelectorProps {
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagSelector({ selectedTags, onTagChange, placeholder, maxTags }: TagSelectorProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{key: string, tag: Tag}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const results = searchTags(query, language);
      // 既に選択されているタグを除外
      const filteredResults = results.filter(({ key }) => !selectedTags.includes(key));
      setSuggestions(filteredResults);
      setShowSuggestions(true);
      setFocusedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, selectedTags, language]);

  const addTag = (tagKey: string) => {
    if (!selectedTags.includes(tagKey) && (!maxTags || selectedTags.length < maxTags)) {
      onTagChange([...selectedTags, tagKey]);
    }
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagKey: string) => {
    onTagChange(selectedTags.filter(tag => tag !== tagKey));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        addTag(suggestions[focusedIndex].key);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  const getTagCategory = (tagKey: string): string => {
    if (PRIMARY_CATEGORIES[tagKey]) return language === 'ja' ? '基本カテゴリー' : 'Category';
    if (GENRE_TAGS[tagKey]) return language === 'ja' ? 'ジャンル' : 'Genre';
    if (TRAVEL_STYLE_TAGS[tagKey]) return language === 'ja' ? '旅行スタイル' : 'Travel Style';
    return '';
  };

  const getTagCategoryColor = (tagKey: string): string => {
    if (PRIMARY_CATEGORIES[tagKey]) return 'bg-purple-100 text-purple-800';
    if (GENRE_TAGS[tagKey]) return 'bg-blue-100 text-blue-800';
    if (TRAVEL_STYLE_TAGS[tagKey]) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-lg p-3 min-h-[100px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {/* 選択済みタグ */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tagKey) => (
            <span
              key={tagKey}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagCategoryColor(tagKey)}`}
            >
              {getLocalizedTag(tagKey, language)}
              <button
                type="button"
                onClick={() => removeTag(tagKey)}
                className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-black hover:bg-opacity-20"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* 入力欄 */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0)}
          placeholder={placeholder || (language === 'ja' ? 'タグを検索...' : 'Search tags...')}
          className="w-full border-none outline-none text-sm"
          disabled={maxTags ? selectedTags.length >= maxTags : false}
        />
      </div>

      {/* サジェスト */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map(({ key, tag }, index) => (
            <button
              key={key}
              type="button"
              onClick={() => addTag(key)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between ${
                index === focusedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-sm">
                {language === 'ja' ? tag.ja : tag.en}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${getTagCategoryColor(key)}`}>
                {getTagCategory(key)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ヒント */}
      <div className="mt-2 text-xs text-gray-500">
        {language === 'ja' 
          ? `${selectedTags.length}個選択中${maxTags ? ` (最大${maxTags}個)` : ''}`
          : `${selectedTags.length} selected${maxTags ? ` (max ${maxTags})` : ''}`
        }
      </div>
    </div>
  );
}