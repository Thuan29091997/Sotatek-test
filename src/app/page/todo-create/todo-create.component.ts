import { Component, OnChanges, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { PIORITY, STORAGE_NAME } from "src/app/shared/constants/constant";
import { Task } from "src/app/shared/constants/task";
import { StorageService } from "src/app/shared/service/local-storage.service";
import { getDate } from "src/app/shared/ultil/utils";
import { minDate } from "src/app/shared/validate/customValidate";

@Component({
  selector: 'to-do-create',
  styleUrls: ['./todo-create.component.scss'],
  templateUrl: './todo-create.component.html'
})
export class ToDoCreate implements OnInit, OnChanges{

  title: string = 'Create Task';
  searchControl = new FormControl('');
  formGroup: any;
  listTask: Task[] = [];
  constructor(
    private fb: FormBuilder,
    private localStorage: StorageService,
    private toast: ToastrService
  ) {

  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {

  }

  initForm() {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: [getDate(new Date()), minDate()],
      piority: [PIORITY[1].id]
    });
  }

  getNewTaskId(listTask: Task[]) {
    return Math.max(...listTask.map((item: any) => item.id), 0) + 1;
  }

  submitForm() {
    this.listTask = this.localStorage.get(STORAGE_NAME.TODO_LIST) || [];
    const record = {id: this.getNewTaskId(this.listTask), ...this.formGroup.getRawValue()};
    this.pushNewTaskToList(this.listTask, record);
    this.localStorage.set(STORAGE_NAME.TODO_LIST, this.listTask);
    this.toast.success('Successful', 'Create Successful!')
    this.initForm();
  }

  pushNewTaskToList(listTask: Task[], newTask: Task) {
    let index = listTask.findIndex((item: Task) => {
      const itemDate = new Date(item.dueDate).setHours(0, 0, 0, 0);
      const newTaskDate = new Date(newTask.dueDate).setHours(0, 0, 0, 0);
      return itemDate > newTaskDate;
    });

    if(index === -1 && listTask.length) {
      index = listTask.length;
    }
    this.listTask.splice(index, 1, newTask);
  }
}