import { comp } from "../Orders_Items_Comps/comps";

export class item {
    
       name: string;
       vendor: number;
       price: number;
       comps: Array<any> = [];

       constructor(){
           
       }

       addComp(currentComp){
        this.comps.push(currentComp);

       }
        
    }