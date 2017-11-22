import { Injectable } from '@angular/core';

//Makes us ahve acesse to the user from any of the pages
@Injectable()
export class UserService {
    
   firstName: string;
   lastName: string;

   constructor() {
       this.firstName = 'Blank';
       this.lastName = 'Name';
   }
 
   setUserName(firstName, lastName) {
       this.firstName = firstName;
       this.lastName = lastName;       
   }
 
   getUserName() {
       return this.firstName + ' ' + this.lastName;
   }  
}