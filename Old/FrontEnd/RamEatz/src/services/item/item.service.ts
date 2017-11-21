import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";


import { Item } from "../../models/Item/item-interface";

//Lets the page know it can be injected by angular fire 
@Injectable()
export class ItemListService {

    //Tells angular fire which database to get from
    private itemListRef = this.db.list<Item>('item-list');

    //Consturction to build database locally
    constructor(private db: AngularFireDatabase) {
    }

    getItemList() {
        return this.itemListRef;
    }

    addItem(item: Item) {
        return this.itemListRef.push(item);
    }

    editItem(item: Item) {
        console.log(item.key);
        return this.itemListRef.update(item.key, item);
    }

    removeItem(item: Item) {
        return this.itemListRef.remove(item.key);
    }
}