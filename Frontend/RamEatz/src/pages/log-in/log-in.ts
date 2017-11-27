import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { UserService } from "../../services/userService/user";
import { TabsPage } from "../tabs/tabs";


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
        this.user.firstName = userJson['firstName']
        this.user.lastName = userJson['lastName']
        this.user.userName = userJson['username']
        this.user.userId = userJson['id']
        this.user.dc = userJson['decliningBal']
        this.user.swipes = userJson['mealSwipes']

        // this.navCtrl.push("HomePage")
        this.navCtrl.setRoot(TabsPage)
        
      } 
      else {
        console.log('Errors');
        this.showAlert();
        
      }


     
    });

  }

}
