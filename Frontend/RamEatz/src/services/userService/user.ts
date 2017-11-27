import { Injectable } from '@angular/core';
import { RestProvider } from "../../providers/rest/rest";

//Makes us ahve acesse to the user from any of the pages
@Injectable()
export class UserService {
    
   firstName: string;
   lastName: string;
   userId: number;
   token: string;
   userName: string;
   dc : number;
   swipes : number;

   constructor(public rest: RestProvider) {
       this.firstName = 'FirstName';
       this.lastName = 'LastName';
   }
 
   setUserName(firstName, lastName) {
       this.firstName = firstName;
       this.lastName = lastName;       
   }
 
   getUserName() {
       return this.firstName + ' ' + this.lastName;
   }  
}