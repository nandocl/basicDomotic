import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { SocketioService } from '../../services/socketio.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-presencia',
  templateUrl: './presencia.page.html',
  styleUrls: ['./presencia.page.scss'],
})
export class PresenciaPage implements OnDestroy{

  movArray:any

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

  inter: Subscription

  start() {

    //Http Init
    this.httpSer.InitPresencia().subscribe(data => {
      this.movArray = data;
    })

    //Obtiene datos de cambio de sensores de movimiento
    this.socketioService.movFromServer().subscribe((data: any) => {
      this.movArray[data.position].state = data.state
    });

    this.inter = interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    })

  }

  mov(data:any){
    this.movArray[data.position].state = !data.state
    let send = {name:data.name, state:this.movArray[data.position].state, position:data.position}
    this.socketioService.movToServer(send)
  }

  ngOnDestroy(){
    this.inter.unsubscribe()
  }

}
