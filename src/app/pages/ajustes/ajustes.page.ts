import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

import { SocketioService } from '../../services/socketio.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage {
  
  ajustesArray:any

  inter: Subscription

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
    //Http Ajustes
    this.httpSer.ajustes().subscribe(data => {
      this.ajustesArray = data
    })

    this.socketioService.ajustesGet().subscribe((data) => {
      this.ajustesArray[data.num].state = data.state
    });

    this.inter = interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    })
  }

  cambiarAjuste(num:number){
    this.socketioService.ajustesSend({name: this.ajustesArray[num].name, state: this.ajustesArray[num].state, num: num})
  }

}
