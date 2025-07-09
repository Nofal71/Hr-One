import { ChangeEvent } from 'react';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobId: number;
  jobTitle: string;
  stageId: number;
  stageName: string;
  tagIds: number[];
  linkedin?: string;
  phone?: string;
  cvFileName?: string;
  screeningScore?: number;
  communicationSkills?: string;
  salaryExpectation?: string;
  location?: string;
  notes?: { text: string; date: string }[];
  screenedStatus: string[];
  screenedResults?: string;
}

export interface CandidateTypes {
  id: number;
  CandidateName: string;
  Email: string;
  Job_Title: string;
  Phone_Number: string;
  Candidate_Stage: string[];
  Tags: string[];
  linkedin?: string;
  downloadUrl?: string;
  screenedData: any;
  Communication_Skills: string[];
  Expected_Salary?: string;
  location?: string;
  notes?: { text: string; date: string }[];
  screenedStatus: string[];
  screenStatus: string;
  Created: string;
  webUrl?: string
}

export interface Tag {
  id: string | number;
  Title: string;
}

export interface Stage {
  id: number;
  Title: string;
}

export interface Job {
  id: number;
  Title: string;
  Status: string;
  Description: string
}

export interface JobPostingItem {
  id: number | string;
  job_title: string;
  job_description: string;
  job_status: string;
  Created?: string;
}

export interface Note {
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CvLibraryItem {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  job_title: string;
  candidate_stages: string;
  current_salary: string;
  expected_salary: string;
  years_of_experience: string;
  communication_skill: string;
  city: string;
  source: string;
  notes?: Note[];
  tags: string[];
  screen_results: any[];
  screen_status: any[];
  downloadUrl: string;
  Created: string
  webUrl?: string;
}



export interface FileInputEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList | null };
}


export interface ClientFilter {
  item: string,
  field: string
}
