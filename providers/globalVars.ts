import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
  
  private isLoggedIn:boolean;
  
  constructor() {
    this.isLoggedIn = false;
  }

  setIsLoggedIn(value) {
    this.isLoggedIn = value;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

}