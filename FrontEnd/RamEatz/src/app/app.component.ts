import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from "../pages/home/home";

import { RestProvider } from "../providers/rest/rest";

import { UserService } from "../services/userService/user";
import { orderService } from "../services/orderService/orderService";

import { TabsPage } from '../pages/tabs/tabs';
import { Nav } from 'ionic-angular/components/nav/nav';
import { stagger } from '@angular/core/src/animation/dsl';
import { Tabs } from 'ionic-angular/components/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = TabsPage;
  firstName: string;
  lastName: string;
  userName: string;
  dc : number;
  swipes: number;


  @ViewChild(Nav) nav:Nav;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public rest: RestProvider,
  public user: UserService, public menu: MenuController, public orderSer: orderService) {  
    
    var token = localStorage.getItem('token')
    if (token === null) {
      console.log("not logged in");
        this.rootPage = "LogInPage";
    } else {

      this.rest.test(token).then(data => {

      if(data['status'] == 401){
        this.rootPage = "LogInPage";
      } else {

        console.log(data);
        
        
        var userJson = localStorage.getItem('user')
        userJson = JSON.stringify(user);
        this.firstName =  localStorage.getItem('firstName')
        this.lastName = localStorage.getItem('lastName')
        this.userName = localStorage.getItem('userName')
        this.dc = parseInt( localStorage.getItem('dc'))
        console.log(this.dc);        
        this.swipes = parseInt( localStorage.getItem('swipes'))
        console.log(this.firstName);
        this.rootPage = TabsPage
        
        
      }

    });
  }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  logOut(){
    this.orderSer.reset()
    this.rest.clearUserData()
    this.nav.setRoot('LogInPage')
    
  }

}
