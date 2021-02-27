import { Component, ViewChild } from '@angular/core';
import {Events, MenuController, Platform, Nav, Config, AlertController} from 'ionic-angular';

import {Network, StatusBar, Splashscreen } from 'ionic-native';
import {User, Auth } from '@ionic/cloud-angular';
import { Settings } from '../providers/providers';
import { GlobalVars } from '../providers/globalVars';
import { Social } from '../providers/social';
import { FirstRunPage } from '../pages/pages';
import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { ListMasterPage } from '../pages/list-master/list-master';
import { MenuPage } from '../pages/menu/menu';
import { SettingsPage } from '../pages/settings/settings';
import { SearchPage } from '../pages/search/search';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ChatsPage } from '../pages/chats/chats';
import { TranslateService } from 'ng2-translate/ng2-translate';

//import { NativeStorage } from '@ionic-native/native-storage';
@Component({
  template: `
  
  <!-- logged in menu -->
  <ion-menu id="loggedInMenu" [content]="content" enabled="false">
   <ion-header>
   </ion-header>
    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of appPages" (click)="openPage(p)">
          {{p.title}}
        </button>
        <button menuClose ion-item *ngIf="isAdmin" (click)="openPage(chatsPage)">
          {{chatsPage.title}}
        </button>
        <button menuClose ion-item *ngFor="let p of loggedInMenu" (click)="openPage(p)">
          {{p.title}}
        </button>
        <button menuClose ion-item (click)="doLogout()">
          LOGOUT
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>

  <!-- logged out menu -->
  <ion-menu id="loggedOutMenu" [content]="content" enabled="false">
   <ion-header>
   </ion-header>
    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of appPages" (click)="openPage(p)">
          {{p.title}}
        </button>
        <button menuClose ion-item *ngFor="let p of loggedOutMenu" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  
  <ion-nav [root]="rootPage" #content ></ion-nav>`
})
export class MyApp {
	
  
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  private isAdmin :boolean;
  
  chatsPage: any = { title: 'CHAT', component: ChatsPage };
  
  
  appPages: any[] = [
    
    { title: 'HOME', component: LoginPage },
    { title: 'ABOUT', component: TutorialPage },
    // { title: 'SOCIAL', component: CardsPage },
    //{ title: 'Map', component: MapPage },
    //{ title: 'Item Detail', component: ItemDetailPage },
    //{ title: 'Menu', component: MenuPage },
    
  ]
  
  loggedInMenu: any[] = [
  	{ title: 'ITEMS', component: TabsPage },
  	{ title: 'SEARCH', component: SearchPage },
    { title: 'SETTINGS', component: SettingsPage}
  ]
  
   loggedOutMenu: any[] = [
  //   {title: 'REGISTER', component: SignupPage },
  //   { title: 'SIGN IN', component: LoginPage }
  ]	
  
  
  constructor(translate: TranslateService, platform: Platform, 
  			  settings: Settings, config: Config,
  			  globalVars: GlobalVars, public events: Events,
   			  public menuCtrl: MenuController,
   			  public social: Social, public user: User,
   			  public auth: Auth, public Alert: AlertController) {
   
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')
    
    translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  	
  	this.listenToLoginEvents();
  	
	 platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      
     
     let disconnectSub = Network.onDisconnect().subscribe(() => {
 		 console.log('you are offline');
 		 let alert = Alert.create({
            title: "You are not connected to the internet.",
            subTitle: "Please check you Network Settings!",
            buttons: [
            {
              text: "OK",
              handler: () => {
                console.log('Exiting app!');
                platform.exitApp();
              }
            }]
        });
      alert.present();
      
	});

	//disconnectSub.unsubscribe(); 
	
	let connectSub = Network.onConnect().subscribe(()=> {
	  console.log('you are online');
	});
     
   // connectSub.unsubscribe();
    
      if (auth.isAuthenticated()) {
 		console.log("User logged In");
	    events.publish('user:login');
	    //this.social.doSilentLogin(this.user.get('socialProvider','no_user'));
	  }
      else
	  {
			console.log("User not logged In");
		    events.publish('user:logout');
	   }
	    
    });

  }
 
   listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.isAdmin=this.social.isAdmin();
      console.log(this.isAdmin);
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }


  enableMenu(loggedIn: boolean) {
    this.menuCtrl.enable(loggedIn, 'loggedInMenu');
    this.menuCtrl.enable(!loggedIn, 'loggedOutMenu');
   }

  

    // Reset the content nav to have just this page
  openPage(page) {
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
  doLogout()
  {
  	this.social.doLogout(this.user.get('socialProvider','no_user'));
  	this.events.publish('user:logout');
  	this.nav.setRoot(LoginPage);
  }
  
}
