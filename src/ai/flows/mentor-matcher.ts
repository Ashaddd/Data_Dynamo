// src/ai/flows/mentor-matcher.ts
'use server';
/**
 * @fileOverview An AI-powered mentor matching tool. Matches current students with alumni mentors based on career interests and background.
 *
 * - mentorMatch - A function that handles the mentor matching process.
 * - MentorMatchInput - The input type for the mentorMatch function.
 * - MentorMatchOutput - The return type for the mentorMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentorMatchInputSchema = z.object({
  studentCareerInterests: z
    .string()
    .describe('The career interests of the student seeking a mentor.'),
  alumniProfiles: z.array(z.object({
    name: z.string().describe('The name of the alumnus.'),
    background: z.string().describe('The background and expertise of the alumnus.'),
    contactInfo: z.string().describe('The contact information of the alumnus.'),
  })).describe('An array of alumni profiles to match against.'),
});
export type MentorMatchInput = z.infer<typeof MentorMatchInputSchema>;

const MentorMatchOutputSchema = z.array(z.object({
  name: z.string().describe('The name of the matched alumnus.'),
  background: z.string().describe('The background and expertise of the matched alumnus.'),
  contactInfo: z.string().describe('The contact information of the matched alumnus.'),
  matchScore: z.number().describe('A score indicating the strength of the match (0-1).'),
  reason: z.string().describe('Why this alumnus is a good match for the student.'),
})).describe('An array of matched alumni mentors, sorted by match score in descending order.');
export type MentorMatchOutput = z.infer<typeof MentorMatchOutputSchema>;

export async function mentorMatch(input: MentorMatchInput): Promise<MentorMatchOutput> {
  return mentorMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentorMatchPrompt',
  input: {schema: MentorMatchInputSchema},
  output: {schema: MentorMatchOutputSchema},
  prompt: `You are an AI-powered mentor matching tool. Your task is to match a student with suitable alumni mentors based on their career interests and the alumni\'s backgrounds.

  The student is interested in the following career paths:
  {{studentCareerInterests}}

  Here are the profiles of available alumni mentors:
  {{#each alumniProfiles}}
  Name: {{this.name}}
  Background: {{this.background}}
  Contact Info: {{this.contactInfo}}
  {{/each}}

  Analyze each alumnus profile and determine how well it aligns with the student\'s career interests. Provide a match score between 0 and 1 (inclusive), where 1 indicates a perfect match. Also, provide a brief reason for the match score.

  Return a JSON array of matched alumni mentors, sorted by match score in descending order. Each object in the array should contain the alumnus\'s name, background, contact info, match score, and reason for the match. Adhere exactly to the output schema.
  `,
});

const mentorMatchFlow = ai.defineFlow(
  {
    name: 'mentorMatchFlow',
    inputSchema: MentorMatchInputSchema,
    outputSchema: MentorMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
