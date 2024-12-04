import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

export default [
    { path: 'tasks', component: TaskListComponent },
    { path: 'tasks/create', component: TaskFormComponent },
    { path: 'tasks/edit/:id', component: TaskFormComponent },
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
    { path: '**', redirectTo: '/tasks' }
] satisfies Routes;