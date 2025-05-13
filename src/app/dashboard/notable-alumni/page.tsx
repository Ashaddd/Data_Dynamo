import NotableAlumniList from '@/components/alumni/NotableAlumniList';
import { mockAlumni } from '@/data/alumni';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import { MAJORS_DEPARTMENTS } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Notable Alumni',
  description: 'Discover and celebrate the achievements of distinguished alumni from Nexus Alumni, organized by department.',
};

export default function NotableAlumniPage() {
  const allAlumni = mockAlumni;
  const departments = MAJORS_DEPARTMENTS;
  let anyNotableAlumniFound = false;

  // Check if any notable alumni exist across all departments first for the main message
  const overallNotableAlumni = allAlumni.filter(alum => alum.isNotable);
  if (overallNotableAlumni.length > 0) {
    anyNotableAlumniFound = true;
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Notable Alumni Showcase</CardTitle>
          <CardDescription>
            Celebrating the achievements and contributions of our distinguished alumni, organized by department.
          </CardDescription>
        </CardHeader>
      </Card>

      {anyNotableAlumniFound ? departments.map((department, index) => {
        const notableAlumniInDept = allAlumni.filter(
          (alum) => alum.isNotable && alum.major === department.label
        );

        if (notableAlumniInDept.length > 0) {
          return (
            <section key={department.value} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-primary">
                  {department.label}
                </h2>
                <Separator className="my-2" />
              </div>
              <NotableAlumniList alumni={notableAlumniInDept} />
            </section>
          );
        }
        return null;
      }) : (
        <p className="text-center text-muted-foreground py-10 text-lg">
          No notable alumni to display at this time. Check back later for updates.
        </p>
      )}
    </div>
  );
}
