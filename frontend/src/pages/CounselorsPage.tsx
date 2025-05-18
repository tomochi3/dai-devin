
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getCounselors, getCounselorAvailability, createAppointment, startImmediateCall } from '../services/api';
import { CounselorProfile, AvailabilitySlot, CounselorSpecialty } from '../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Video } from 'lucide-react';

export function CounselorsPage() {
  const [counselors, setCounselors] = useState<CounselorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchCounselors();
  }, []);

  useEffect(() => {
    if (selectedCounselor) {
      fetchAvailabilitySlots(selectedCounselor);
    }
  }, [selectedCounselor]);

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

  const fetchAvailabilitySlots = async (counselorId: string) => {
    setLoadingSlots(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      
      const slots = await getCounselorAvailability(
        counselorId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setAvailabilitySlots(slots);
    } catch (err) {
      console.error('利用可能な時間枠の取得中にエラーが発生しました。', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatTimeSlot = (slot: AvailabilitySlot) => {
    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    return `${format(start, 'yyyy/MM/dd (EEE) HH:mm', { locale: ja })} - ${format(end, 'HH:mm', { locale: ja })}`;
  };

  const getSpecialtyLabel = (specialty: CounselorSpecialty) => {
    const labels = {
      [CounselorSpecialty.GENERAL]: '一般',
      [CounselorSpecialty.DEPRESSION]: 'うつ',
      [CounselorSpecialty.ANXIETY]: '不安',
      [CounselorSpecialty.RELATIONSHIPS]: '人間関係',
      [CounselorSpecialty.CAREER]: 'キャリア',
      [CounselorSpecialty.STRESS]: 'ストレス'
    };
    return labels[specialty] || specialty;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">カウンセラー一覧</h1>
          <p className="text-gray-500 mt-2">
            あなたに合ったカウンセラーを見つけましょう
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">読み込み中...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{counselor.bio.split(' ')[0]}</CardTitle>
                  <CardDescription>
                    {counselor.is_professional ? 'プロフェッショナル' : 'ピアカウンセラー'}
                  </CardDescription>
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
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                        onClick={() => setSelectedCounselor(counselor.id === selectedCounselor ? null : counselor.id)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        予約する
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex items-center"
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
                        今すぐ通話
                      </Button>
                    </div>
                    
                    {selectedCounselor === counselor.id && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">利用可能な時間枠:</h4>
                        {loadingSlots ? (
                          <p className="text-sm text-gray-500">読み込み中...</p>
                        ) : availabilitySlots.length === 0 ? (
                          <p className="text-sm text-gray-500">利用可能な時間枠はありません。</p>
                        ) : (
                          <div className="space-y-2">
                            {availabilitySlots.map((slot) => (
                              <div key={`${slot.counselor_id}-${slot.start_time}`} className="flex justify-between items-center p-2 border rounded-md">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                  <span className="text-sm">{formatTimeSlot(slot)}</span>
                                </div>
                                <Button size="sm" onClick={async () => {
                                  try {
                                    const appointment = await createAppointment({
                                      client_id: '1', // Using default user ID
                                      counselor_id: slot.counselor_id,
                                      start_time: slot.start_time,
                                      end_time: slot.end_time,
                                      is_professional: counselors.find(c => c.id === slot.counselor_id)?.is_professional || false
                                    });
                                    alert(`予約が完了しました。\n開始時間: ${new Date(appointment.start_time).toLocaleString('ja-JP')}\nGoogle Meet: ${appointment.meeting_link}`);
                                    fetchAvailabilitySlots(selectedCounselor!);
                                  } catch (err) {
                                    console.error('予約中にエラーが発生しました。', err);
                                  }
                                }}>予約</Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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
