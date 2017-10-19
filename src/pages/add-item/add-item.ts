import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Import the class
import { Item } from "../../models/Item/item-interface";

//Import FireBase database
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from 'rxjs/Observable'
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
  item = {} as Item

  //An obserable refrece to the item DB in firebase
  //Defining what type of list it is
  ItemRef: AngularFireList<Item>

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: AngularFireDatabase) {
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
    //This adds the item to the fire base page and push 
    //to our firebase data base uner item-list

    //this.ItemRef$.push(this.item) //This would send the item directly

    //Customize to covert the object number to number
    var returnItem = this.ItemRef.push({
      itemName: this.item.itemName,
      itemNumber: Number(this.item.itemNumber),
      localKey: '',
    });

    this.item.localKey = returnItem.key;

    //Rest our Item
    this.item = {} as Item;


    //Take user back to home page
    this.navCtrl.pop()
  }

}
