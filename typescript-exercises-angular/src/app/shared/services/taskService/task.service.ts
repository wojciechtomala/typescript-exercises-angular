import { Injectable } from '@angular/core';
import { ProjectService } from '../projectService/project.service';
import { Task, NewTask } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { environment } from '../../constants/environment';
import { generateUniqueId } from '../../helpers/generateUniqueId.helper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private projectService: ProjectService,
    private _httpClient: HttpClient
  ) {}

  // private updateProjects(projects: Project[]): void {
  //   localStorage.setItem(
  //     environment.localStorageProjectsKey,
  //     JSON.stringify(projects)
  //   );
  //   this.projectService.getProjectsFromLocalStorage();
  // }

  // public createTask(storyId: number, task: NewTask): void {
  //   const projects = this.projectService.getAllProjects();

  //   for (const project of projects) {
  //     const story = project.stories.find((s) => s.id === storyId);
  //     if (story) {
  //       // const newId = story.tasks.length
  //       //   ? Math.max(...story.tasks.map((t) => t.id)) + 1
  //       //   : 0;
  //       const newId = generateUniqueId();

  //       const newTask: Task = { ...task, id: newId };
  //       story.tasks.push(newTask);
  //       this.updateProjects(projects);
  //       return;
  //     }
  //   }
  // }

  // public getTasks(storyId?: number | null): Task[] {
  //   const projects = this.projectService.getAllProjects();

  //   if (!storyId) {
  //     return projects.flatMap((project) =>
  //       project.stories.flatMap((story) => story.tasks ?? [])
  //     );
  //   }

  //   for (const project of projects) {
  //     const story = project.stories.find((s) => s.id === storyId);
  //     if (story) {
  //       return story.tasks;
  //     }
  //   }

  //   return [];
  // }

  // public getTask(storyId: number, taskId: number): Task | undefined {
  //   const tasks = this.getTasks(storyId);
  //   return tasks.find((task) => task.id === taskId);
  // }

  // public updateTask(storyId: number, updatedTask: Task): void {
  //   console.log(updatedTask);
  //   const projects = this.projectService.getAllProjects();

  //   for (const project of projects) {
  //     const story = project.stories.find((s) => s.id === storyId);
  //     if (story) {
  //       story.tasks = story.tasks.map((task) =>
  //         task.id === updatedTask.id ? updatedTask : task
  //       );
  //       this.updateProjects(projects);
  //       return;
  //     }
  //   }
  // }

  // public deleteTask(storyId: number, taskId: number): void {
  //   const projects = this.projectService.getAllProjects();

  //   for (const project of projects) {
  //     const story = project.stories.find((s) => s.id === storyId);
  //     if (story) {
  //       story.tasks = story.tasks.filter((task) => task.id !== taskId);
  //       this.updateProjects(projects);
  //       return;
  //     }
  //   }
  // }

  // HTTPCLIENT:
  public createTask(newTask: NewTask): Observable<void> {
    return this._httpClient.post<void>(
      `${environment.apiURL}/create-task/${newTask.storyId}`,
      newTask
    );
  } // DONE

  public updateTask(task: Task): Observable<void> {
    return this._httpClient.put<void>(
      `${environment.apiURL}/update-task/${task._id}`,
      task
    );
  } // DONE

  public deleteTask(taskId: string): Observable<void> {
    return this._httpClient.delete<void>(
      `${environment.apiURL}/delete-task/${taskId}`
    );
  } // DONE

  public getTasks(storyId?: string): Observable<Task[]> {
    if (storyId) {
      return this._httpClient.get<Task[]>(`${environment.apiURL}/tasks`, {
        params: { storyId },
      });
    } else {
      return this._httpClient.get<Task[]>(`${environment.apiURL}/tasks`);
    }
  } // DONE

  public getTask(taskId: string): Observable<Task> {
    return this._httpClient.get<Task>(`${environment.apiURL}/task/${taskId}`);
  } // DONE
}
