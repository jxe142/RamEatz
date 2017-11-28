import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Observable } from 'rxjs/Observable'
import { orderService } from "../../services/orderService/orderService";
import { item } from "../../models/Orders_Items_Comps/items";
import { LOCATION_INITIALIZED } from '@angular/common';
import { MyApp } from "../../app/app.component";
/**
 * Generated class for the BurgerStudioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-burger-studio',
  templateUrl: 'burger-studio.html',
})
export class BurgerStudioPage {

  itemList: Array<any> = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider,
  public orderSer: orderService) {
    this.getItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BurgerStudioPage');
  }

  makeItem(item){  
    console.log(item);
    this.orderSer.makeItem(item);
    this.navCtrl.push("BurgerStudioBunsPage");
  }


  getItems() {
    var token = localStorage.getItem("token")
    if(token){
    this.rest.getMItems(1)
      .then(data => {
        if(data['status'] == 401){
          this.rest.clearUserData()
          this.navCtrl.setRoot("LogInPage")
        } else {

        for (const item in data) {
          if (data.hasOwnProperty(item)) {
            const element = data[item];
            this.itemList.push(element);

            console.log(element);
            
          }
        }
      }
      });
    } else {
      this.rest.clearUserData()
      this.navCtrl.setRoot("LogInPage")
    }
  }



}
