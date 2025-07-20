export interface Tag {
  ja: string;
  en: string;
}

export interface TagCategory {
  name: {
    ja: string;
    en: string;
  };
  tags: Record<string, Tag>;
}

// 基本カテゴリー（必須・単一選択）
export const PRIMARY_CATEGORIES: Record<string, Tag> = {
  'cafe': { ja: 'カフェ', en: 'Cafe' },
  'restaurant': { ja: 'レストラン', en: 'Restaurant' },
  'bar': { ja: 'バー・居酒屋', en: 'Bar/Izakaya' },
  'shopping': { ja: 'ショッピング', en: 'Shopping' },
  'culture': { ja: '文化・観光', en: 'Culture' },
  'entertainment': { ja: 'エンターテイメント', en: 'Entertainment' },
  'outdoor': { ja: 'アウトドア', en: 'Outdoor' },
  'wellness': { ja: 'ウェルネス', en: 'Wellness' },
  'accommodation': { ja: '宿泊', en: 'Accommodation' },
  'transport': { ja: '交通・移動', en: 'Transport' },
  'service': { ja: 'サービス', en: 'Service' }
};

// 詳細ジャンルタグ（複数選択可）
export const GENRE_TAGS: Record<string, Tag> = {
  // 飲食系 - ドリンク
  'craft-beer': { ja: 'クラフトビール', en: 'Craft Beer' },
  'sake': { ja: '日本酒', en: 'Sake' },
  'whiskey': { ja: 'ウイスキー', en: 'Whiskey' },
  'wine': { ja: 'ワイン', en: 'Wine' },
  'cocktail': { ja: 'カクテル', en: 'Cocktail' },
  'coffee': { ja: 'コーヒー', en: 'Coffee' },
  'tea': { ja: '紅茶・日本茶', en: 'Tea' },
  'bubble-tea': { ja: 'タピオカ', en: 'Bubble Tea' },
  'juice': { ja: 'ジュース・スムージー', en: 'Juice/Smoothie' },
  
  // 飲食系 - 料理ジャンル
  'japanese-food': { ja: '和食', en: 'Japanese Food' },
  'ramen': { ja: 'ラーメン', en: 'Ramen' },
  'sushi': { ja: '寿司', en: 'Sushi' },
  'soba-udon': { ja: 'そば・うどん', en: 'Soba/Udon' },
  'yakitori': { ja: '焼き鳥', en: 'Yakitori' },
  'tempura': { ja: '天ぷら', en: 'Tempura' },
  'yakiniku': { ja: '焼肉', en: 'Yakiniku' },
  'okonomiyaki': { ja: 'お好み焼き', en: 'Okonomiyaki' },
  'takoyaki': { ja: 'たこ焼き', en: 'Takoyaki' },
  'curry': { ja: 'カレー', en: 'Curry' },
  'italian': { ja: 'イタリアン', en: 'Italian' },
  'french': { ja: 'フレンチ', en: 'French' },
  'chinese': { ja: '中華', en: 'Chinese' },
  'korean': { ja: '韓国料理', en: 'Korean' },
  'thai': { ja: 'タイ料理', en: 'Thai' },
  'indian': { ja: 'インド料理', en: 'Indian' },
  'western-food': { ja: '洋食', en: 'Western Food' },
  'fusion': { ja: 'フュージョン', en: 'Fusion' },
  'vegetarian': { ja: 'ベジタリアン', en: 'Vegetarian' },
  'vegan': { ja: 'ヴィーガン', en: 'Vegan' },
  'halal': { ja: 'ハラール', en: 'Halal' },
  
  // 飲食系 - スタイル
  'standing-bar': { ja: '立ち飲み', en: 'Standing Bar' },
  'izakaya': { ja: '居酒屋', en: 'Izakaya' },
  'robatayaki': { ja: '炉端焼き', en: 'Robatayaki' },
  'family-restaurant': { ja: 'ファミレス', en: 'Family Restaurant' },
  'fast-food': { ja: 'ファストフード', en: 'Fast Food' },
  'convenience-store': { ja: 'コンビニ', en: 'Convenience Store' },
  'food-court': { ja: 'フードコート', en: 'Food Court' },
  'street-food': { ja: '屋台・ストリートフード', en: 'Street Food' },
  'bento': { ja: '弁当', en: 'Bento' },
  'sweets': { ja: 'スイーツ', en: 'Sweets' },
  'ice-cream': { ja: 'アイスクリーム', en: 'Ice Cream' },
  'bakery': { ja: 'パン屋', en: 'Bakery' },
  'patisserie': { ja: 'パティスリー', en: 'Patisserie' },
  
  // ショッピング系
  'vintage': { ja: '古着・ヴィンテージ', en: 'Vintage' },
  'fashion': { ja: 'ファッション', en: 'Fashion' },
  'streetwear': { ja: 'ストリートウェア', en: 'Streetwear' },
  'designer': { ja: 'デザイナーズ', en: 'Designer' },
  'thrift': { ja: 'リサイクル・古着', en: 'Thrift' },
  'accessories': { ja: 'アクセサリー', en: 'Accessories' },
  'shoes': { ja: '靴', en: 'Shoes' },
  'bags': { ja: 'バッグ', en: 'Bags' },
  'books': { ja: '本・雑誌', en: 'Books' },
  'manga': { ja: '漫画', en: 'Manga' },
  'music': { ja: '音楽・レコード', en: 'Music' },
  'vinyl': { ja: 'レコード', en: 'Vinyl Records' },
  'cd': { ja: 'CD', en: 'CD' },
  'instruments': { ja: '楽器', en: 'Musical Instruments' },
  'electronics': { ja: '電子機器', en: 'Electronics' },
  'games': { ja: 'ゲーム', en: 'Games' },
  'anime': { ja: 'アニメグッズ', en: 'Anime Goods' },
  'figures': { ja: 'フィギュア', en: 'Figures' },
  'toys': { ja: 'おもちゃ', en: 'Toys' },
  'art-supplies': { ja: 'アート用品', en: 'Art Supplies' },
  'stationery': { ja: '文房具', en: 'Stationery' },
  'crafts': { ja: '手芸・クラフト', en: 'Crafts' },
  'souvenirs': { ja: 'お土産', en: 'Souvenirs' },
  'department-store': { ja: 'デパート', en: 'Department Store' },
  'shopping-mall': { ja: 'ショッピングモール', en: 'Shopping Mall' },
  'flea-market': { ja: 'フリーマーケット', en: 'Flea Market' },
  
  // 文化・体験系
  'temple-shrine': { ja: '寺社', en: 'Temple/Shrine' },
  'museum': { ja: '美術館・博物館', en: 'Museum' },
  'gallery': { ja: 'ギャラリー', en: 'Gallery' },
  'traditional': { ja: '伝統文化', en: 'Traditional Culture' },
  'modern-art': { ja: '現代アート', en: 'Modern Art' },
  'pop-culture': { ja: 'ポップカルチャー', en: 'Pop Culture' },
  'subculture': { ja: 'サブカルチャー', en: 'Subculture' },
  'photography': { ja: '写真', en: 'Photography' },
  'calligraphy': { ja: '書道', en: 'Calligraphy' },
  'tea-ceremony': { ja: '茶道', en: 'Tea Ceremony' },
  'flower-arrangement': { ja: '華道', en: 'Flower Arrangement' },
  'kimono': { ja: '着物', en: 'Kimono' },
  'festivals': { ja: '祭り・イベント', en: 'Festivals/Events' },
  'seasonal': { ja: '季節限定', en: 'Seasonal' },
  
  // エンターテイメント系
  'live-music': { ja: 'ライブ音楽', en: 'Live Music' },
  'jazz': { ja: 'ジャズ', en: 'Jazz' },
  'rock': { ja: 'ロック', en: 'Rock' },
  'electronic': { ja: 'エレクトロニック', en: 'Electronic' },
  'classical': { ja: 'クラシック', en: 'Classical' },
  'folk': { ja: 'フォーク', en: 'Folk' },
  'karaoke': { ja: 'カラオケ', en: 'Karaoke' },
  'arcade': { ja: 'ゲームセンター', en: 'Arcade' },
  'pachinko': { ja: 'パチンコ', en: 'Pachinko' },
  'cinema': { ja: '映画館', en: 'Cinema' },
  'theater': { ja: '劇場', en: 'Theater' },
  'comedy': { ja: 'コメディ', en: 'Comedy' },
  'dance': { ja: 'ダンス', en: 'Dance' },
  'club': { ja: 'クラブ', en: 'Club' },
  'lounge': { ja: 'ラウンジ', en: 'Lounge' },
  
  // アウトドア・アクティビティ系
  'park': { ja: '公園', en: 'Park' },
  'garden': { ja: '庭園', en: 'Garden' },
  'river': { ja: '川・水辺', en: 'River/Waterside' },
  'view': { ja: '景色・展望', en: 'Scenic View' },
  'walking': { ja: '散歩', en: 'Walking' },
  'jogging': { ja: 'ジョギング', en: 'Jogging' },
  'cycling': { ja: 'サイクリング', en: 'Cycling' },
  'hiking': { ja: 'ハイキング', en: 'Hiking' },
  'photography-spot': { ja: '撮影スポット', en: 'Photography Spot' },
  'cherry-blossoms': { ja: '桜', en: 'Cherry Blossoms' },
  'autumn-leaves': { ja: '紅葉', en: 'Autumn Leaves' },
  
  // ウェルネス系
  'hot-spring': { ja: '温泉・銭湯', en: 'Hot Spring/Sento' },
  'massage': { ja: 'マッサージ', en: 'Massage' },
  'spa': { ja: 'スパ', en: 'Spa' },
  'yoga': { ja: 'ヨガ', en: 'Yoga' },
  'meditation': { ja: '瞑想', en: 'Meditation' },
  'fitness': { ja: 'フィットネス', en: 'Fitness' },
  'beauty': { ja: '美容', en: 'Beauty' },
  'haircut': { ja: '美容院・理容院', en: 'Hair Salon/Barber' },
  'nail': { ja: 'ネイルサロン', en: 'Nail Salon' },
  
  // サービス系
  'coworking': { ja: 'コワーキング', en: 'Coworking' },
  'internet-cafe': { ja: 'ネットカフェ', en: 'Internet Cafe' },
  'library': { ja: '図書館', en: 'Library' },
  'study-space': { ja: '勉強スペース', en: 'Study Space' },
  'phone-booth': { ja: '電話ボックス', en: 'Phone Booth' },
  'atm': { ja: 'ATM', en: 'ATM' },
  'post-office': { ja: '郵便局', en: 'Post Office' },
  'tourist-info': { ja: '観光案内所', en: 'Tourist Information' },
  'luggage-storage': { ja: '荷物預かり', en: 'Luggage Storage' },
  'laundry': { ja: 'コインランドリー', en: 'Laundry' },
  'photo-booth': { ja: 'プリクラ', en: 'Photo Booth' },
  
  // 宿泊系
  'hotel': { ja: 'ホテル', en: 'Hotel' },
  'ryokan': { ja: '旅館', en: 'Ryokan' },
  'hostel': { ja: 'ホステル', en: 'Hostel' },
  'guesthouse': { ja: 'ゲストハウス', en: 'Guesthouse' },
  'capsule-hotel': { ja: 'カプセルホテル', en: 'Capsule Hotel' },
  'airbnb': { ja: '民泊', en: 'Vacation Rental' },
  'love-hotel': { ja: 'ラブホテル', en: 'Love Hotel' },
  
  // 交通系
  'train-station': { ja: '駅', en: 'Train Station' },
  'bus-stop': { ja: 'バス停', en: 'Bus Stop' },
  'taxi': { ja: 'タクシー', en: 'Taxi' },
  'bike-rental': { ja: 'レンタサイクル', en: 'Bike Rental' },
  'car-rental': { ja: 'レンタカー', en: 'Car Rental' },
  'airport': { ja: '空港', en: 'Airport' }
};

// 旅行スタイルタグ（複数選択可）
export const TRAVEL_STYLE_TAGS: Record<string, Tag> = {
  // 一人旅特化
  'solo-friendly': { ja: '一人歓迎', en: 'Solo Friendly' },
  'solo-perfect': { ja: '一人旅に最適', en: 'Perfect for Solo' },
  'counter-seating': { ja: 'カウンター席', en: 'Counter Seating' },
  'communal-table': { ja: '相席', en: 'Communal Table' },
  'private-booth': { ja: '個室・半個室', en: 'Private Booth' },
  'quiet': { ja: '静か', en: 'Quiet' },
  'lively': { ja: '賑やか', en: 'Lively' },
  'cozy': { ja: 'アットホーム', en: 'Cozy' },
  'spacious': { ja: '広々', en: 'Spacious' },
  'intimate': { ja: 'こじんまり', en: 'Intimate' },
  
  // 時間帯・利用シーン
  'early-morning': { ja: '早朝', en: 'Early Morning' },
  'morning': { ja: '朝', en: 'Morning' },
  'brunch': { ja: 'ブランチ', en: 'Brunch' },
  'lunch': { ja: 'ランチ', en: 'Lunch' },
  'afternoon': { ja: '午後', en: 'Afternoon' },
  'happy-hour': { ja: 'ハッピーアワー', en: 'Happy Hour' },
  'dinner': { ja: 'ディナー', en: 'Dinner' },
  'evening': { ja: '夕方', en: 'Evening' },
  'late-night': { ja: '深夜', en: 'Late Night' },
  'all-night': { ja: '24時間', en: '24 Hours' },
  'weekend': { ja: '週末', en: 'Weekend' },
  'weekday': { ja: '平日', en: 'Weekday' },
  
  // 目的・用途
  'work-friendly': { ja: '作業可', en: 'Work Friendly' },
  'study-space': { ja: '勉強向け', en: 'Good for Study' },
  'reading': { ja: '読書', en: 'Reading' },
  'meeting': { ja: '打ち合わせ', en: 'Meeting' },
  'date': { ja: 'デート', en: 'Date' },
  'business': { ja: 'ビジネス', en: 'Business' },
  'networking': { ja: 'ネットワーキング', en: 'Networking' },
  'socializing': { ja: '交流', en: 'Socializing' },
  'relaxation': { ja: 'リラックス', en: 'Relaxation' },
  'contemplation': { ja: '思索', en: 'Contemplation' },
  'people-watching': { ja: '人間観察', en: 'People Watching' },
  'waiting': { ja: '待ち時間', en: 'Waiting' },
  'transit': { ja: '乗り換え', en: 'Transit' },
  
  // 体験の性質
  'local-experience': { ja: 'ローカル体験', en: 'Local Experience' },
  'hidden-gem': { ja: '隠れ家', en: 'Hidden Gem' },
  'tourist-spot': { ja: '観光スポット', en: 'Tourist Spot' },
  'off-beaten-path': { ja: '穴場', en: 'Off the Beaten Path' },
  'mainstream': { ja: 'メジャー', en: 'Mainstream' },
  'underground': { ja: 'アンダーグラウンド', en: 'Underground' },
  'trendy': { ja: 'トレンド', en: 'Trendy' },
  'classic': { ja: '定番', en: 'Classic' },
  'nostalgic': { ja: 'ノスタルジック', en: 'Nostalgic' },
  'modern': { ja: 'モダン', en: 'Modern' },
  'retro': { ja: 'レトロ', en: 'Retro' },
  'futuristic': { ja: '未来的', en: 'Futuristic' },
  'unique': { ja: 'ユニーク', en: 'Unique' },
  'quirky': { ja: '変わった', en: 'Quirky' },
  'artistic': { ja: 'アーティスティック', en: 'Artistic' },
  'minimalist': { ja: 'ミニマル', en: 'Minimalist' },
  'maximalist': { ja: 'マキシマル', en: 'Maximalist' },
  
  // 発見性・アクセス
  'photogenic': { ja: 'フォトジェニック', en: 'Photogenic' },
  'instagram-worthy': { ja: 'インスタ映え', en: 'Instagram Worthy' },
  'video-worthy': { ja: '動画映え', en: 'Video Worthy' },
  'authentic': { ja: '本格的', en: 'Authentic' },
  'experimental': { ja: '実験的', en: 'Experimental' },
  'seasonal': { ja: '季節限定', en: 'Seasonal' },
  'limited-time': { ja: '期間限定', en: 'Limited Time' },
  'permanent': { ja: '通年', en: 'Year Round' },
  'weather-dependent': { ja: '天候次第', en: 'Weather Dependent' },
  'indoor': { ja: '屋内', en: 'Indoor' },
  'outdoor': { ja: '屋外', en: 'Outdoor' },
  'covered': { ja: '屋根あり', en: 'Covered' },
  
  // 価格・コスト
  'free': { ja: '無料', en: 'Free' },
  'budget': { ja: '格安', en: 'Budget' },
  'affordable': { ja: 'リーズナブル', en: 'Affordable' },
  'mid-range': { ja: '中価格', en: 'Mid-range' },
  'upscale': { ja: '高級', en: 'Upscale' },
  'luxury': { ja: '超高級', en: 'Luxury' },
  'good-value': { ja: 'コスパ良', en: 'Good Value' },
  'splurge': { ja: '奮発', en: 'Splurge' },
  
  // サービス・設備
  'english-menu': { ja: '英語メニュー', en: 'English Menu' },
  'english-staff': { ja: '英語対応', en: 'English Speaking Staff' },
  'multilingual': { ja: '多言語対応', en: 'Multilingual' },
  'wifi': { ja: 'Wi-Fi', en: 'WiFi' },
  'power-outlets': { ja: '電源', en: 'Power Outlets' },
  'charging-station': { ja: '充電ステーション', en: 'Charging Station' },
  'restroom': { ja: 'トイレ', en: 'Restroom' },
  'wheelchair-accessible': { ja: 'バリアフリー', en: 'Wheelchair Accessible' },
  'parking': { ja: '駐車場', en: 'Parking' },
  'bicycle-parking': { ja: '駐輪場', en: 'Bicycle Parking' },
  'luggage-friendly': { ja: '荷物OK', en: 'Luggage Friendly' },
  'baby-friendly': { ja: '赤ちゃん連れ可', en: 'Baby Friendly' },
  'pet-friendly': { ja: 'ペット可', en: 'Pet Friendly' },
  'smoking': { ja: '喫煙可', en: 'Smoking Allowed' },
  'non-smoking': { ja: '禁煙', en: 'Non-smoking' },
  'air-conditioning': { ja: 'エアコン', en: 'Air Conditioning' },
  'heating': { ja: '暖房', en: 'Heating' },
  'terrace': { ja: 'テラス席', en: 'Terrace' },
  'rooftop': { ja: '屋上', en: 'Rooftop' },
  'basement': { ja: '地下', en: 'Basement' },
  'garden': { ja: '庭', en: 'Garden' },
  
  // 支払い方法
  'cash-only': { ja: '現金のみ', en: 'Cash Only' },
  'card-accepted': { ja: 'カード可', en: 'Card Accepted' },
  'contactless': { ja: 'タッチ決済', en: 'Contactless Payment' },
  'mobile-payment': { ja: 'モバイル決済', en: 'Mobile Payment' },
  'ic-card': { ja: 'ICカード', en: 'IC Card' },
  'foreign-cards': { ja: '海外カード可', en: 'Foreign Cards Accepted' },
  
  // 混雑・予約
  'reservation-required': { ja: '要予約', en: 'Reservation Required' },
  'walk-in': { ja: '飛び込み可', en: 'Walk-in Welcome' },
  'queue-expected': { ja: '行列覚悟', en: 'Queue Expected' },
  'no-wait': { ja: '待ち時間なし', en: 'No Wait' },
  'crowded': { ja: '混雑', en: 'Crowded' },
  'peaceful': { ja: '空いてる', en: 'Peaceful' },
  'busy': { ja: '忙しい', en: 'Busy' },
  'leisurely': { ja: 'のんびり', en: 'Leisurely' }
};

// 全タグのマップ
export const ALL_TAGS = {
  ...PRIMARY_CATEGORIES,
  ...GENRE_TAGS,
  ...TRAVEL_STYLE_TAGS
};

// タグのローカライズ用ヘルパー関数
export function getLocalizedTag(tagKey: string, language: 'ja' | 'en'): string {
  const tag = ALL_TAGS[tagKey];
  return tag ? tag[language] : tagKey;
}

// タグ検索用ヘルパー関数
export function searchTags(query: string, language: 'ja' | 'en' = 'ja'): Array<{key: string, tag: Tag}> {
  const normalizedQuery = query.toLowerCase();
  
  return Object.entries(ALL_TAGS)
    .filter(([key, tag]) => {
      // 言語に応じて検索対象のテキストを取得
      const jaText = tag.ja;
      const enText = tag.en;
      
      // 日本語の場合は大文字小文字変換なしで検索
      if (language === 'ja') {
        return jaText.includes(query) || 
               enText.toLowerCase().includes(normalizedQuery) ||
               key.toLowerCase().includes(normalizedQuery);
      } else {
        // 英語の場合は従来通り
        return enText.toLowerCase().includes(normalizedQuery) || 
               jaText.includes(query) ||
               key.toLowerCase().includes(normalizedQuery);
      }
    })
    .map(([key, tag]) => ({ key, tag }))
    .slice(0, 20); // 最大20件まで
}