import { Spot } from '@/types/spot';

export function generateGoogleMapsUrl(spot: Spot): string {
  const { lat, lng } = spot.location;
  
  // 緯度経度でピンを表示し、適切なズームレベルで開く
  return `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z`;
}

export function generateGoogleMapsSearchUrl(address: string): string {
  // 住所で検索
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/${encodedAddress}`;
}

export function generateGoogleMapsDirectionsUrl(spot: Spot): string {
  const { lat, lng } = spot.location;
  
  // 現在地からの経路案内
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}