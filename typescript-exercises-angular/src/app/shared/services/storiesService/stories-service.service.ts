import { Injectable } from '@angular/core';
import { ProjectService } from '../projectService/project.service';
import { NewStory, Story } from '../../models/story.model';
import { Project } from '../../models/project.model';
import { environment } from '../../constants/environment';
import { generateUniqueId } from '../../helpers/generateUniqueId.helper';

@Injectable({
  providedIn: 'root',
})
export class StoriesService {
  constructor(private projectService: ProjectService) {}

  public createStory(projectId: number, newStory: NewStory): void {
    const projects = this.projectService.getAllProjects();
    const projectIndex = projects.findIndex((p) => p.id === projectId);

    if (projectIndex === -1) return;

    const stories = projects[projectIndex].stories || [];
    // const newId = stories.length
    //   ? Math.max(...stories.map((s) => s.id)) + 1
    //   : 0;
    const newId = generateUniqueId();

    const story: Story = { ...newStory, id: newId };
    stories.push(story);

    projects[projectIndex].stories = stories;
    this.updateProjects(projects);
  }

  public updateStory(projectId: number, updatedStory: Story): void {
    const projects = this.projectService.getAllProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    project.stories = project.stories.map((story) =>
      story.id === updatedStory.id ? updatedStory : story
    );
    this.updateProjects(projects);
  }

  public deleteStory(projectId: number, storyId: number): void {
    const projects = this.projectService.getAllProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) return;

    project.stories = project.stories.filter((story) => story.id !== storyId);

    this.updateProjects(projects);
  }

  public getAllStories(): Story[] {
    const projects = this.projectService.getAllProjects();
    return projects.flatMap((project) => project.stories);
  }

  public getStories(projectId: number): Story[] {
    const project = this.projectService.getProjectById(projectId);
    return project?.stories ?? [];
  }

  public getStory(storyId: number): Story | null {
    const projects = this.projectService.getAllProjects();

    for (const project of projects) {
      const story = project.stories.find(
        (storyItem) => storyItem.id === storyId
      );
      if (story) {
        return story;
      }
    }

    return null;
  }

  private updateProjects(projects: Project[]): void {
    localStorage.setItem(
      environment.localStorageProjectsKey,
      JSON.stringify(projects)
    );
    this.projectService.getProjectsFromLocalStorage();
  }
}
