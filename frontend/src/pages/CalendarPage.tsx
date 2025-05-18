import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getAvailableSlots, createAppointment } from '../services/api';
import { AvailabilitySlot } from '../types';

export function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date);
    }
  }, [date]);

  const fetchAvailableSlots = async (selectedDate: Date) => {
    setLoading(true);
    setError(null);
    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
      
      const slots = await getAvailableSlots(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setAvailableSlots(slots);
    } catch (err) {
      setError('利用可能な時間枠の取得中にエラーが発生しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSlot = (slot: AvailabilitySlot) => {
    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">カレンダー予約</h1>
          <p className="text-gray-500 mt-2">
            希望の日時を選んで、空いているカウンセラーを見つけましょう
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>日付を選択</CardTitle>
              <CardDescription>
                カウンセリングを受けたい日を選んでください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ja}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>利用可能な時間枠</CardTitle>
              <CardDescription>
                {date ? format(date, 'yyyy年MM月dd日 (EEEE)', { locale: ja }) : '日付を選択してください'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">読み込み中...</div>
              ) : error ? (
                <div className="text-red-500 py-4">{error}</div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-4">
                  選択した日に利用可能な時間枠はありません。別の日を選択してください。
                </div>
              ) : (
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <div key={`${slot.counselor_id}-${slot.start_time}`} className="flex justify-between items-center p-3 border rounded-md">
                      <span>{formatTimeSlot(slot)}</span>
                      <Button size="sm" onClick={async () => {
                        try {
                          const appointment = await createAppointment({
                            client_id: '1', // Using default user ID
                            counselor_id: slot.counselor_id,
                            start_time: slot.start_time,
                            end_time: slot.end_time,
                            is_professional: true // Assuming all calendar slots are from professionals
                          });
                          alert(`予約が完了しました。\n開始時間: ${new Date(appointment.start_time).toLocaleString('ja-JP')}\nGoogle Meet: ${appointment.meeting_link}`);
                          fetchAvailableSlots(date!);
                        } catch (err) {
                          console.error('予約中にエラーが発生しました。', err);
                        }
                      }}>予約する</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
