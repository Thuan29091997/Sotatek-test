import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToDoCreate } from './page/todo-create/todo-create.component';
import { ToDoList } from './page/todo-list/todo-list.component';

const routes: Routes = [
  {
    path: '',
    component: ToDoList 
  },
  {
    path: 'list',
    component: ToDoList
  },
  {
    path: 'create',
    component: ToDoCreate
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
