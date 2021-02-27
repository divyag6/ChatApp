import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { MyApp } from './app.component';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { ListMasterPage } from '../pages/list-master/list-master';
import { ItemCreatePage } from '../pages/item-create/item-create';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { ChatsPage } from '../pages/chats/chats';
import { MenuPage } from '../pages/menu/menu';
import { SettingsPage } from '../pages/settings/settings';
import { SearchPage } from '../pages/search/search';
import { ItemEditPage }  from '../pages/item-edit/item-edit';
//import { User } from '../providers/user';
import {GlobalVars} from '../providers/globalVars';
import {GoogleDrive} from '../providers/google-drive';
import { Api } from '../providers/api';
import { Settings } from '../providers/settings';
import { Items } from '../providers/items';
import { Social } from '../providers/social';
import { ChatsProvider } from '../providers/chats-provider';
import { PictureProvider } from '../providers/picture-provider';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';


// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
 
// AF2 Settings
export const firebaseConfig = {
    apiKey: "AIzaSyArPcsGum6vAF8sgsr5oeA2yDr3k1lhqLE",
    authDomain: "fir-retinker.firebaseapp.com",
    databaseURL: "https://fir-retinker.firebaseio.com",
    projectId: "firebase-retinker",
    storageBucket: "firebase-retinker.appspot.com",
    messagingSenderId: "74069001501"
};

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  MyApp,
  CardsPage,
  ContentPage,
  LoginPage,
  MapPage,
  SignupPage,
  TabsPage,
  TutorialPage,
  WelcomePage,
  ListMasterPage,
  ItemDetailPage,
  ItemCreatePage,
  MenuPage,
  SettingsPage,
  SearchPage,
  ChatViewPage,
  ChatsPage,
  ItemEditPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
  //  User,
  	Social,
    Api,
    Items,
    ChatsProvider,
    PictureProvider,
	GooglePlus,
	GlobalVars,
	GoogleDrive,
    { provide: Settings, useFactory: provideSettings, deps: [ Storage ] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'b8ad9d32'
  },
  'insights': {
    'enabled': false
  },
  'auth': {
    'google': {
     'scope': ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'], // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
    'webClientId': '74069001501-99vsjqv3rfp2tl2bmphsfkqllbk0l3js.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
   },
   'facebook': {
      'scope': []
   }
  }
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
