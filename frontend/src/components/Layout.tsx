import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">カウンセリングマッチ</h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link to="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  ホーム
                </Link>
                <Link to="/calendar" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  カレンダー
                </Link>
                <Link to="/counselors" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  カウンセラー一覧
                </Link>
                <Link to="/appointments" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  予約一覧
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Button variant="outline" className="mr-2">
                ログイン
              </Button>
              <Button>
                新規登録
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 カウンセリングマッチ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
