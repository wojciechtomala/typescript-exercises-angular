import { Story } from './story.model';

export interface NewProject {
  name: string;
  description: string;
  createdAt: string;
  endDate: string;
  maxAssignedUsers: number;
  stories: Story[];
}
