import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PIORITY, STORAGE_NAME } from "src/app/shared/constants/constant";
import { Task } from "src/app/shared/constants/task";
import { StorageService } from "src/app/shared/service/local-storage.service";
import { cloneData, getDate } from "src/app/shared/ultil/utils";
import { minDate } from "src/app/shared/validate/customValidate";

@Component ({
  selector: 'to-do-list',
  styleUrls: ['./todo-list.component.scss'],
  templateUrl: './todo-list.component.html'
})

export class ToDoList implements OnInit, OnDestroy{

  title: string = 'To Do List';
  searchControl = new FormControl('');
  tasksForm: FormGroup | undefined;
  listToDo: Task[] = [];
  cloneData: any;
  keySearching: string = '';
  idActiveTask: number | undefined;
  isShowFooter: boolean = false;

  ngUnsubcribe = new Subject();
  constructor(
    private fb: FormBuilder,
    private localStorage: StorageService,
    private toast: ToastrService
  ) {

  }

  ngOnInit() {
    this.listToDo = this.localStorage.get(STORAGE_NAME.TODO_LIST) || [];
    this.cloneData = cloneData(this.listToDo);
    this.initialForm(this.listToDo);
    this.handleSearch();
  }

  ngOnDestroy() {
    this.ngUnsubcribe.next();
  }

  initialForm(list: Task[]): void {
    const valueArr = list.map((task: Task) => {
      return this.newTask(task);
    });

    this.tasksForm = this.fb.group({
      tasks: this.fb.array(valueArr)
    });
  }

  newTask(task: Task): FormGroup {
    return this.fb.group({
      title: [task.title || '', Validators.required],
      description: [task.description || ''],
      dueDate: [task.dueDate || getDate(new Date()), minDate()],
      piority: [task.piority || PIORITY[1].id],
      id: [task.id || null]
    })
  }

  removeItem(index?: number) {
    let idRemoves: number[] = [];
    if (index !== undefined) {
      const taskRemoved = this.cloneData.splice(index, 1);
      idRemoves = [taskRemoved[0].id];
      this.remove(index);
    } else {
      let count = 0;
      this.cloneData = this.cloneData.filter((item: Task, index: number) => {
        let result = true;

        if (item.checked) {
          result = false;
          idRemoves.push(item.id);
          this.remove(index - count++);
        }

        return result;
      });
      this.isShowFooter = false;
    }

    this.listToDo = this.listToDo.filter((item: Task) => !idRemoves.includes(item.id));
    this.toast.success('Remove task successfully', 'Remove');
    this.localStorage.set(STORAGE_NAME.TODO_LIST, this.listToDo);
  }

  get tasks() {
    return this.tasksForm?.controls.tasks as FormArray;
  }

  toggle(event: any, index: number) {
    this.cloneData[index].checked = event;
    this.isShowFooter = !!this.cloneData.filter((item: Task) => item.checked).length;
  }

  remove(index: number) {
    this.tasks.removeAt(index);
  }

  handleSearch() {
    this.searchControl.valueChanges.pipe(takeUntil(this.ngUnsubcribe)).subscribe((value: string) => {
      this.isShowFooter = false;
      this.keySearching = value;
      const searchArr = this.listToDo.filter((task: Task) => {
        return task.title.toLowerCase().search(value.toLowerCase()) !== -1;
      });
      this.cloneData = cloneData(searchArr);
      this.initialForm(searchArr);
    })
  }
}