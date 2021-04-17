import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { OnesignalService } from './services/onesignal.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // osId: string = "7f3a80d5-d12f-421e-be7e-613158503750"
  // fbId: string = "507054509804"

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private oss: OnesignalService,
    private storage: Storage,
    private http: HttpClient
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      
      this.oneSignal.startInit(this.oss.osId, this.oss.fbId);

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();

      this.storage.get('login').then(data => {
        if(!data){
          this.oneSignal.getIds().then(dataId => {
            this.storage.set('pushId', {id: dataId.userId})
            this.deviceStatus(dataId.userId)
          })
        }
      })

    })
  }

  deviceStatus(data: string){
    //http put id to '0'
    let url = 'https://onesignal.com/api/v1/players/' + data
    let body = {"app_id": this.oss.osId, "tags": {"node_id": "0"}}
    let header = {headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization' : 'Basic ' + this.oss.restApiKey
      })
    }
    this.http.put(url, body, header).subscribe(data => {
      //data = "success": true
    })
  }
}
