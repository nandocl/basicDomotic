import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

import { SocketioService } from '../../services/socketio.service'

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnDestroy {

  interval: Subscription

  constructor(
    private route: ActivatedRoute,
    private socketioService: SocketioService,
    private router: Router,
  ) { 
    this.route.params.subscribe(() => {
      this.start()
    })
   }

  async start() {
    this.interval = interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    })
  }

  emparejarSend(){
    this.socketioService.emparejarSend()
  }

  changeName(){
    this.router.navigateByUrl('/ch-names', { replaceUrl: true })
  }

  buscar(){
    this.router.navigateByUrl('/listDisp', { replaceUrl: true })
  }

  ngOnDestroy(){
    this.interval.unsubscribe()
  }

}
