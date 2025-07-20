// Google Analytics イベントトラッキング用ヘルパー関数

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters: Record<string, any>
    ) => void;
  }
}

// スポット閲覧イベント
export const trackSpotView = (spotId: string, spotTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'engagement',
      event_label: spotTitle,
      item_id: spotId,
    });
  }
};

// お気に入り追加イベント
export const trackFavoriteAdd = (spotId: string, spotTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_wishlist', {
      event_category: 'engagement',
      event_label: spotTitle,
      item_id: spotId,
    });
  }
};

// お気に入り削除イベント
export const trackFavoriteRemove = (spotId: string, spotTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remove_from_wishlist', {
      event_category: 'engagement',
      event_label: spotTitle,
      item_id: spotId,
    });
  }
};

// 言語切り替えイベント
export const trackLanguageChange = (language: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'language_change', {
      event_category: 'preferences',
      event_label: language,
    });
  }
};

// お問い合わせ送信イベント
export const trackContactSubmit = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
    });
  }
};

// 外部リンククリックイベント（Google Maps等）
export const trackOutboundLink = (url: string, type: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: type,
      transport_type: 'beacon',
      event_callback: () => {
        window.location.href = url;
      }
    });
  }
};