import { Routes } from '@angular/router';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { AboutPageComponent } from './routes/about-page/about-page.component';
import { UserPageComponent } from './routes/user-page/user-page.component';
import { ProjectsPageComponent } from './routes/projects-page/projects-page.component';
import { EditProjectComponent } from './routes/projects-page/edit-project/edit-project.component';
import { ProjectDetailsPageComponent } from './routes/projects-page/project-details-page/project-details-page.component';
import { TasksPageComponent } from './routes/tasks-page/tasks-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'projects',
    component: ProjectsPageComponent,
  },
  {
    path: 'tasks',
    component: TasksPageComponent,
  },
  {
    path: 'create-project',
    component: EditProjectComponent,
  },
  {
    path: 'edit-project/:projectId',
    component: EditProjectComponent,
  },
  {
    path: 'project/:id',
    component: ProjectDetailsPageComponent,
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: 'my-account',
    component: UserPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
