
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getCounselors, startImmediateCall } from '../services/api';
import { CounselorProfile } from '../types';
import { Video, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function TalkNowPage() {
  const [counselors, setCounselors] = useState<CounselorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCounselors, setFilteredCounselors] = useState<CounselorProfile[]>([]);

  useEffect(() => {
    fetchCounselors();
  }, []);

  useEffect(() => {
    if (counselors.length > 0) {
      const availableNow = counselors.filter((_, index) => index % 2 === 0);
      setFilteredCounselors(availableNow);
    }
  }, [counselors]);

  const fetchCounselors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCounselors();
      setCounselors(data);
    } catch (err) {
      setError('カウンセラーの取得中にエラーが発生しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyLabel = (specialty: string) => {
    const labels: Record<string, string> = {
      'general': '一般',
      'depression': 'うつ',
      'anxiety': '不安',
      'relationships': '人間関係',
      'career': 'キャリア',
      'stress': 'ストレス'
    };
    return labels[specialty] || specialty;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">今すぐ通話</h1>
          <p className="text-gray-500 mt-2">
            今すぐ話せるカウンセラーと通話しましょう
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">読み込み中...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : filteredCounselors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-medium mb-2">現在利用可能なカウンセラーはいません</p>
            <p className="text-gray-500">少し時間をおいて再度お試しください。</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCounselors.map((counselor) => (
              <Card key={counselor.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{counselor.bio.split(' ')[0]}</CardTitle>
                      <CardDescription>
                        {counselor.is_professional ? 'プロフェッショナル' : 'ピアカウンセラー'}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      今すぐ利用可能
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{counselor.bio}</p>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">専門分野:</h4>
                      <div className="flex flex-wrap gap-2">
                        {counselor.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline">
                            {getSpecialtyLabel(specialty)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {counselor.hourly_rate && (
                      <p className="text-sm">
                        料金: ¥{counselor.hourly_rate.toLocaleString()}/時間
                      </p>
                    )}
                    
                    <Button 
                      className="w-full flex items-center justify-center"
                      size="lg"
                      onClick={async () => {
                        try {
                          const appointment = await startImmediateCall(counselor.id);
                          window.open(appointment.meeting_link, '_blank');
                        } catch (err) {
                          console.error('通話の開始中にエラーが発生しました。', err);
                        }
                      }}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      今すぐ通話を開始
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
