import { NewProject } from './newProject.model';

export interface Project extends NewProject {
  id: number;
  isSelected: boolean;
}
