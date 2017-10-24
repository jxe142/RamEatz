import { Component } from '@angular/core';
import { NavController, ActionSheetController, IonicPage } from 'ionic-angular';

//Import the observable and Database
import { Observable } from 'rxjs/Observable'
import { Item } from "../../models/Item/item-interface";

import { ItemListService } from "../../services/item/item.service";



//Ionic Page dec allows us lazy load the page 
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //The obseravle that is of type item list
  itemList: Observable<any[]>

  //Import the database here
  constructor(public navCtrl: NavController,
    private actions: ActionSheetController,
    private List: ItemListService, ) {

    /*We are point the itemlist ref at firebse -> 'item list node'
      Not only can we push to data base we have accues to everything insdie that node
    */
    // this.ItemRef$ = this.database.list('item-list');

    this.itemList = this.List
      .getItemList() //Get the DataBase list
      .snapshotChanges(). //Get Key and value Pairs
      map( //Maps these cahgnes and for each one retrun a new obejct
      changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      });



  }

  selectItem(item: Item) {
    /* Display action sheet that lets the user
      1. Edit the Item
      2.Delete Item
      3.Canacel Selection

    */

    this.actions.create({
      //Bck tick lets us use a template string
      title: `${item.itemName}`,
      buttons: [
        {
          text: 'Edit',
          //Lets us add a function to the button
          handler: () => { }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            //Deltes the item the $key is for the actual firebase key
            console.log(
              item.localKey);
            // this.ItemRef.remove(item.localKey);
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => console.log('Cancel has been pressed')
        }
      ]
    }).present();
  }

  navToAddItemPage() {
    //Navages the useres to the add Item page
    //if use set root instead of push there would be no back button
    this.navCtrl.push("AddItemPage");
  }

  navToEditItemPage() {
    //Navages the useres to the add Item page
    //if use set root instead of push there would be no back button
    this.navCtrl.push("EditItemPage");
  }

}
