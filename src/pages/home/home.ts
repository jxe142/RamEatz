import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { AddItemPage } from "../add-item/add-item";

//Import the observable and Database
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from 'rxjs/Observable'
import { Item } from "../../models/Item/item-interface";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //The obseravle that is of type item list
  ItemRef: Observable<Item[]>

  //Import the database here
  constructor(public navCtrl: NavController,
    private database: AngularFireDatabase,
    private actions: ActionSheetController) {

    /*We are point the itemlist ref at firebse -> 'item list node'
      Not only can we push to data base we have accues to everything insdie that node
    */
    // this.ItemRef$ = this.database.list('item-list');
    this.ItemRef = this.database.list('item-list').valueChanges();

    //Prints to the console but need to display in html
    //this.itemRef.subscribe(x => console.log(x))

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
            // console.log(item.key);
            //this.database.object(`/item-list/item.$key`).remove();
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
    this.navCtrl.push(AddItemPage);
  }

}
