import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

import { SocketioService } from '../../services/socketio.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-luces',
  templateUrl: './luces.page.html',
  styleUrls: ['./luces.page.scss'],
})
export class LucesPage implements OnDestroy {

  lucesArray: any
  httData: any

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
     //Http Inicio
    this.httpSer.InitLuces().subscribe(data => {
      this.lucesArray = data
    })

    //Obtiene datos de cambio de luces
    this.socketioService.lucesFromServer().subscribe((data: any) => {
      this.lucesArray[data.position].state = data.state
    });

    this.inter = interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    })

  }

  luz(data: any){
    this.lucesArray[data.position].state = !data.state
    let send = {name:data.name, state:this.lucesArray[data.position].state, position:data.position}
    this.socketioService.lucesToServer(send)
  }

 ngOnDestroy(){
   this.inter.unsubscribe()
 }

}
