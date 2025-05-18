
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            カウンセリングマッチ
          </h1>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            カウンセラーとクライエントのマッチングサービス
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 mb-2 text-indigo-600" />
              <CardTitle>カレンダー予約</CardTitle>
              <CardDescription>
                希望の日時を選んで、空いているカウンセラーを見つけましょう
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                「毎週水曜18時から」などと入力すれば、空いているカウンセラーが紹介されます。
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/calendar">カレンダーを見る</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-indigo-600" />
              <CardTitle>カウンセラー一覧</CardTitle>
              <CardDescription>
                様々な専門分野のカウンセラーから選びましょう
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                カウンセラーの一覧から選んで、空いている予定を確認できます。
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/counselors">カウンセラーを見る</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 mb-2 text-indigo-600" />
              <CardTitle>今すぐ通話</CardTitle>
              <CardDescription>
                今すぐ話したい方はこちら
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                今空いているカウンセラーとすぐに通話できます。
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="secondary">
                <Link to="/talk-now">今すぐ通話</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">サービスの特徴</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">プロのカウンセリング</h3>
              <p className="text-sm text-gray-500">
                専門のカウンセラーによる質の高いカウンセリングを月に数回受けられます。
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">ピアカウンセリング</h3>
              <p className="text-sm text-gray-500">
                クライエント同士のマッチングによる素人カウンセリングは無制限で利用できます。
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">ビデオ通話</h3>
              <p className="text-sm text-gray-500">
                Google Meetを使用した快適なビデオ通話でカウンセリングを受けられます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
