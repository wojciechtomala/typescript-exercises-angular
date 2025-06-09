import { NewProject } from './newProject.model';

export interface Project extends NewProject {
  _id: string;
  isSelected: boolean;
}
