import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {  User } from '@ionic/cloud-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { TranslateService } from 'ng2-translate/ng2-translate';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  options: any;

   private socialProvider: string;
  
  isReadyToSave: boolean;

  form: FormGroup;

  phone_no: any;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
              public settings: Settings,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              public user: User) {
              
              this.socialProvider=this.user.get('socialProvider','no_user');
              this.phone_no=this.user.get('phone_no','Enter Phone Num');
              let address=this.user.get('address','Enter Address');
              this.form = formBuilder.group({
      		   //name: [this.user.social[this.socialProvider].data.full_name],
               //email: [this.user.social[this.socialProvider].data.email],
               phone_no: [this.phone_no,Validators.required],
               address:[address] 
             });
             if(this.form.valid)
               this.isReadyToSave = this.form.valid;
		    // Watch the form for changes, and
		    this.form.valueChanges.subscribe((v) => {
		      this.isReadyToSave = this.form.valid;
		    });
  }


  ionViewDidLoad() {
    // Build an empty form for the template to render
   // this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    /*this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });*/
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
  
  done() {
    console.log("Saving address and phone num:",this.form.value['phone_no']);
    this.user.set('phone_no',this.form.value['phone_no']);
    this.user.set('address', this.form.value['address']);
    this.user.save();
  }
}
