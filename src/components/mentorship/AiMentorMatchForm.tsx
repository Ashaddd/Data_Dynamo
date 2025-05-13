"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { handleAiMentorMatch } from "@/lib/actions";
import type { MatchedMentor } from "@/lib/types";
import MatchedMentorCard from "./MatchedMentorCard";
import { Lightbulb, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const initialState: { message?: string; matches?: MatchedMentor[]; error?: string } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full md:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Matching...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" /> Find My Mentors
        </>
      )}
    </Button>
  );
}

export default function AiMentorMatchForm() {
  const [state, formAction] = useFormState(handleAiMentorMatch, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4 p-6 border rounded-lg shadow bg-card">
        <div>
          <Label htmlFor="studentCareerInterests" className="text-lg font-semibold block mb-2">
            Describe Your Career Interests
          </Label>
          <Textarea
            id="studentCareerInterests"
            name="studentCareerInterests"
            rows={5}
            placeholder="e.g., I'm interested in software engineering, specifically in full-stack web development with React and Node.js. I'm also curious about product management in tech companies and how to transition into such roles. I'd love to learn about building scalable applications and leading engineering teams."
            className="shadow-sm"
            required
            minLength={20}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Be as specific as possible for the best matches. Minimum 20 characters.
          </p>
        </div>
        <SubmitButton />
      </form>

      {state?.error && (
        <Card className="border-destructive bg-destructive/10 text-destructive shadow-md">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div>
                        <p className="font-semibold">Matching Error</p>
                        <p className="text-sm">{state.error}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {state?.message && !state.matches && !state.error && (
        <Card className="border-primary bg-primary/10 text-primary-foreground shadow-md">
             <CardContent className="p-4">
                 <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 mt-0.5 text-primary" />
                     <div>
                        <p className="font-semibold text-primary">Matching Result</p>
                        <p className="text-sm text-foreground">{state.message}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {state?.matches && state.matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-foreground">
            Potential Mentor Matches ({state.matches.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.matches.map((mentor, index) => (
              <MatchedMentorCard key={index} mentor={mentor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
