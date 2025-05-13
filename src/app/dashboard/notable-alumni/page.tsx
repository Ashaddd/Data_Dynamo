import NotableAlumniList from '@/components/alumni/NotableAlumniList';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import { MAJORS_DEPARTMENTS } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Alumni } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Notable Alumni',
  description: 'Discover and celebrate the achievements of distinguished alumni from Nexus Alumni, organized by department.',
};

const TARGET_DEPARTMENT_VALUES = ['computer_science', 'electrical_engineering', 'civil_engineering'];

async function getNotableAlumniByDepartments(departmentValues: string[]): Promise<Alumni[]> {
  if (!departmentValues || departmentValues.length === 0) {
    return [];
  }
  try {
    const usersCollection = collection(db, 'users');
    const q = query(
      usersCollection,
      where('userType', '==', 'alumni'),
      where('isNotable', '==', true),
      where('major', 'in', departmentValues)
    );
    const querySnapshot = await getDocs(q);
    const alumni = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure graduationYear is a number if it exists
      const graduationYear = data.graduationYear ? Number(data.graduationYear) : undefined;
      return {
        id: doc.id,
        ...data,
        graduationYear, // Override with potentially converted number
      } as Alumni;
    });
    return alumni;
  } catch (error) {
    console.error("Error fetching notable alumni:", error);
    return []; // Return empty array on error
  }
}

export default async function NotableAlumniPage() {
  const targetDepartments = MAJORS_DEPARTMENTS.filter(dept =>
    TARGET_DEPARTMENT_VALUES.includes(dept.value)
  );

  if (targetDepartments.length === 0) {
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

  const allNotableAlumniInTargetDepts = await getNotableAlumniByDepartments(TARGET_DEPARTMENT_VALUES);

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

      {allNotableAlumniInTargetDepts.length > 0 ? (
        <Tabs defaultValue={targetDepartments[0].value} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
            {targetDepartments.map((department) => (
              <TabsTrigger key={department.value} value={department.value} className="text-sm sm:text-base">
                {department.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {targetDepartments.map((department) => {
            const notableAlumniInDept = allNotableAlumniInTargetDepts.filter(
              (alum) => alum.major === department.value
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
          No notable alumni to display in Computer Science, Electrical Engineering, or Civil Engineering at this time. Check back later as our network grows!
        </p>
      )}
    </div>
  );
}
