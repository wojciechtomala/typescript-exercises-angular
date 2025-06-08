import { Routes } from '@angular/router';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { AboutPageComponent } from './routes/about-page/about-page.component';
import { UserPageComponent } from './routes/user-page/user-page.component';
import { ProjectsPageComponent } from './routes/projects-page/projects-page.component';
import { EditProjectComponent } from './routes/projects-page/edit-project/edit-project.component';
import { ProjectDetailsPageComponent } from './routes/projects-page/project-details-page/project-details-page.component';
import { TasksPageComponent } from './routes/tasks-page/tasks-page.component';
import { TaskDetailsComponent } from './routes/tasks-page/task-details/task-details.component';
import { LoginPageComponent } from './routes/login-page/login-page.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects',
    component: ProjectsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    component: TasksPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'task-details/:storyId/:taskId',
    component: TaskDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-project',
    component: EditProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-project/:projectId',
    component: EditProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project/:id',
    component: ProjectDetailsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-account',
    component: UserPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
