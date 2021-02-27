import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Social } from '../../providers/providers';
import { Observable } from 'rxjs/Rx';  
import 'rxjs/add/operator/map';

/*
  Generated class for the Facebook page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
 
   public posts: Observable<any[]>;

  constructor(public navCtrl: NavController,
              public social: Social) {                  
  var post;
   this.posts= this.social
      .getPosts('unsplash').map(data => data.map(this.mapPosts));
    
  }
  
  mapPosts = (post) => {
    return {
      from: post.from,
      time: post.created_time * 1000, // convert to milliseconds
      message: post.message,
      photos: this.getPhotos(post)
    };
  }
  
  getPhotos = (post) => {
    if (!post.attachments)
      return [];

    let attachments = post.attachments.data[0].subattachments ||
                      post.attachments;

    return attachments.data
      .filter(x => x.type == "photo")
      .map(x => x.media.image);
  }
}
 