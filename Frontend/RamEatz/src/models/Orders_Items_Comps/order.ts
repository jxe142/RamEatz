import { item } from "../Orders_Items_Comps/items";

export class order {

    student: number;
    price: number;
    itemLists: Array<any> = [];

    addItem(currentItem){
        this.itemLists.push(currentItem);
    }
    
}