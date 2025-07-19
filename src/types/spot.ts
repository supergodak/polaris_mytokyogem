export interface Spot {
  id: string;
  title: {
    ja: string;
    en: string;
  };
  description: {
    ja: string;
    en: string;
  };
  shortDescription: {
    ja: string;
    en: string;
  };
  images: string[];
  location: {
    lat: number;
    lng: number;
    hideExactLocation: boolean;
    address: {
      ja: string;
      en: string;
    };
  };
  primaryCategory: string;
  genre: string[];
  travelStyle: string[];
  soloFriendly: boolean;
  businessHours: {
    ja: string;
    en: string;
  };
  access: {
    ja: string;
    en: string;
  };
  tips: {
    ja: string;
    en: string;
  };
  isHidden: boolean;
  reactions: {
    interested: number;
    visited: number;
  };
  createdBy: string;
  createdAt: string;
}

export interface SpotList {
  spots: Spot[];
  lastUpdated: string;
}