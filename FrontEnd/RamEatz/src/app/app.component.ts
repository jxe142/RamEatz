import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from "../pages/home/home";

import { RestProvider } from "../providers/rest/rest";

import { TabsPage } from '../pages/tabs/tabs';
import { Nav } from 'ionic-angular/components/nav/nav';
import { stagger } from '@angular/core/src/animation/dsl';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  @ViewChild(Nav) nav:Nav;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public rest: RestProvider) {  
    var token = localStorage.getItem('token')
    if (token === null) {
      console.log("not logged in");
        this.rootPage = "LogInPage";
    } else {

      this.rest.test(token).then(data => {

        console.log(data);
        

      if(data['status'] == 401){
      
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
}
