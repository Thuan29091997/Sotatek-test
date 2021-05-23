import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  
  constructor() {

  }

  //get data in local storage
  get(name: string): any {
    return JSON.parse(localStorage.getItem(name) || '0');    
  }

  //set data in local storage
  set(name: string, value: any): any {
    localStorage.setItem(name, JSON.stringify(value));
  }

  remove(name: string) {
    localStorage.removeItem(name);
  }
}