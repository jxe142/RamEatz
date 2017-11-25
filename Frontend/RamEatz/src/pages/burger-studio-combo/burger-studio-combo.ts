import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Observable } from 'rxjs/Observable'
import { orderService } from "../../services/orderService/orderService";
import { comp } from "../../models/Orders_Items_Comps/comps";
import { TabsPage } from "../tabs/tabs";
/**
 * Generated class for the BurgerStudioComboPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-burger-studio-combo',
  templateUrl: 'burger-studio-combo.html',
})
export class BurgerStudioComboPage {

  compList: Array<any> = [];  
  selected: Array<any> = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest:RestProvider,
  public orderSer:orderService) {
    this.getComps();    
  }



  public notify(comp) {
    console.log(comp); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BurgerStudioCompsPage');
    console.log(this.orderSer.items[0]);
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
              console.log('BUNZZZ');
              this.compList.push({id:count, value: element}); 
              count++; 
            }                
          }
        }
      });
  }

  submitOrder(){
    for (var i=0; i < this.selected.length; i++) {
      if(this.selected[i] == true){
        console.log(i + " " + this.selected[i]);
        this.orderSer.makeComp(this.compList[i].value);        
      }      
    }  
    this.navCtrl.push("BurgerStudioCheesePage");  
  }

  
  cancelOrder(){
    this.orderSer.items.pop(); 
    this.orderSer.currentItem = this.orderSer.currentItem-1;
    console.log(this.orderSer.items.length);
    
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();  
  }

}
