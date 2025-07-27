'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './button';

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export function ImageUpload({ onImagesChange, maxImages = 5, existingImages = [] }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = selectedFiles.length + existingImages.length;
    
    if (totalImages + files.length > maxImages) {
      alert(`最大${maxImages}枚まで選択できます`);
      return;
    }

    // 画像ファイルのみフィルタリング
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      alert('画像ファイルのみ選択してください');
    }

    const newFiles = [...selectedFiles, ...imageFiles];
    setSelectedFiles(newFiles);
    onImagesChange(newFiles);

    // プレビューURL生成
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    
    // 古いURLを解放
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    onImagesChange(newFiles);
  };

  const removeExistingImage = (index: number) => {
    // TODO: 既存画像の削除処理
    console.log('Remove existing image:', existingImages[index]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          画像アップロード（最大{maxImages}枚）
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={selectedFiles.length + existingImages.length >= maxImages}
        >
          画像を選択
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 既存画像のプレビュー */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">既存の画像</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="relative w-full h-32">
                  <Image
                    src={url}
                    alt={`既存画像 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border border-gray-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 新規画像のプレビュー */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            選択した画像（{selectedFiles.length}枚）
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="relative w-full h-32">
                  <Image
                    src={url}
                    alt={`プレビュー ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border border-gray-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {Math.round(selectedFiles[index].size / 1024)}KB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ドラッグ&ドロップエリア */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const imageFiles = files.filter(file => file.type.startsWith('image/'));
          if (imageFiles.length > 0) {
            handleFileSelect({ target: { files: imageFiles } } as unknown as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        <div className="text-gray-500">
          <p className="text-sm">画像をドラッグ&ドロップするか、上のボタンで選択してください</p>
          <p className="text-xs mt-1">JPG, PNG, GIF対応（各ファイル最大10MB）</p>
        </div>
      </div>

      {/* ヒント */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• 1枚目の画像がメイン画像として使用されます</p>
        <p>• 高画質で明るい画像を選択することをお勧めします</p>
        <p>• PoCフェーズでは画像は一時的に保存されます</p>
      </div>
    </div>
  );
}