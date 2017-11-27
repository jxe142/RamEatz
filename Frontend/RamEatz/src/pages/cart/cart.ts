import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Observable } from 'rxjs/Observable'
import { orderService } from "../../services/orderService/orderService";
import { comp } from "../../models/Orders_Items_Comps/comps";
import { TabsPage } from "../tabs/tabs";

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  itemList: Array<any> = [];
  total: number;  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest:RestProvider,
  public orderSer:orderService, public view: ViewController) {
    this.getItems();    
  }

  ionViewWillEnter() {
    this.orderSer.orderPrice();
    this.total = this.orderSer.total; 
  }

  getItems() {
    this.itemList = this.orderSer.items;    
    this.orderSer.orderPrice();
    this.total = this.orderSer.total;    
  }

  

  

  submitOrder(){
    var json = JSON.stringify(this.orderSer);
    console.log(json);
    this.rest.placeOrder(json);
    
    
  }

  
  cancelOrder(){
    this.orderSer.items.pop(); 
    this.orderSer.currentItem = this.orderSer.currentItem-1;
    console.log(this.orderSer.items.length);
    
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();  
  }

}
