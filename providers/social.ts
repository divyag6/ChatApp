import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular';
import { ChatsProvider } from './chats-provider';
import { GoogleAuth, FacebookAuth, User } from '@ionic/cloud-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';  
import { GooglePlus } from '@ionic-native/google-plus';
import { Observable } from 'rxjs/Rx';  
import 'rxjs/add/operator/map';

@Injectable()
export class Social {
 
  private accessToken = '957488564354656|YfdItBz14Fl51fqqV6yVvoKKsGY';

  private graphUrl = 'https://graph.facebook.com/';
  private graphQuery = "/posts?fields=attachments,from,message,created_time&access_token="+this.accessToken+"&date_format=U";
 
  constructor(public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public googleAuth: GoogleAuth, public facebookAuth: FacebookAuth,
              private http: Http, public googlePlus: GooglePlus, public chatsProvider: ChatsProvider) {
	
  }

   doLogin(social){
	  if(social=='google')
	   return this.googleAuth.login();
	  else
	   return this.facebookAuth.login();
	}
	
	doSilentLogin(social){
	  if(social=='google')
	  {
	   this.googlePlus.trySilentLogin(
	    {
	      'scopes': 'https://www.googleapis.com/auth/userinfo.profile, https://www.googleapis.com/auth/userinfo.email', 
	      'webClientId': '74069001501-99vsjqv3rfp2tl2bmphsfkqllbk0l3js.apps.googleusercontent.com',
	    }).then((response)=>{
	    	console.log(response);
	    }).catch((error)=>{
	    	console.log('error' + error);
	    });

	 }
	 /* else
	   return this.facebookAuth.login();	*/
	}
	
	doLogout(social){
  		console.log("Logging out of "+social);
  		 if(social=='google')
  		 {
  		  this.googleAuth.logout().then((response)=>{
	    	console.log(response);
	    }).catch((error)=>{
	    	console.log('error:' + error);
	    });
	    }
  		 else
	      this.facebookAuth.logout();
	      
  	}
  	
  	getUID()
  	{
  		let socialProvider = this.user.get('socialProvider','no_user');
		return this.user.social[socialProvider].uid;
  	}
  	
  	isAdmin()
  	{
  	  if(this.chatsProvider.getAdminId()==this.getUID())
  	    return true;
  	  else
  	    return false;  
  	
  	}

	getPosts(pageName: string): Observable<any>  {
    let url = this.graphUrl + pageName + this.graphQuery;
    
    return this.http
        .get(url).map(response => {return response.json().data});
     
   }
}