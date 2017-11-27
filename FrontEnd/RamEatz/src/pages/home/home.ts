import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Observable } from 'rxjs/Observable'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data: any;
  itemList: Array<any> = [];
  username: string;
  

  constructor(public navCtrl: NavController, public rest: RestProvider, public menu: MenuController) {
    this.username = window.localStorage.getItem('username');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
    this.menu.swipeEnable(true, 'left');
    this.menu.enable(true, 'left');
    
  }

  getUsers() {
    this.rest.getUsers()
      .then(data => {
        this.data = data;
        console.log(this.data);
      });
  }

  navToBurgerStudioPage() {
    //Navages the useres to the add Item page
    //if use set root instead of push there would be no back button
    // console.log(window.localStorage.getItem('currentUser'));
    this.navCtrl.push("BurgerStudioPage");
  }

  navToLogInPage() {
    //Navages the useres to the add Item page
    //if use set root instead of push there would be no back button
    // console.log(window.localStorage.getItem('currentUser'));
    this.navCtrl.push("LogInPage"); 
  }

}
