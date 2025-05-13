import AiMentorMatchForm from '@/components/mentorship/AiMentorMatchForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Mentor Matching',
  description: 'Get AI-driven mentor recommendations based on your career interests.',
};

export default function AiMentorMatchPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">AI-Powered Mentor Matching</CardTitle>
          <CardDescription>
            Let our AI help you find alumni mentors whose backgrounds and expertise align with your career aspirations.
            Describe your interests below to get started.
          </CardDescription>
        </CardHeader>
      </Card>
      <AiMentorMatchForm />
    </div>
  );
}
