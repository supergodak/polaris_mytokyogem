import { Spot, SpotList } from '@/types/spot';
import spotsData from '../../data/spots.json';

export function getAllSpots(): Spot[] {
  return (spotsData as SpotList).spots;
}

export function getSpotById(id: string): Spot | null {
  const spots = getAllSpots();
  return spots.find(spot => spot.id === id) || null;
}

export function getSpotsByGenre(genre: string): Spot[] {
  const spots = getAllSpots();
  return spots.filter(spot => spot.genre.includes(genre));
}

export function getSoloFriendlySpots(): Spot[] {
  const spots = getAllSpots();
  return spots.filter(spot => spot.soloFriendly);
}