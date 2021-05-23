import { AbstractControl, ValidatorFn } from "@angular/forms";

export function minDate(min?: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if(!!control.value) {
      const timeValue = new Date(control.value).setHours(0, 0, 0, 0);
      const minValue = (min ? new Date(min) : new Date()).setHours(0, 0, 0, 0);
      
      if (timeValue < minValue) {
        return { 'minDate': true };
      }
    }
    return null;
  }
}