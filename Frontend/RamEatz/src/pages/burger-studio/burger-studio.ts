import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Observable } from 'rxjs/Observable'
import { orderService } from "../../services/orderService/orderService";

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
  orderSer: orderService) {
    this.getItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BurgerStudioPage');
  }

  getItems() {
    this.rest.getMItems(1)
      .then(data => {
        for (const item in data) {
          if (data.hasOwnProperty(item)) {
            const element = data[item];
            this.itemList.push(element);

            console.log(element);
            
          }
        }
      });
  }

}
