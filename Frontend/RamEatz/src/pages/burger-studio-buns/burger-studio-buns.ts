import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Observable } from 'rxjs/Observable'
import { orderService } from "../../services/orderService/orderService";
import { comp } from "../../models/Orders_Items_Comps/comps";
import { TabsPage } from "../tabs/tabs";

/**
 * Generated class for the BurgerStudioBunsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-burger-studio-buns',
  templateUrl: 'burger-studio-buns.html',
})
export class BurgerStudioBunsPage {

  compList: Array<any> = [];  
  selected: Array<any> = [];
  tabBarElement: any;
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest:RestProvider,
  public orderSer:orderService,) {
    this.getComps();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar'); 
    
    }


  getComps() {
    this.rest.getComps(1)
      .then(data => {
        var count = 0;
        for (const item in data) {
          if (data.hasOwnProperty(item)) {
            const element = data[item];
            var name = String(element.name);
            if(name.includes('Bun') || name.includes('bun')){
              this.compList.push(element); 
            }                
          }
        }
      });
  }

  submitOrder(comp){
    this.orderSer.makeComp(comp);  
    this.navCtrl.push("BurgerStudioCheesePage");  
  }

  
  cancelOrder(){
    this.orderSer.items.pop(); 
    console.log(this.orderSer.currentItem);
    console.log(this.orderSer.items.length);
    
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();  
  }

}

