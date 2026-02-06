import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './auth/login/login.component';
import { TasksPageComponent } from './pages/tasks/tasks-page.component';
import { AuditLogPageComponent } from './pages/audit-log/audit-log-page.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: ShellComponent,
    canMatch: [authGuard],
    children: [
      { path: '', pathMatch: 'full', component: TasksPageComponent },
      { path: 'audit-log', component: AuditLogPageComponent },
    ],
  },

  { path: '**', redirectTo: '' },
];
