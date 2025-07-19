'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <span className="mr-2">←</span>
        {language === 'ja' ? 'トップに戻る' : 'Back to Home'}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image
              src="/mytokyogem_logo.png"
              alt="MyTokyoGem Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-2xl font-bold text-center">
            {language === 'ja' ? 'お問い合わせ' : 'Contact Us'}
          </h1>
          <p className="text-center text-gray-600">
            {language === 'ja' 
              ? 'ご質問、ご提案、スポット情報など、お気軽にお聞かせください' 
              : 'Questions, suggestions, spot recommendations - feel free to reach out'
            }
          </p>
        </CardHeader>
        <CardContent>
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800">
                {language === 'ja' 
                  ? 'メッセージを送信しました。ありがとうございます！' 
                  : 'Message sent successfully. Thank you!'
                }
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800">
                {language === 'ja' 
                  ? '送信に失敗しました。しばらく後でもう一度お試しください。' 
                  : 'Failed to send message. Please try again later.'
                }
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ja' ? 'お名前（任意）' : 'Name (Optional)'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ja' ? 'お名前' : 'Your name'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ja' ? 'メールアドレス（任意）' : 'Email (Optional)'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ja' ? 'example@example.com' : 'example@example.com'}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ja' ? 'メッセージ *' : 'Message *'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ja' 
                  ? 'ご質問、ご提案、おすすめスポット情報など、なんでもお聞かせください...' 
                  : 'Questions, suggestions, recommended spots, anything is welcome...'
                }
              />
            </div>

            <div className="text-sm text-gray-500">
              {language === 'ja' ? (
                <p>
                  * メールアドレスは返信が必要な場合のみご記入ください。<br />
                  * いただいたメッセージは運営チームで確認いたします。
                </p>
              ) : (
                <p>
                  * Email address is only needed if you want a reply.<br />
                  * Your message will be reviewed by our team.
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.message.trim()}
              className="w-full"
            >
              {isSubmitting 
                ? (language === 'ja' ? '送信中...' : 'Sending...') 
                : (language === 'ja' ? '送信する' : 'Send Message')
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}