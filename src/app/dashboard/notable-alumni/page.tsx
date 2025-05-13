import NotableAlumniList from '@/components/alumni/NotableAlumniList';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import { MAJORS_DEPARTMENTS } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Alumni } from '@/lib/types';
import { mockAlumni } from '@/data/alumni'; // Import mock alumni data

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
    // FirebaseError: [code=invalid-argument]: A maximum of 10 'in' filter value comparisons are allowed in a single query.
    // If departmentValues grows beyond 10, this query will fail.
    // For 3 target departments, this is fine.
    const q = query(
      usersCollection,
      where('userType', '==', 'alumni'),
      where('isNotable', '==', true),
      where('major', 'in', departmentValues) 
    );
    const querySnapshot = await getDocs(q);
    const alumni = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const graduationYear = data.graduationYear ? Number(data.graduationYear) : undefined;
      return {
        id: doc.id,
        ...data,
        graduationYear,
      } as Alumni;
    });
    return alumni;
  } catch (error) {
    console.error("Error fetching notable alumni from Firestore:", error);
    return []; 
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

  const firestoreNotableAlumni = await getNotableAlumniByDepartments(TARGET_DEPARTMENT_VALUES);

  // Prepare mock notable alumni for target departments as a fallback
  const mockNotableAlumniForTargetDepartments = mockAlumni.filter(alum => 
    TARGET_DEPARTMENT_VALUES.includes(alum.major) && alum.isNotable
  );

  // Determine if there's any data to show (either from Firestore or mock)
  const hasAnyDataToShow = targetDepartments.some(department => {
    const firestoreDataForDept = firestoreNotableAlumni.filter(alum => alum.major === department.value);
    const mockDataForDept = mockNotableAlumniForTargetDepartments.filter(alum => alum.major === department.value);
    return firestoreDataForDept.length > 0 || mockDataForDept.length > 0;
  });

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

      {hasAnyDataToShow ? (
        <Tabs defaultValue={targetDepartments[0].value} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
            {targetDepartments.map((department) => (
              <TabsTrigger key={department.value} value={department.value} className="text-sm sm:text-base">
                {department.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {targetDepartments.map((department) => {
            let alumniForTab = firestoreNotableAlumni.filter(
              (alum) => alum.major === department.value
            );

            // If no Firestore data for this department, use mock data as fallback
            if (alumniForTab.length === 0) {
              alumniForTab = mockNotableAlumniForTargetDepartments.filter(
                (alum) => alum.major === department.value
              );
            }

            return (
              <TabsContent key={department.value} value={department.value} className="space-y-6">
                {alumniForTab.length > 0 ? (
                  <NotableAlumniList alumni={alumniForTab} />
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
          No notable alumni to display in the configured departments at this time. Check back later as our network grows!
        </p>
      )}
    </div>
  );
}
