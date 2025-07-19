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
    address: {
      ja: string;
      en: string;
    };
  };
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
  publishedAt: string;
  expiresAt: string;
  reactions: {
    interested: number;
    visited: number;
  };
  createdBy: string;
}

export interface SpotList {
  spots: Spot[];
  lastUpdated: string;
}