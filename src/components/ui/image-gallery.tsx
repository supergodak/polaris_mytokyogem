'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageGallery({ images, alt, className = '' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 画像が空の場合のフォールバック
  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  // 単一画像の場合はシンプルな表示
  if (images.length === 1) {
    return (
      <div className={`relative w-full h-64 ${className}`}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  // スクロール位置を監視してインジケーターを更新
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const clientWidth = scrollContainerRef.current.clientWidth;
      const totalScrollableWidth = scrollWidth - clientWidth;
      
      if (totalScrollableWidth > 0) {
        const scrollPercentage = scrollLeft / totalScrollableWidth;
        const newIndex = Math.round(scrollPercentage * (images.length - 1));
        setCurrentIndex(newIndex);
      }
    }
  };

  // 特定のインデックスへスクロール
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollWidth * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={className}>
      {/* 画像ギャラリー本体 */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full snap-center"
              >
                <div className="relative w-full h-64 md:h-96">
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 画像カウンター（右上） */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* タッチ操作のヒント（モバイルのみ） */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
            <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-2">
              <span>←</span>
              <span>スワイプで他の写真を見る</span>
              <span>→</span>
            </div>
          </div>
        )}
      </div>

      {/* インジケーター（ドット） */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`画像 ${index + 1} を表示`}
            />
          ))}
        </div>
      )}

      {/* サムネイル一覧（デスクトップのみ） */}
      {images.length > 1 && (
        <div className="hidden md:flex mt-4 space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Image
                src={image}
                alt={`サムネイル ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// CSS for hiding scrollbar
export const imageGalleryStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;