import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PIORITY } from "../../constants/constant";

@Component({
  selector: 'to-do-form',
  styleUrls: ['./todo-form.component.scss'],
  templateUrl: './todo-form.component.html'
})

export class ToDoForm implements OnInit {

  @Input() isCreate: boolean = false;
  @Input() formGroup: any;
  @Input() showDetail: boolean = false;
  @Input() value: any;
  @Output() submitValue = new EventEmitter();

  isSubmit: boolean = false;
  disable: boolean = true;
  piority = PIORITY;
  constructor() {
    
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(() => this.disable = false);
  }

  submitForm() {    
    if(JSON.stringify(this.value) !== JSON.stringify(this.formGroup.getRawValue())) {
      this.isSubmit = true;
      if(this.formGroup.valid && this.isSubmit) {
        this.submitValue.emit();
        this.isSubmit = false;
      }
    }
  }
}