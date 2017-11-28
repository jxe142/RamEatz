import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { UserService } from "../../services/userService/user";
import { TabsPage } from "../tabs/tabs";
import { MyApp } from "../../app/app.component";


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

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest:RestProvider, 
    public user: UserService, public alertCtrl: AlertController, public menu: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
    this.menu.swipeEnable(false, 'left');
    this.menu.enable(false, 'left');
    
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invaild Login!',
      subTitle: 'Invaild username or password please try again',
      buttons: ['OK']
    });
    alert.present();
  }




  logIn(){
    this.rest.logIn(this.username,this.password).then(data => {

      if(data['status'] != 401){
        var userJson = data['user']   
        this.user.token = data['token']
        window.localStorage.setItem('token', data['token'])
        window.localStorage.setItem('userName', userJson['username'])
        window.localStorage.setItem('firstName', userJson['firstName'])
        window.localStorage.setItem('lastName', userJson['lastName'])
        window.localStorage.setItem('id', userJson['id'])
        window.localStorage.setItem('dc', userJson['decliningBal'])
        window.localStorage.setItem('swipes', userJson['mealSwipes'])
        
        

        // this.navCtrl.push("HomePage")
        this.navCtrl.setRoot(MyApp)
        
      } 
      else {
        console.log('Errors');
        this.showAlert();
        
      }


     
    });

  }

}
