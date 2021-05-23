import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ToDoForm } from "./component/todo-form/todo-form.component";

@NgModule({
  declarations: [
    ToDoForm
  ],
  exports: [
    ToDoForm
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
  ]
})

export class SharedModule {}