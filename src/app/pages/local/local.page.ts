import { Component, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Storage } from '@ionic/storage'
import { interval, Subscription } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { SocketioService } from '../../services/socketio.service'
import { OnesignalService } from './../../services/onesignal.service'

@Component({
  selector: 'app-local',
  templateUrl: './local.page.html',
  styleUrls: ['./local.page.scss'],
})

export class LocalPage implements OnDestroy {

  menuList:any

  //Subscripciones
  interSubs: Subscription
  menuGet: Subscription

  //Log
  
  constructor(
    private route: ActivatedRoute,
    private socketioService: SocketioService,
    private router: Router,
    private storage: Storage,
    private http: HttpClient,
    private oss: OnesignalService,
    private oneSignal: OneSignal
  ) { 

    this.route.params.subscribe(() => {
      this.start()
    }) 
   }

  start() {    

    this.interSubs = interval(1000).pipe(startWith(0)).subscribe(() => {
      this.serverConn()
    })

    //Send menu request
    this.socketioService.sMenuInit()

    //Get menu
    this.menuGet = this.socketioService.gMenuInit().subscribe((data) => {
      this.menuList = data
    })
  }
  
  serverConn(){
    let i = this.socketioService.socketEcho()
    if(i == false) {
      this.socketioService.disconn()
      this.router.navigateByUrl('/ask', { replaceUrl: true })
    }
  }

  async logOut(){
    await this.storage.remove('login')
    this.socketioService.disconn()
    this.router.navigateByUrl('/ask', { replaceUrl: true })
    this.logoutOs()
  }

  home(){
    this.socketioService.disconn()
    this.router.navigateByUrl('/ask', { replaceUrl: true }) 
  }

  //Ejemplo de promesa
  // delay(ms: number) {
  //   return new Promise( resolve => setTimeout(resolve, ms) );
  // }

  //Click elementos
  page(item:string){
    this.router.navigateByUrl(`/${item}`, { replaceUrl: true })
  }
  //--Click elementos

  //Logout OneSignal
  logoutOs(){
    this.storage.get('pushId').then(data => {
      let url = 'https://onesignal.com/api/v1/players/' + data.id
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
    })
  }

  ngOnDestroy(){
    this.interSubs.unsubscribe()
    this.menuGet.unsubscribe()
  }

}
