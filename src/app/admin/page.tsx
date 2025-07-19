'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllSpotsForAdmin } from '@/lib/data';
import { Spot } from '@/types/spot';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        // 管理画面では非表示スポットも含めて表示
        const spotsData = getAllSpotsForAdmin();
        setSpots(spotsData);
      } catch (error) {
        console.error('Error fetching spots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchSpots();
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>読み込み中...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">管理画面</h1>
          <p className="text-gray-600">マイ・トーキョー・ジェム スポット管理</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            ログイン中: {session.user.name}
          </span>
          <Button variant="outline" onClick={() => signOut()}>
            ログアウト
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">総スポット数</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{spots.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">一人旅向け</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {spots.filter(spot => spot.soloFriendly).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">総いいね数</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {spots.reduce((sum, spot) => sum + spot.reactions.interested, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">総訪問数</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {spots.reduce((sum, spot) => sum + spot.reactions.visited, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">スポット一覧</h2>
        <Link href="/admin/spots/new">
          <Button>新しいスポットを追加</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">タイトル</th>
                  <th className="text-left p-4">ジャンル</th>
                  <th className="text-left p-4">状態</th>
                  <th className="text-left p-4">いいね</th>
                  <th className="text-left p-4">作成日</th>
                  <th className="text-left p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{spot.title.ja}</p>
                        <p className="text-sm text-gray-500">{spot.title.en}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {spot.genre.slice(0, 2).map((genre) => (
                          <span key={genre} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {spot.isHidden && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            非表示
                          </span>
                        )}
                        {spot.soloFriendly && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                            一人旅向け
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{spot.reactions.interested}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {spot.createdAt ? new Date(spot.createdAt).toLocaleDateString('ja-JP') : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Link href={`/admin/spots/${spot.id}/edit`}>
                          <Button size="sm" variant="outline">編集</Button>
                        </Link>
                        <Link href={`/spots/${spot.id}`} target="_blank">
                          <Button size="sm" variant="outline">表示</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}