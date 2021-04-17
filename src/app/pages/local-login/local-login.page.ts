import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs'     ///Tiempo de espera del servidor agregar
import { startWith } from 'rxjs/operators'
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { Storage } from '@ionic/storage'
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { User } from '../../clases/user.class'
import { OnesignalService } from './../../services/onesignal.service'
import { SocketioService } from '../../services/socketio.service'

@Component({
  selector: 'app-local-login',
  templateUrl: './local-login.page.html',
  styleUrls: ['./local-login.page.scss'],
})
export class LocalLoginPage implements OnDestroy {

  //ip:string = ""
  wifiErr:boolean = false

  i:boolean = true
  enterDis:boolean = false

  connectAk:boolean = false

  user:User = new User()

  loading:any
  loaddingB:boolean = true

  //subscripciones
  getIpSubs: Subscription

  osId: string = "7f3a80d5-d12f-421e-be7e-613158503750"
  fbId: string = "507054509804"

  //Test vars
  t1:string

  constructor(
    private networkInterface: NetworkInterface,
    private route: ActivatedRoute,
    private router: Router,
    private socketioService: SocketioService,
    private storage: Storage,
    private toast: ToastController,
    public loadingController: LoadingController,
    private oss: OnesignalService,
    private http: HttpClient
  ) { 
    this.route.params.subscribe(async() => {
      // this.start()
      this.checkLogin()
    })

   }
  async start() {
    this.getIpSubs = interval(500).pipe(startWith(0)).subscribe(() => {
      this.getIp()
      this.i = this.socketioService.socketEcho()
    })

    // timer(200).subscribe(() => {
    //   this.checkLogin()
    // })

    this.checkLogin()
    this.starStatus()
  }

  async toastEmpty() {
    const toast = await this.toast.create({
      message: 'Use todos los campos.',
      duration: 2000
    });
    toast.present();
  }

  async toastBad() {
    const toast = await this.toast.create({
      message: 'Error de loggin.',
      duration: 2000
    });
    toast.present();
  }

  async toastGood() {
    const toast = await this.toast.create({
      message: 'Logeado',
      duration: 2000
    });
    toast.present();
  }

  async toastDie() {
    const toast = await this.toast.create({
      message: 'No hay conexión con el servidor local',
      duration: 2000
    });
    toast.present();
  }

  async toastNoWifi() {
    const toast = await this.toast.create({
      message: 'No hay conexión a red Wifi',
      duration: 2000
    });
    toast.present();
  }

  getIp(){
    this.networkInterface.getWiFiIPAddress()
    .then((address) => {
      let y = address.ip.split(".")
      let ip = "http://" + y[0] + "." + y[1] + "." + y[2] + ".117:3000"
      //let ip = "http://99307f27.ngrok.io"
      this.socketioService.url = ip
      this.wifiErr = false
      if(!this.i){
        this.connect()
      }
      //this.i = this.socketioService.socketEcho()
    })
    .catch(() => {
      //this.ip = ""
      this.wifiErr = true
      this.router.navigateByUrl("/ask", { replaceUrl: true })
      this.toastNoWifi()
    })
  }

  starStatus(){

    this.socketioService.errorConn().subscribe(() => {
      this.socketioService.disconn()
      this.loading.dismiss()
      this.toastBad()
      this.backButton()

    });

    this.socketioService.startConn().subscribe((data:any) => {
      this.loading.dismiss()
      //this.connect()
      if(data != "Bien"){
        this.storage.set("login", {email: this.user.email, password: "00000", token: data.token})
        this.oneSignalLogin(data.nodeId)
      }
      this.toastGood()
      this.toLocal()
    });

  }

  async connect(){
    this.socketioService.conn()
    // this.socketioService.conn()
    this.connectAk = true
  }

  toLocal(){    
    this.router.navigate(['/local'], { replaceUrl: true });
    //this.router.navigate(['/local'], { queryParams: {url: this.ip, erro: this.wifiErr }});
  }

  async login(){
    this.t1 = "en login"
    if(this.i == true){
      this.t1 = "Enviando"
      this.auth({email: this.user.email, password: this.user.password, token: ""})
    }else{
      this.t1 = "error i enviando"
      this.toastDie()
    }
    //getStatus
  }

  async loginToken(val:any){
    this.i = await this.socketioService.socketEcho()
    if(this.i == true){
      this.auth({email: val.email, password: val.password, token: val.token})
    }else{
      this.toastDie()
    }
  }

  checkLogin(){
    this.storage.get('login').then((val) => {
      this.user.email = val.email
      if(val.password.length != 0){
        this.user.password = val.password
        this.loginToken(val)
      }else {
        this.user.password = ""
        this.user.email = ""
      }
    })
  }

  async auth(user:any){
    this.t1 = "en auth"
    // if(user.email.length != 0 && user.password.length != 0){
    if(user.email != "" && user.password != ""){

      if(this.loaddingB == true && this.i == true){
        this.loading = await this.loadingController.create({
          message: 'Espere...',
          duration: 10000
        })
        this.loading.present()
        this.loaddingB = false
      }

      // this.connect()
      this.socketioService.auth({email: user.email, password: user.password, token: user.token})
      this.t1 = "enviando auth a socket"
    }
    if( user.email.length == 0 || user.password.length == 0 ){
      this.toastEmpty()
    }
  }

  oneSignalLogin(dataNodeId: string){
    this.storage.get('pushId').then(data => {
      let url = 'https://onesignal.com/api/v1/players/' + data.id
      let body = {"app_id": this.oss.osId, "tags": {"node_id": dataNodeId}}
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

  backButton(){
    this.router.navigateByUrl("/ask", { replaceUrl: true });
  }

  ngOnDestroy(){
    this.getIpSubs.unsubscribe()
  }

}
