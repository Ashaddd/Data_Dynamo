import ProfileForm from '@/components/alumni/ProfileForm';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your Nexus Alumni profile information.',
};

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Manage Your Profile</CardTitle>
          <CardDescription>
            Keep your information up-to-date to stay connected with the alumni network and mentorship opportunities.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="shadow-md">
        <CardContent className="p-6">
            <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
