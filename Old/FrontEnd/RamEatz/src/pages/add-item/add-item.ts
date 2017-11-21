import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Import the class
import { Item } from "../../models/Item/item-interface";

import { ItemListService } from "../../services/item/item.service";
import { ToastService } from "../../services/toast/toast.service";


//Import FireBase database
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

/**
 * Generated class for the AddItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {

  //This uses the interface in order to make object
  item: Item = {
    itemName: '',
    itemNumber: 0,
    localKey: '',
  }

  //An obserable refrece to the item DB in firebase
  //Defining what type of list it is
  ItemRef: AngularFireList<Item>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private itemList: ItemListService,
    private toast: ToastService) {
    this.ItemRef = this.database.list('item-list');
    /* Strcutre of firebase
      item-List:
        0: 
          Name: 'Bob'
          Number: 11
        1:
          Name: 'Tom'
          Number: 5
    */

  }

  addItem(item: Item) {

    //Tells to add the item them take the ref of the item and print it
    this.itemList.addItem(item).then(ref => {
      this.toast.show(`${item.itemName} added!`)
      this.navCtrl.setRoot('HomePage', { key: ref.key })
      console.log(ref.key);

    })


    // //This adds the item to the fire base page and push 
    // //to our firebase data base uner item-list
    // //this.ItemRef$.push(this.item) //This would send the item directly
    // //Customize to covert the object number to number
    // var keyObject = this.ItemRef.push({
    //   itemName: this.item.itemName,
    //   itemNumber: Number(this.item.itemNumber),
    //   localKey: '',
    // });
    // var key = keyObject['key']
    // console.log(key);
    // this.ItemRef.update(key, {
    //   itemName: this.item.itemName,
    //   itemNumber: Number(this.item.itemNumber),
    //   localKey: key,
    // });
    // //Rest our Item
    // this.item = {} as Item;
  }

}
