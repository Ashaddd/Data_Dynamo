import NotableAlumniList from '@/components/alumni/NotableAlumniList';
import { mockAlumni } from '@/data/alumni';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import { MAJORS_DEPARTMENTS } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: 'Notable Alumni',
  description: 'Discover and celebrate the achievements of distinguished alumni from Nexus Alumni, organized by department.',
};

const TARGET_DEPARTMENT_VALUES = ['computer_science', 'electrical_engineering', 'civil_engineering'];

export default function NotableAlumniPage() {
  const allAlumni = mockAlumni;

  const targetDepartments = MAJORS_DEPARTMENTS.filter(dept =>
    TARGET_DEPARTMENT_VALUES.includes(dept.value)
  );

  // Check if any notable alumni exist across the TARGET departments for the main message
  const notableAlumniInTargetDepartments = allAlumni.filter(alum =>
    alum.isNotable && targetDepartments.some(dept => dept.value === alum.major)
  );

  if (targetDepartments.length === 0) {
    // This case should ideally not happen if constants are set up correctly
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
            <p className="text-center text-muted-foreground py-10 text-lg">
                Target departments (Computer Science, Electrical Engineering, Civil Engineering) are not configured correctly. Please check the application setup.
            </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Notable Alumni Showcase</CardTitle>
          <CardDescription>
            Celebrating the achievements and contributions of our distinguished alumni from Computer Science, Electrical Engineering, and Civil Engineering.
          </CardDescription>
        </CardHeader>
      </Card>

      {notableAlumniInTargetDepartments.length > 0 ? (
        <Tabs defaultValue={targetDepartments[0].value} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
            {targetDepartments.map((department) => (
              <TabsTrigger key={department.value} value={department.value} className="text-sm sm:text-base">
                {department.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {targetDepartments.map((department) => {
            const notableAlumniInDept = allAlumni.filter(
              (alum) => alum.isNotable && alum.major === department.value
            );

            return (
              <TabsContent key={department.value} value={department.value} className="space-y-6">
                {notableAlumniInDept.length > 0 ? (
                  <NotableAlumniList alumni={notableAlumniInDept} />
                ) : (
                  <p className="text-center text-muted-foreground py-10 text-lg">
                    No notable alumni found in {department.label}.
                  </p>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <p className="text-center text-muted-foreground py-10 text-lg">
          No notable alumni to display in Computer Science, Electrical Engineering, or Civil Engineering at this time.
        </p>
      )}
    </div>
  );
}
