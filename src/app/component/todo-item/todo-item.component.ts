import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { STORAGE_NAME } from "src/app/shared/constants/constant";
import { Task } from "src/app/shared/constants/task";
import { StorageService } from "src/app/shared/service/local-storage.service";
import { cloneData } from "src/app/shared/ultil/utils";

@Component({
  selector: 'to-do-item',
  styleUrls: ['./todo-item.component.scss'],
  templateUrl: './todo-item.component.html'
})

export class ToDoItem implements OnInit {
  
  checkboxControl = new FormControl('');
  title: string = '';
  isShow: boolean = false;
  @Input() openDetail: boolean = false;
  @Input() formGroups: any;
  @Output() removeTask = new EventEmitter();
  @Output() toggleCheckbox = new EventEmitter();
  @Output() showDetailEvent = new EventEmitter();

  ngSubcribe = new Subject();
  defaultValue: any;

  @ViewChild('detail', {static: false}) Detail: ElementRef | undefined;
  constructor(
    private localStorage: StorageService,
    private toast: ToastrService,
    private readonly rendered: Renderer2
  ) {

  }

  ngOnInit() {
    if(this.formGroups) {
      this.title = this.formGroups.value.title;
      this.defaultValue = cloneData(this.formGroups.value);
    }
    this.handleCheckbox();
  }

  showDetail(): void {
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.rendered.setStyle(this.Detail?.nativeElement, 'height', this.Detail?.nativeElement.scrollHeight + 'px');
      this.showDetailEvent.emit();
    } else {
      this.rendered.setStyle(this.Detail?.nativeElement, 'height', '0px');
    }
  }

  remove() {
    this.removeTask.emit()
  }

  updateTask():void {
    const todoList = this.localStorage.get(STORAGE_NAME.TODO_LIST) || [];
    const valueForm = this.formGroups?.getRawValue();
    const indexRecord = todoList.findIndex((item: Task) => item.id === valueForm.id);
    todoList[indexRecord] = valueForm;
    this.title = valueForm.title;
    todoList.sort((prev: Task, next: Task) => {
      const prvDueDate = new Date(prev.dueDate).setHours(0, 0, 0, 0);
      const nextDueDate = new Date(next.dueDate).setHours(0, 0, 0, 0);
      let result = 0;
      if (prvDueDate < nextDueDate) { result = -1 }
      if (prvDueDate > nextDueDate) { result = 1 }
      return result;
    });
    this.toast.info('Update task successfully!', 'Update');
    this.localStorage.set(STORAGE_NAME.TODO_LIST, todoList);
  }

  handleCheckbox() {
    this.checkboxControl.valueChanges.pipe(takeUntil(this.ngSubcribe)).subscribe(value => {
      this.toggleCheckbox.emit(value);
    })
  }
}