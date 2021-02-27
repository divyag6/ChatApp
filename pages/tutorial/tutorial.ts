import { Component } from '@angular/core';

import { Events, MenuController, NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { Auth } from '@ionic/cloud-angular';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;

  constructor(public navCtrl: NavController, public menu: MenuController, 
  			  translate: TranslateService, public auth: Auth, public events: Events) {
    translate.get(["TUTORIAL_SLIDE1_TITLE",
                   "TUTORIAL_SLIDE1_DESCRIPTION",
                   "TUTORIAL_SLIDE2_TITLE",
                   "TUTORIAL_SLIDE2_DESCRIPTION",
                   "TUTORIAL_SLIDE3_TITLE",
                   "TUTORIAL_SLIDE3_DESCRIPTION",
    ])
    .subscribe((values) => {
      console.log('Loaded values', values);
      this.slides = [
        {
          title: values.TUTORIAL_SLIDE1_TITLE,
          description: values.TUTORIAL_SLIDE1_DESCRIPTION,
          image: 'assets/img/ica-slidebox-img-1.png',
        },
        {
          title: values.TUTORIAL_SLIDE2_TITLE,
          description: values.TUTORIAL_SLIDE2_DESCRIPTION,
          image: 'assets/img/ica-slidebox-img-2.png',
        },
        {
          title: values.TUTORIAL_SLIDE3_TITLE,
          description: values.TUTORIAL_SLIDE3_DESCRIPTION,
          image: 'assets/img/ica-slidebox-img-3.png',
        }
      ];
    });
  }

  startApp() {
    this.navCtrl.setRoot(LoginPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    if(this.auth.isAuthenticated())
      this.events.publish('user:login');
     else
      this.events.publish('user:logout');
    //this.menu.enable(true);
  }

}
