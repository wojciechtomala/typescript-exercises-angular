import { NewProject } from './newProject.model';
import { Story } from './story.model';

export interface Project extends NewProject {
  id: number;
  isSelected: boolean;
  stories: Story[];
}
