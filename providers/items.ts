import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';  
import 'rxjs/add/operator/map';

import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { Api } from './api';
import { User } from '@ionic/cloud-angular';
import { Item } from '../models/item';
import { Social } from './social';
import { ChatsProvider } from './chats-provider';
  
//import {SQLite} from "ionic-native";

@Injectable()
export class Items {

  items: FirebaseListObservable<any>;
  uid: any;
  constructor(public http: Http, public api: Api,public af: AngularFire,
  			  public social: Social, public cp: ChatsProvider) {
  	 this.items = af.database.list('/items');
  	 this.uid=this.social.getUID();
  	 console.log(this.uid);
  }

  query(params?: any) {
   if(!params) {
      this.items= this.af.database.list('items', {
	    query: {
	      orderByChild: 'uid',
	      equalTo:this.uid
	    }
	  });
	  return this.items;
    }
    return this.af.database.list ('items',{
	    query: {
	      orderByChild: 'uid',
	      equalTo:this.uid
	    }
	  })
	.map(items => {
	return items.filter((item) => {
      for(let key in params) {
        let field = item[key];
        if(typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if(field == params[key]) {
          return item;
        }
      }
      return null;
    });
   });
  }

  update(item){
   this.items.update(item.$key,item);
  }

  add(item: Item) {
  console.log(item);
  this.items.push(item);
  }

  delete(id) {
  console.log(id);
   this.items.remove(id);
   this.cp.delete(id);
  }

}
