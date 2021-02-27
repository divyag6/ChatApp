import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
//import * as io from 'socket.io-client';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Items } from '../../providers/providers';
import { ChatViewPage }  from '../chat-view/chat-view';
import { ItemEditPage }  from '../item-edit/item-edit';
import { Item } from '../../models/item';


@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  
  item: any;
 
   constructor(public navCtrl: NavController, navParams: NavParams, 
               public items: Items, public modalCtrl: ModalController ) {
  
    this.item = navParams.get('item');
   
    //console.log(this.item);
    // || items.defaultItem;
   
  }
  
  edit(item: Item){
  	let editModal = this.modalCtrl.create(ItemEditPage,{
      item: item
    });
    editModal.onDidDismiss(item => {
      if (item) {
        this.items.update(item);
      }
    });
    editModal.present();
    
  }
  
   /**
   *  This shows our ChatViewPage in a modal.
   */
  openChat(item: Item) {
  	 console.log(item);
  	 this.navCtrl.push(ChatViewPage, {
      item: item
    });
  }
  
}
