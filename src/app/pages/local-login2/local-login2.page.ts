import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { interval, Subscription } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { Storage } from '@ionic/storage'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ToastController, LoadingController } from '@ionic/angular'

import { User } from '../../clases/user.class'
import { SocketioService } from '../../services/socketio.service'
import { OnesignalService } from './../../services/onesignal.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-local-login2',
  templateUrl: './local-login2.page.html',
  styleUrls: ['./local-login2.page.scss'],
})
export class LocalLogin2Component {

  user:User = new User()
  getIpSubs: Subscription
  i:boolean = true

  //Loading
  loading: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketioService: SocketioService,
    private storage: Storage,
    private http: HttpClient,
    private httpSer: HttpService,
    private oss: OnesignalService,
    public loadingController: LoadingController
  ) { 
    this.route.params.subscribe(async() => {
      this.start()
    })
   }

  start() {
    this.starStatus()
    this.checkLogin()
    this.getIpSubs = interval(500).pipe(startWith(0)).subscribe(() => {
      this.i = this.socketioService.socketEcho()
      if(!this.i){
        this.router.navigateByUrl("/ask", { replaceUrl: true });
      }
    })
  }

  backButton(){
    this.router.navigateByUrl("/ask", { replaceUrl: true });
  }

  async login(){
    if(this.i == true){
      let data = {email: this.user.email, password: this.user.password, token: ""}
      this.sendAuth(data)
    }
  }

  checkLogin(){
    this.storage.get('login').then((val) => {
      if(val){
        this.httpSer.token = val.token
        this.user.email = val.email
        this.user.password = val.password
        let data = {email: val.email, password: val.password, token: val.token}
        this.sendAuth(data)
      }else {
        this.user.password = ""
        this.user.email = ""
      }
    })
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

  async sendAuth(val: any){
    this.loading = await this.loadingController.create({
      message: 'Espere...',
      duration: 7000
    })
    this.loading.present()
    this.socketioService.auth({email: val.email, password: val.password, token: val.token})
  }

  starStatus(){
    this.socketioService.errorConn().subscribe(() => {
      this.loading.dismiss()
      this.router.navigate(['/ask'], { replaceUrl: true });
    });

    this.socketioService.startConn().subscribe((data:any) => {
      if(data != "Bien"){
        this.oneSignalLogin(data.nodeId)
        this.httpSer.token = data.token
        this.storage.set("login", {email: this.user.email, password: "******", token: data.token})
      }
      this.loading.dismiss()
      this.router.navigate(['/local'], { replaceUrl: true });
    });
  }

}
