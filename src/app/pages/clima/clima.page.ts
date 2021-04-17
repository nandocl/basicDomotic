import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

import { SocketioService } from '../../services/socketio.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-clima',
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
})
export class ClimaPage implements OnDestroy {

  climaArray:any
  interval: Subscription

  constructor(
    private route: ActivatedRoute,
    private socketioService: SocketioService,
    private router: Router,
    private httpSer: HttpService
  ) { 
    this.route.params.subscribe(() => {
      this.start()
    })
   }

  start() {
    //Http Init
    this.httpSer.InitClima().subscribe(data => {
      this.climaArray = data
    })

    this.interval = interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.socketioService.disconn()
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    })

    //Obtiene datos de cambio de luces
    this.socketioService.climaFromServer().subscribe((data: any) => {
      this.climaArray[data.position].temp = data.temp
      this.climaArray[data.position].hume = data.hume
    });

  }

  ngOnDestroy(){
    this.interval.unsubscribe()
  }

}
