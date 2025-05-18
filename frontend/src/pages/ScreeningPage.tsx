
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { performScreening } from '../services/api';
import { ScreeningResult } from '../types';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const SCREENING_QUESTIONS = [
  'ここ2週間の気分はどうですか？',
  '睡眠の質はどうですか？',
  '食欲に変化はありますか？',
  '自分を傷つけたいと思ったことはありますか？',
  'どのような悩みでカウンセリングを受けたいですか？'
];

export function ScreeningPage() {
  const [answers, setAnswers] = useState<string[]>(Array(SCREENING_QUESTIONS.length).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [result, setResult] = useState<{
    status: ScreeningResult;
    message: string;
  } | null>(null);

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < SCREENING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitScreening();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitScreening = async () => {
    setLoading(true);
    try {
      const userId = 'mock-user-id';
      
      const screeningResult = await performScreening({
        user_id: userId,
        answers: answers
      });
      
      setResult({
        status: screeningResult.result,
        message: screeningResult.notes || ''
      });
      
      setScreeningComplete(true);
    } catch (err) {
      console.error('スクリーニングの実行中にエラーが発生しました。', err);
    } finally {
      setLoading(false);
    }
  };

  const getResultAlert = () => {
    if (!result) return null;
    
    switch (result.status) {
      case ScreeningResult.PASS:
        return (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">スクリーニング完了</AlertTitle>
            <AlertDescription className="text-green-700">
              {result.message}
            </AlertDescription>
          </Alert>
        );
      case ScreeningResult.REFER:
        return (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">専門家への相談をお勧めします</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {result.message}
            </AlertDescription>
          </Alert>
        );
      case ScreeningResult.BLOCK:
        return (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">緊急の専門的支援が必要です</AlertTitle>
            <AlertDescription className="text-red-700">
              {result.message}
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">初回スクリーニング</h1>
          <p className="text-gray-500 mt-2">
            カウンセリングを始める前に、簡単な質問にお答えください
          </p>
        </div>

        {screeningComplete ? (
          <Card>
            <CardHeader>
              <CardTitle>スクリーニング結果</CardTitle>
              <CardDescription>
                あなたの回答に基づく評価結果です
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getResultAlert()}
              
              {result?.status === ScreeningResult.PASS && (
                <div className="mt-6 text-center">
                  <Button className="w-full">
                    カウンセリングを予約する
                  </Button>
                </div>
              )}
              
              {result?.status === ScreeningResult.REFER && (
                <div className="mt-6 text-center">
                  <Button className="w-full">
                    専門カウンセラーを探す
                  </Button>
                </div>
              )}
              
              {result?.status === ScreeningResult.BLOCK && (
                <div className="mt-6 space-y-4">
                  <p className="text-center font-medium">
                    緊急の専門的支援が必要です。以下の緊急連絡先にご連絡ください：
                  </p>
                  <div className="p-4 border rounded-md">
                    <p className="font-bold">緊急連絡先:</p>
                    <p>心の健康相談窓口: 0120-XXX-XXX</p>
                    <p>いのちの電話: 0120-XXX-XXX</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>質問 {currentQuestion + 1} / {SCREENING_QUESTIONS.length}</CardTitle>
              <CardDescription>
                {SCREENING_QUESTIONS[currentQuestion]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ここに回答を入力してください..."
                value={answers[currentQuestion]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                前へ
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion].trim() || loading}
              >
                {currentQuestion === SCREENING_QUESTIONS.length - 1 ? '送信' : '次へ'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
