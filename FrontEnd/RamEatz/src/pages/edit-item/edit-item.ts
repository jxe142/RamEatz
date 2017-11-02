import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Item } from "../../models/Item/item-interface";
import { ItemListService } from "../../services/item/item.service";
import { ToastService } from "../../services/toast/toast.service";


/**
 * Generated class for the EditItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit-item.html',
})
export class EditItemPage {
  item: Item;

  constructor(public navCtrl: NavController, public navParams: NavParams, private itemList: ItemListService,
    private toast: ToastService) {
  }

  ionViewWillLoad() {
    this.item = this.navParams.get('item');
    console.log(this.navParams.get('item'));
  }

  saveItem(item: Item) {
    this.itemList.editItem(item).then(() => {
      this.toast.show(`${item.itemName} has been saved!`);
      this.navCtrl.setRoot("HomePage");

    });

  }

  removeItem(item: Item) {
    this.itemList.removeItem(item).then(() => {
      this.toast.show(`${item.itemName} deleted!`);
      this.navCtrl.setRoot("HomePage");

    });
  }

}
