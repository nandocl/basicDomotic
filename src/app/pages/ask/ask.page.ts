import { Component, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { interval, Subscription } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { NetworkInterface } from '@ionic-native/network-interface/ngx'
import { LoadingController } from '@ionic/angular'

import { SocketioService } from '../../services/socketio.service'

@Component({
  selector: 'app-ask',
  templateUrl: './ask.page.html',
  styleUrls: ['./ask.page.scss'],
})
export class AskPage implements OnDestroy {

  wifiErr:boolean
  localBtcnCheck:boolean
  connectAk:boolean = false
  wifi:string = "refresh"
  local:string = "refresh"

  //Subscripciones
  getIpSubs: Subscription
  checkLoginSubs: Subscription

  constructor(
    private networkInterface: NetworkInterface,
    private route: ActivatedRoute,
    private router: Router,
    public loadingController: LoadingController,
    private socketioService: SocketioService
  ) { 
    this.route.params.subscribe(() => {
      this.start()
    }) 
   }

  async start(){
    // this.socketioService.disconn()
    this.getIpSubs = interval(200).pipe(startWith(0)).subscribe(() => {
      this.getIp()
    })
  }

  getIp(){
    this.networkInterface.getWiFiIPAddress().then(async (address) => {
      this.wifi = "si"
      if(!this.connectAk){
        let y = address.ip.split(".")
        let ip = "http://" + y[0] + "." + y[1] + "." + y[2] + ".117:3000"
        //let ip = "http://99307f27.ngrok.io"
        this.socketioService.url = ip
        this.connect()
      }

      const localServeB = await this.socketioService.socketEcho()
      if(localServeB == true){
        this.wifiErr = false
        this.connectAk = true
        this.local = "si"
        this.wifi = "si"
      }else{
        this.wifiErr = true
        this.connectAk = false
        this.local = "no"
      }
    })
    .catch(() => {
      this.wifiErr = true
      this.wifi = "no"
      this.local = "no"
    })
    
  }

  connect(){    
    this.socketioService.conn()
    this.connectAk = true
  }

  toLocal(){
    this.router.navigateByUrl('/local-login2', { replaceUrl: true })
  }

  toRemote(){}

  ngOnDestroy(){
    this.getIpSubs.unsubscribe()
  }

}
