import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
//import { UserProvider } from '../user-provider/user-provider';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Injectable()
export class ChatsProvider {

  chats: FirebaseListObservable<any>;
  adminId: any;
  
  constructor(public af: AngularFire) {
    
    this.af.database.object(`/items/adminId`)
     .subscribe(data=>{
       this.adminId = data.$value;
       console.log("Admin id:", this.adminId);
       this.chats= this.af.database.list(`/items/${this.adminId}`);
     });   
  }
    
   /*get Admin Id*/
    
   getAdminId()
   {
     return this.adminId;
   }
    
  // get list of Chats for a Logged In User
  
  getChats() {
     
    this.chats= this.chats
   .map (chats => 
    {
       chats.map(item => 
     	{
        	console.log("Item",item);
        	this.af.database.object(`/items/${item.$key}`)
       		.subscribe(details =>
         	{
            	console.log("Item Info",details);
                item.info=details;
             });  
             
             return item;
          });
         return chats;
      }) as FirebaseListObservable<any>;
       return this.chats ; 
  }
  
  
  //Delete chat
  delete(id) {
    this.chats.remove(id);
   
  }
  
 setObject(keyValue,itemId)
 {
    this.af.database.object(`/items/${this.adminId}/${itemId}/${keyValue}/`)
    .subscribe(obj=>
    {
      if (obj.$value == true)
        obj.$value=false;
      else
        obj.$value=true;
    });
    
   
  } 
  
  // Add Chat References to Both users
  addChats(itemId,interlocutor) {
      // First User
      let adminUnread = this.af.database.object(`/items/${interlocutor}/${itemId}/adminUnread/`);
      adminUnread.set(false);
      let clientUnread = this.af.database.object(`/items/${interlocutor}/${itemId}/clientUnread/`);
      clientUnread.set(false);
      // Second User
     //let endpoint2 = this.af.database.object(`/items/${interlocutor}/${itemId}`);
     // endpoint2.set(true);
  }

  getChatRef(itemId, interlocutor= this.adminId) {
      let firstRef = this.af.database.object(`items/${itemId}/chat`, {preserveSnapshot:true});
      let promise = new Promise((resolve, reject) => {
          firstRef.subscribe(snapshot => {
          		console.log("Snapshot first",snapshot);
               // let a = snapshot.exists();
               /* if(a) {
                	console.log("snapshot  1 exists");
                    //resolve(`items/${itemId}/chat`);
                } else {*/
                    let secondRef = this.af.database.object(`items/${interlocutor}/${itemId}`, {preserveSnapshot:true});
                    secondRef.subscribe(snapshot => {
                    	console.log("Snapshot second",snapshot);
                        let b = snapshot.exists();
                        if(!b) {
                        	console.log("snapshot 2 not exists");
                            this.addChats(itemId,interlocutor);
                        }
                    });
                    resolve(`items/${interlocutor}/${itemId}`);
               // }
            });
      });
      
      return promise;
  }
}

