import { Component } from '@angular/core';
import { NavController , Events, ToastController } from 'ionic-angular';
//import { GooglePlus } from '@ionic-native/google-plus';
//import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
//import { Social } from '../../providers/social';
//import { User } from '@ionic/cloud-angular';
//import { MainPage } from '../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController)
  {}
  
  login() {
  	this.navCtrl.push(LoginPage);
  }
  	
  signup() {
   // this.navCtrl.push(SignupPage);
  }
}