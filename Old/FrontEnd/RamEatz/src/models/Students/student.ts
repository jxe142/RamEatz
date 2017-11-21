
import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";


@Injectable()
export class Student {

    private firtName: string;
    private lastName: string;
    private bannerID: string;
    private mealSwipes: number;
    private declineBal: number;

    //List that holds the students
    private fireBaseRefList;


    //Using the users information from local storage grab profile
    //and set the values we get equal to this 
    constructor(private db: AngularFireDatabase) {
        const key = window.localStorage.getItem("token");
        this.fireBaseRefList = this.db.object<Student>(`students/${key}`);
    }


}