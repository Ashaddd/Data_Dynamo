import NotableAlumniList from '@/components/alumni/NotableAlumniList';
import { mockAlumni } from '@/data/alumni';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notable Alumni',
  description: 'Discover and celebrate the achievements of distinguished alumni from Nexus Alumni.',
};

export default function NotableAlumniPage() {
  // In a real app, this data would be fetched from an API
  const alumni = mockAlumni;

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Notable Alumni Showcase</CardTitle>
          <CardDescription>
            Celebrating the achievements and contributions of our distinguished alumni.
          </CardDescription>
        </CardHeader>
      </Card>
      <NotableAlumniList alumni={alumni} />
    </div>
  );
}
