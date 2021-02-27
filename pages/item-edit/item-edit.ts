import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Social } from '../../providers/social';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Items } from '../../providers/providers';
import { MainPage } from '../../pages/pages';

import { Camera } from 'ionic-native';

/*
  Generated class for the ItemEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-item-edit',
  templateUrl: 'item-edit.html'
})
export class ItemEditPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  categories:string[];

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,
  			  formBuilder: FormBuilder, public social: Social, public translate: TranslateService,
  			  public items: Items) {
  			  
   this.item = navParams.get('item');
    this.form = formBuilder.group({
      profilePic: [this.item.profilePic,Validators.required],
      category:[Validators.required],
      name: [Validators.required],
      condition:[Validators.required],
      adminMsg:[],
      description: [Validators.required],
      //uid: [this.item.uid]
    });

     this.isReadyToSave = this.form.valid;
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
      this.translate.get('ITEM_CATEGORY_OPTIONS').subscribe((res: string[]) => {
        this.categories = res
      });
  }
  
  getPicture() {
    if (Camera['installed']()) {
      Camera.getPicture({
      	destinationType: Camera.DestinationType.DATA_URL,
      	allowEdit: true,
		correctOrientation: true,
		encodingType: Camera.EncodingType.JPEG,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' +  data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let input = this.fileInput.nativeElement;

    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      input.parentNode.removeChild(input);

      var imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if(!this.form.valid) { return; }
    
    this.viewCtrl.dismiss(this.item);
  }
  
   /**
   * Delete an item from the list of items.
   */
  delete(item) {
  	this.items.delete(item.$key);
    this.viewCtrl.dismiss();
    this.navCtrl.push(MainPage);
  }
  
}
