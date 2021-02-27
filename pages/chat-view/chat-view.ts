import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ChatsProvider } from '../../providers/chats-provider';
import { PictureProvider } from '../../providers/picture-provider';
import { Social } from '../../providers/social';
//import { UserProvider } from '../../providers/user-provider/user-provider';
import { Camera } from 'ionic-native';
import * as moment from 'moment';

@Component({
  templateUrl: 'chat-view.html',
})
export class ChatViewPage {
	
  item: any;	
  message: string;
  itemId: string;
  admin: string;
  uid: string;
  picture: any;
  myDate: String = moment(new Date().toISOString()).locale('en').format('LL');
  myTime: String = moment(new Date().toISOString()).locale('en').format('LT'); 
  chats: FirebaseListObservable<any>;  
  
  @ViewChild(Content) content: Content;
  @ViewChild('fileInput') fileInput;
  
  constructor(public nav:NavController, navParams:NavParams, 
  public chatsProvider:ChatsProvider, public af:AngularFire,
  public actionSheetCtrl: ActionSheetController, public picProvider: PictureProvider ,
  public social:Social
 // public user:User
 ) {
    this.item = navParams.get('item');
    this.itemId = this.item.$key;
    this.uid= this.social.getUID();
    this.admin = chatsProvider.getAdminId();
    // Get Chat Reference
    chatsProvider.getChatRef(this.itemId)
    .then((chatRef:any) => {  
    	console.log("chat ref",chatRef);
        this.chats = this.af.database.list(chatRef);
    });
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  /* Send Message to the admin*/ 
 
  sendMessage() {
  
  console.log(this.myTime);
      if(this.message) {
          let chat = {
              from: this.uid,
              message: this.message,
              type: 'message'
          };
          this.chats.push(chat);
          this.message = "";
      }
      else
      {
        this.sendPicture();
      }
      if(this.uid===this.admin)
        this.chatsProvider.setObject('clientUnread',this.itemId);
     else
       this.chatsProvider.setObject('adminUnread',this.itemId); 
  };
  
  /* Open Action Sheet to take picture or choose picture from the gallery to send*/
  
  openActionSheet()
  {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Send a picture',
      buttons: [
        {
          text: 'Open Gallery',
          handler: () => {
            console.log('Open gallery clicked');
            this.fileInput.nativeElement.click();
          }
        },{
          text: 'Take Picture',
          handler: () => {
            console.log('Take Picture clicked');
            this.takePicture();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  
  processWebImage(event)
  {
    let input = this.fileInput.nativeElement;

    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      input.parentNode.removeChild(input);
      this.picture = (readerEvent.target as any).result;
      //console.log(imageData);
    };

    reader.readAsDataURL(event.target.files[0]);
  }
  
  /* Take picture to send*/

  takePicture() {
   
    if (Camera['installed']()) {
      Camera.getPicture({
      	destinationType: Camera.DestinationType.DATA_URL,
      	allowEdit: true,
		correctOrientation: true,
		encodingType: Camera.EncodingType.JPEG,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        console.log("Picture Successfully taken");
        this.picture = 'data:image/jpg;base64,' +  data ;
        console.log(this.picture);
      }, (err) => {
        console.log("Unable to take photo");
        alert('Unable to take photo');
      })
    } else {
      console.log("Camera not installed");
    }
  }
  
  
  /*Send picture message*/
  
  sendPicture() {
  	let chat = {
              from: this.uid,
              picture: this.picture,
              type: 'picture',
              unread: true
          };
          this.chats.push(chat);
          this.picture = "";
     
  }
}
