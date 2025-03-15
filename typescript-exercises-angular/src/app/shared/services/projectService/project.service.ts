import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../constants/environment';
import { NewProject } from '../../models/newProject.model';
import { Project } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private _projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  
  public readonly projects$: Observable<Project[]> = this._projects.asObservable();

  constructor(private _httpClient: HttpClient) {
    this.getProjectsFromLocalStorage();
  }

  private getProjectsFromLocalStorage(): void {
    const currentProjects = localStorage.getItem(environment.localStorageProjectsKey);
    this._projects.next(currentProjects ? JSON.parse(currentProjects) : []);
  }

  public getAllProjects(): Project[] {
    return this._projects.getValue();
  }

  public setSelectedProject(projectId: number): void {
    const currentProjects = this.getAllProjects().map(project => ({
      ...project,
      isSelected: project.id === projectId
    }));
    localStorage.setItem(environment.localStorageProjectsKey, JSON.stringify(currentProjects));
    this._projects.next(currentProjects);
  }

  public getSelectedProject() : Project | undefined {
    const currentProjects = this.getAllProjects();
    return currentProjects.find((project) => project.isSelected);
  }

  public getProjectById(id: number): Project | undefined {
    const projects = this._projects.getValue();
    return projects.find(project => project.id === id);
  }

  public createNewLocalStorageProject(newProject: NewProject): void {
    const currentProjects = this.getAllProjects();
    const project : Project = { ...newProject, id: currentProjects.length, isSelected: currentProjects.length === 0};
    currentProjects.push(project);
    localStorage.setItem(environment.localStorageProjectsKey, JSON.stringify(currentProjects));
    this.getProjectsFromLocalStorage();
  }

  public updateProject(updatedProject: Project): void {
    const currentProjects = this.getAllProjects().map(project => {
      if (project.id === updatedProject.id) {
        return updatedProject;
      }
      return project;
    });
    localStorage.setItem(environment.localStorageProjectsKey, JSON.stringify(currentProjects));
    this._projects.next(currentProjects);
  }

  public deleteProjectFromLocalStorage(id: number): void {
    const currentProjects = this.getAllProjects().filter(project => project.id !== id);
    localStorage.setItem(environment.localStorageProjectsKey, JSON.stringify(currentProjects));
    this.getProjectsFromLocalStorage();
  }

  // HTTPCLIENT:
  // public createProject(newProject: NewProject) : Observable<any> {
  //   return this._httpClient.post(`${environment.apiURL}/create-project`, newProject);
  // }

  // public updateProject(project: Project) : Observable<any> {
  //   return this._httpClient.put(`${environment.apiURL}/update-project`, project);
  // }

  // public deleteProject(projectId: string) : Observable<any> {
  //   return this._httpClient.delete(`${environment.apiURL}/delete-project/${projectId}`);
  // }

  // public getProjects() : Observable<Project[]> {
  //   return this._httpClient.get<Project[]>(`${environment.apiURL}/projects`);
  // }

  // public getProject(projectId: string) : Observable<Project> {
  //   return this._httpClient.get<Project>(`${environment.apiURL}/project/${projectId}`);
  // }
}
