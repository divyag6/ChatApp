import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { ItemCreatePage } from '../item-create/item-create';

import { Items } from '../../providers/providers';
import { Item } from '../../models/item';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: any;

  constructor(public navCtrl: NavController, public items: Items, 
  			  public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.getItems();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create(ItemCreatePage);
    addModal.onDidDismiss(item => {
      if (item) {
        console.log(item);
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }
  
  getItems(){
	let loading = this.toastCtrl.create({
	    message: 'Please wait...',
	    position: 'top'
	  });
	  loading.present();
	
	this.items.query().subscribe((items) => {
	    this.currentItems = items;
	    loading.dismiss();
	    console.log('Fetched items from firebase',this.currentItems);
	 }, (err) => {
		console.log('Cannot fetch items from firebase');
	 });
   }
}
