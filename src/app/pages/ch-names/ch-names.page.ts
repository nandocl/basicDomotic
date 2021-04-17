import { Component, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { interval, Subscription, timer, of } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { Storage } from '@ionic/storage'

import { SocketioService } from '../../services/socketio.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-ch-names',
  templateUrl: './ch-names.page.html',
  styleUrls: ['./ch-names.page.scss'],
})
export class ChNamesPage implements OnDestroy {

  nombres:any

  interval: Subscription
  list: Subscription
  listIni: Subscription

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socketioService: SocketioService,
    private router: Router,
    private storage: Storage,
    private httpSer: HttpService
  ) { 
    this.route.params.subscribe(() => {
      this.start()
    })
   }

  start(){

    this.interval = interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.socketioService.disconn()
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    }) 

    this.listIni = timer(200,1000).pipe(take(3)).subscribe(() => {
      this.getList()
    })
  }

  edit(data){
    this.router.navigate(['/editname'], { queryParams: {name: data.name, text: data.text, chip: data.chip} })
  }

  async getList(){
    this.httpSer.listDisp().subscribe(data => {
      this.nombres = data;
    })
  }

  ngOnDestroy(){
    this.interval.unsubscribe()
    this.listIni.unsubscribe()
  }

}
