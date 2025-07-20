import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import OpenAI from 'openai';

// OpenAI クライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// フィールド別の翻訳プロンプト
const TRANSLATION_PROMPTS = {
  title: {
    system: "あなたは日本の観光スポット情報を英語に翻訳する専門家です。タイトルは魅力的で簡潔な英語に翻訳してください。観光客が興味を持つような表現を心がけてください。",
    example: "例：「カウンター席が心地よいクラフトビールバー」→「Cozy Counter Craft Beer Bar」"
  },
  shortDescription: {
    system: "観光スポットの短い説明文を自然で魅力的な英語に翻訳してください。一人旅の外国人観光客にアピールする表現を使ってください。",
    example: "例：「一人でも気軽に入れる渋谷の隠れ家的クラフトビールバー」→「Hidden craft beer bar in Shibuya perfect for solo drinkers」"
  },
  description: {
    system: "観光スポットの詳細説明を自然で読みやすい英語に翻訳してください。場所の雰囲気や特徴を正確に伝えてください。",
    example: ""
  },
  businessHours: {
    system: "営業時間情報を標準的な英語表記に翻訳してください。曜日と時間は英語圏で一般的な表記を使用してください。",
    example: "例：「18:00-02:00 (月-土) / 日曜定休」→「18:00-02:00 (Mon-Sat) / Closed on Sunday」"
  },
  access: {
    system: "アクセス情報を分かりやすい英語に翻訳してください。駅名は英語表記にし、徒歩時間は「minutes walk」の形式を使用してください。",
    example: "例：「渋谷駅から徒歩5分」→「5 minutes walk from Shibuya Station」"
  },
  tips: {
    system: "一人旅のコツやアドバイスを自然な英語に翻訳してください。外国人観光客にとって実用的で親しみやすい表現を使ってください。",
    example: "例：「英語メニューあり。一人でカウンターに座ってもバーテンダーが気さくに話しかけてくれます。」→「English menu available. Solo drinkers at the counter can enjoy friendly conversations with the bartender.」"
  },
  address: {
    system: "住所を英語表記に翻訳してください。日本の住所表記ルールに従い、番地-番-号の順序で表記してください。",
    example: "例：「東京都渋谷区渋谷2-10-15」→「2-10-15 Shibuya, Shibuya-ku, Tokyo」"
  }
};

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json({ 
        error: 'Translation service is not configured' 
      }, { status: 500 });
    }

    const { text, fieldType } = await request.json();

    // 入力検証
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ 
        error: 'Text is required' 
      }, { status: 400 });
    }

    if (!fieldType || !TRANSLATION_PROMPTS[fieldType as keyof typeof TRANSLATION_PROMPTS]) {
      return NextResponse.json({ 
        error: 'Invalid field type' 
      }, { status: 400 });
    }

    // テキストが空または短すぎる場合はスキップ
    if (text.trim().length < 2) {
      return NextResponse.json({ 
        translatedText: '' 
      });
    }

    const prompt = TRANSLATION_PROMPTS[fieldType as keyof typeof TRANSLATION_PROMPTS];
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    console.log(`Translating ${fieldType}: "${text}" using model ${model}`);

    // OpenAI API呼び出し
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `${prompt.system}\n\n${prompt.example}`
        },
        {
          role: "user",
          content: `以下の日本語を英語に翻訳してください：\n\n${text}`
        }
      ],
      max_tokens: 500,
      temperature: 0.3, // 一貫性のある翻訳のため低めに設定
    });

    const translatedText = completion.choices[0]?.message?.content?.trim() || '';

    console.log(`Translation result: "${translatedText}"`);

    return NextResponse.json({ 
      translatedText,
      fieldType,
      originalText: text
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    // OpenAI API エラーの詳細をログに記録（本番環境では注意）
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    return NextResponse.json({ 
      error: 'Translation failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// 利用可能な翻訳フィールドタイプを取得
export async function GET() {
  return NextResponse.json({
    availableFields: Object.keys(TRANSLATION_PROMPTS),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  });
}