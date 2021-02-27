import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatsProvider } from '../../providers/chats-provider';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ChatViewPage }  from '../chat-view/chat-view';
import { Item } from '../../models/item';

@Component({
    templateUrl: 'chats.html'
})
export class ChatsPage {
    chats: any;
    constructor(public chatsProvider: ChatsProvider, 
       // public userProvider: UserProvider, 
        public af:AngularFire, 
        public navCtrl: NavController) {
           
          this.chatsProvider.getChats()
          	.subscribe((chats)=>
          	{
          		this.chats=chats;
          		console.log("Chats..",this.chats); 
          	});
          	
            
        }
    
    /**
   * Delete an item from the list of items.
   */
  deleteChat(chat) {
    this.chatsProvider.delete(chat.$key);
  }
    
    openChat(item: Item) {
  	 this.navCtrl.push(ChatViewPage, {
      item: item
    });
  }
    
}