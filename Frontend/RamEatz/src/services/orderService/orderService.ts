import { Injectable } from '@angular/core';

@Injectable()
export class orderService {
    
   firstName: string;
   lastName: string;
   student: number;
   price: number;
   items: Array<any> = [];

   constructor() {
   }
 
   setUserName(firstName, lastName) {
       this.firstName = firstName;
       this.lastName = lastName;       
   }
 
   getUserName() {
       return this.firstName + ' ' + this.lastName;
   }  
}