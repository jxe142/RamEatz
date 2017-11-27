import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Observable } from 'rxjs/Observable'
import { orderService } from "../../services/orderService/orderService";
import { comp } from "../../models/Orders_Items_Comps/comps";
import { TabsPage } from "../tabs/tabs";
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the BurgerStudioCompsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-burger-studio-comps',
  templateUrl: 'burger-studio-comps.html',
})
export class BurgerStudioCompsPage {

  compList: Array<any> = [];  
  selected: Array<any> = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest:RestProvider,
  public orderSer:orderService, public alertCtrl: AlertController) {
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
            if(!name.includes('Bun') && !name.includes('bun') && !name.includes('Cheese') && !name.includes('cheese')){
              this.compList.push({id:count, value: element}); 
              count++; 
            }      
          }
        }
      });
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm adding to cart',
      message: 'Do you want to add this item to your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.cancelOrder();
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.navCtrl.setRoot(TabsPage);
            this.navCtrl.popToRoot();
            console.log(this.orderSer.items.length);
          }
        }
      ]
    });
    alert.present();
  }

  submitOrder(){
    for (var i=0; i < this.selected.length; i++) {
      if(this.selected[i] == true){
        console.log(i + " " + this.selected[i]);
        this.orderSer.makeComp(this.compList[i].value);
        // console.log(this.compList[i].value);        
      }      
    }

    this.orderSer.makeComp('end');
    this.presentConfirm();
    
    // this.navCtrl.push("BurgerStudioComboPage"); 
    
    
    
  }

  
  cancelOrder(){
    this.orderSer.items.pop(); 
    console.log(this.orderSer.items.length);
    
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();  
    
  }

}
