import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Lightbulb, TrendingUp } from 'lucide-react';

interface FeedbackProps {
  feedback: {
    rating: number;
    grammar: string;
    fluency: string;
    pronunciation: string;
    vocabulary: string;
    notes: string;
    suggestions?: string[];
    confidence?: number;
  };
}

export default function FeedbackCard({ feedback }: FeedbackProps) {
  return (
    <Card className='mt-2 bg-blue-50 border-blue-200'>
      <CardHeader className='p-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-base text-blue-800'>Feedback</CardTitle>
          {feedback.confidence && (
            <div className='flex items-center text-xs text-blue-600'>
              <TrendingUp className='w-3 h-3 mr-1' />
              {Math.round(feedback.confidence * 100)}% confidence
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className='p-4 text-sm text-blue-700'>
        <div className='flex items-center mb-2'>
          <span className='font-semibold mr-2'>Rating:</span>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill='currentColor'
              />
            ))}
          </div>
        </div>
        <p>
          <span className='font-semibold'>Grammar:</span> {feedback.grammar}
        </p>
        <p>
          <span className='font-semibold'>Fluency:</span> {feedback.fluency}
        </p>
        <p>
          <span className='font-semibold'>Pronunciation:</span>{' '}
          {feedback.pronunciation}
        </p>
        <p>
          <span className='font-semibold'>Vocabulary:</span>{' '}
          {feedback.vocabulary}
        </p>
        <p>
          <span className='font-semibold'>Notes:</span> {feedback.notes}
        </p>

        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div className='mt-3 pt-3 border-t border-blue-200'>
            <div className='flex items-center mb-2'>
              <Lightbulb className='w-4 h-4 mr-2 text-yellow-600' />
              <span className='font-semibold text-blue-800'>Suggestions:</span>
            </div>
            <ul className='list-disc list-inside space-y-1'>
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className='text-blue-700'>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
