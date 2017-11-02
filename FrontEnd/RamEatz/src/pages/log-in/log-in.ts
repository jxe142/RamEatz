import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


import { loginService } from "../../services/login/login.service";


import { User } from "../../models/user"

/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  user = {} as User;
  result: Observable<firebase.User>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private logIn: loginService,
    private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
  }

  async login(user: User) {
    var nav = this.navCtrl;

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(function (firebaseUser) { //If it works
        console.log(firebaseUser.uid);
        let currentUser = {
          token: firebaseUser.uid,
        };
        window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
        nav.push("HomePage");




      })
      .catch(function (error) { //if it fails
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });






    // try {
    //   const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
    //   if (result) {
    //     console.log(result); 
    //     let currentuser = {

    //     };


    //     this.navCtrl.push("HomePage");
    //   }

    // } catch (e) {
    //   console.log(e);
    // }

    // const result = this.logIn.login(user.email, user.password, );
    // console.log(result);

    // if (result) {
    //   this.navCtrl.push("HomePage");
    // }

  }

}
