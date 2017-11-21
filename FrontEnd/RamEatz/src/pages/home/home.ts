import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data: any;

  constructor(public navCtrl: NavController, public rest: RestProvider) {
    this.getUsers();
  }

  getUsers() {
    this.rest.getUsers()
      .then(data => {
        this.data = data;
        console.log(this.data);
      });
  }

}
