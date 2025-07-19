'use client';

import { useState } from 'react';
import { Button } from './button';

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ lat, lng, onLocationChange }: LocationPickerProps) {
  const [inputLat, setInputLat] = useState(lat.toString());
  const [inputLng, setInputLng] = useState(lng.toString());

  const handleInputChange = () => {
    const newLat = parseFloat(inputLat);
    const newLng = parseFloat(inputLng);
    
    if (!isNaN(newLat) && !isNaN(newLng)) {
      onLocationChange(newLat, newLng);
    }
  };

  const presetLocations = [
    { name: '渋谷駅', lat: 35.6598, lng: 139.7006 },
    { name: '新宿駅', lat: 35.6896, lng: 139.7006 },
    { name: '池袋駅', lat: 35.7295, lng: 139.7109 },
    { name: '原宿駅', lat: 35.6702, lng: 139.7016 },
    { name: '浅草駅', lat: 35.7148, lng: 139.7967 },
    { name: '上野駅', lat: 35.7141, lng: 139.7774 },
    { name: '銀座駅', lat: 35.6717, lng: 139.7646 },
    { name: '東京駅', lat: 35.6812, lng: 139.7671 }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            緯度 *
          </label>
          <input
            type="number"
            step="0.000001"
            required
            value={inputLat}
            onChange={(e) => setInputLat(e.target.value)}
            onBlur={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="35.676191"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            経度 *
          </label>
          <input
            type="number"
            step="0.000001"
            required
            value={inputLng}
            onChange={(e) => setInputLng(e.target.value)}
            onBlur={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="139.650311"
          />
        </div>
      </div>

      {/* プリセット位置 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          よく使う場所から選択
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presetLocations.map((location) => (
            <Button
              key={location.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setInputLat(location.lat.toString());
                setInputLng(location.lng.toString());
                onLocationChange(location.lat, location.lng);
              }}
              className="text-xs"
            >
              {location.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Google Maps リンク */}
      <div className="flex space-x-2">
        <a
          href={`https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          📍 現在の位置を地図で確認
        </a>
        <a
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          🗺️ Google Mapsで場所を探す
        </a>
      </div>

      {/* ヒント */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Google Mapsで場所を右クリックして座標をコピーできます</p>
        <p>• 正確な位置情報により、ユーザーが場所を見つけやすくなります</p>
        <p>• 隠れ家スポットの場合は「詳細位置を表示しない」にチェック</p>
      </div>
    </div>
  );
}