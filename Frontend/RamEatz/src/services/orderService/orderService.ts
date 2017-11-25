import { Injectable } from '@angular/core';
import { comp } from "../../models/Orders_Items_Comps/comps";
import { item } from "../../models/Orders_Items_Comps/items";


@Injectable()
export class orderService {
    
   student: number;
   price: number;
   items: Array<item> = []; //Type items
   cook: number;
   currentItem: number;

   constructor() {
       this.currentItem = 0;
   }

   makeItem(data){
       console.log(data);
       var currentItem = new item();
       currentItem.name = data.name;
       currentItem.vendor = data.vendor;
       currentItem.price = data.price;
       this.items.push(currentItem);
       console.log(this.items.length);
       
   }

   makeComp(data){
       if (data == 'end'){
           this.currentItem++; //Move to the next item for the order
        } else { //Make the comps for the current item
            console.log(this.items);            
            var cItem = this.items[this.currentItem];
            var currentComp = new comp();
            currentComp.name = data.name;
            currentComp.vendor = data.vendor;
            currentComp.stock = data.stock;
            currentComp.price = data.price;
            currentComp.desp = data.description;
            cItem.comps.push(currentComp);
        }        
       
   }

   

 
   
}