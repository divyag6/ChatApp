import { Component } from '@angular/core';
import {Events, NavController, AlertController, ToastController, Platform } from 'ionic-angular';
import { GooglePlus } from 'ionic-native';
import { Auth, User } from '@ionic/cloud-angular';
import { SettingsPage } from '../settings/settings';
//import { NativeStorage } from '@ionic-native/native-storage';

import { TranslateService } from 'ng2-translate/ng2-translate';

import {GlobalVars} from '../../providers/globalVars';
import { MainPage } from '../../pages/pages';
import { Social } from '../../providers/social';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {email: string, password: string} = {
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private loginErrorString: string;

  private socialProvider: string;
   
  constructor(public navCtrl: NavController, public user: User,
              public toastCtrl: ToastController, public social: Social,
              public translateService: TranslateService,
              public auth: Auth, public events: Events, public alertCtrl: AlertController) {
	//this.winObj=window;
   // this.translateService.get('LOGIN_ERROR').subscribe((value) => {
    //  this.loginErrorString = value;
    //})
    //this.user.set('socialProvider','facebook');
    //this.user.save();
     if(auth.isAuthenticated())
   	{
   	    this.setSocialProvider(this.user.get('socialProvider','no_user'));
	   // doSilentLogin(this.socialProvider);
	    console.log("SP "+this.socialProvider);
     }
   
  }
  
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  // Attempt to login in through our User service
 /* doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });
  }*/
  
  setSocialProvider(provider)
  {
  	this.socialProvider=provider;
  }
  
  gotoMainPage()
  {
  	this.navCtrl.push(MainPage);
  }
  
  isAuthenticated()
  {
  	
  	return this.auth.isAuthenticated();
  }

 /* getProfilePicture()
  {
    if(this.socialProvider)
  	 return this.user.social[this.socialProvider].data.profile_picture;
  }
  
  getFullName()
  {
   if(this.socialProvider)  
     return this.user.social[this.socialProvider].data.full_name;
  }*/
  
  doSilentLogin(socialProvider)
  {
  	this.social.doSilentLogin(socialProvider);
  	/*.then((response)=> {
		console.log(response);
		console.log(this.user.social[socialProvider].uid);
		//this.events.publish('user:login');
		this.navCtrl.push(MainPage);
	  }).catch((error)=> {
	  	console.log(error);
	  	//this.events.publish('user:login');
	  	//this.navCtrl.push(MainPage);
	  });*/
  }
  doLogin(socialProvider) {
	
  	 let loading = this.toastCtrl.create({
	    message: 'Please wait...',
	    duration: 3000,
	    position: 'top'
	  });
	  loading.present();
	
    this.social.doLogin(socialProvider).then((response)=> {
	    loading.dismiss();
		console.log(response);
		this.setSocialProvider(socialProvider);
		this.user.set('socialProvider',socialProvider);
		this.user.save();
		console.log(this.user.social[socialProvider].uid);
		this.events.publish('user:login');
		if(this.user.get('phone_no','no_phone_num')=='no_phone_num')
		{
		  console.log(this.user.get('phone_no','no_phone_num'));
		  this.setPhoneNum();
		}
		else
		  this.navCtrl.push(MainPage);
	  }).catch((error)=> {
	  	loading.dismiss();
	  	console.log("error:",error);
	  	//this.events.publish('user:login');
	  	//this.navCtrl.push(MainPage);
	  });
  }
 
  setPhoneNum()
  {
   
  	let alert = this.alertCtrl.create({
    title: 'Enter your Phone No.',
    inputs: [
      {
        name: 'phone_no',
        type: 'tel',
        placeholder: 'e.g. 91954456'
      }
      
    ],
    buttons: [
      {
        text: 'OK',
        handler: data => {
          if (data.phone_no) {
           console.log(data.phone_no);
          	this.user.set('phone_no',data.phone_no);
          	this.user.save();
            this.navCtrl.push(MainPage);
          } else {
            // invalid login
            return false;
          }
        }
      }
    ]
  });
  alert.present();
  }

}	 
