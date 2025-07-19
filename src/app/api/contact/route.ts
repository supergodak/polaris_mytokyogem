import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // バリデーション
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Slack Webhook URLを環境変数から取得
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL is not configured');
      return NextResponse.json(
        { error: 'Contact form is not configured' },
        { status: 500 }
      );
    }

    // Slackメッセージのフォーマット
    const slackMessage = {
      text: "MyTokyoGem お問い合わせ",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🌟 MyTokyoGem お問い合わせ"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*お名前:*\n${name || '未記入'}`
            },
            {
              type: "mrkdwn",
              text: `*メールアドレス:*\n${email || '未記入'}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*メッセージ:*\n${message}`
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
            }
          ]
        }
      ]
    };

    // Slackに送信
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      throw new Error(`Slack API returned ${response.status}`);
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}