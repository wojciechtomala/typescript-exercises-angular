export type Priority = 'Low' | 'Mid' | 'High';

export type Status = 'Todo' | 'Doing' | 'Done';

export interface NewStory {
  name: string;
  description: string;
  priority: Priority;
  projectId: number;
  createDate: Date;
  status: Status;
  ownerId: string;
}

export interface Story extends NewStory {
  id: number;
}
