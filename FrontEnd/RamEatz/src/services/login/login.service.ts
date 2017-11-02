import { AngularFireAuth } from "angularfire2/auth";
import { Injectable } from "@angular/core";
import { User } from "../../models/user";

@Injectable()
export class loginService {

    user = {} as User

    //Consturction to build database locally
    constructor(private afAuth: AngularFireAuth, ) {
    }

    async login(userName, passWord) {
        console.log(userName);
        console.log(passWord);
        try {
            const log = this.afAuth.auth.signInWithEmailAndPassword(userName, passWord);
            if (log) {
                return true;
            }

        } catch (e) {
            console.log(e);
            return false;

        }

    }
}