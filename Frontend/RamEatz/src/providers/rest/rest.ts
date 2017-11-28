import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { HttpHeaderResponse } from '@angular/common/http/src/response';
import { NavController } from 'ionic-angular';


// import { HttpHeaders } from '@angular/common/http/src/headers';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  apiUrl = 'http://localhost:5000';

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

 

  clearUserData(){    
    localStorage.removeItem('dc')
    localStorage.removeItem('firstName')
    localStorage.removeItem('id')
    localStorage.removeItem('lastName')
    localStorage.removeItem('swipes')
    localStorage.removeItem('userName')
    localStorage.removeItem('token')
  }

  

  getMItems(vendor) {
    var token = localStorage.getItem('token')
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/mItems/', {
        headers: new HttpHeaders({'vendor': vendor.toString(), 'token' : token}),
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        if (err['status'] == 401)
        {
          this.clearUserData()
          resolve(err)

        }
      });
    });
  }


  logIn(username,password){
    btoa("username:temppass");
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/login', {
        headers: new HttpHeaders().set("Authorization", "Basic " + btoa(username + ":" + password)), // "Content-Type", "application/x-www-form-urlencoded"
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        resolve(err)
      });
    });
  }

  getComps(vendor) {
    var token = localStorage.getItem('token')
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/comps/', {
        headers: new HttpHeaders({'vendor': vendor.toString(), 'token': token}),
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err['status']);
        if (err['status'] == 401)
        {
          this.clearUserData()
          resolve(err)

        }
      });
    });
  }

  test(token){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/helloPro', {
        headers: new HttpHeaders().set("token", token), // "Content-Type", "application/x-www-form-urlencoded"
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        resolve(err)
      });
    });

  }



  getUsers() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/hello').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  placeOrder(data) {
    var token = localStorage.getItem('token')
        
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/orders/', JSON.stringify(data), {
        headers: new HttpHeaders().set('token', token)
          .set('Content-Type', 'application/json')
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          console.log(err['status']);
          if (err['status'] == 401)
          {
            this.clearUserData()
            resolve(err)
  
          }
        });
    });
  }

  addUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/orders', JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          console.log(err);
          
        });
    });
  }

}
