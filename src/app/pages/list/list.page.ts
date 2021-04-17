import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { interval, Subscription } from 'rxjs'
import { startWith } from 'rxjs/operators'

import { SocketioService } from '../../services/socketio.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy{

  devices:any = []
  i: boolean
  arrayNum:number = 0
  names:any = []

  listarGet: Subscription  

  //Debug
  item:any

  constructor(
    private route: ActivatedRoute,
    private socketioService: SocketioService,
    private http: HttpClient,
    private router: Router,
    private httpSer: HttpService
  ) { 
    this.route.params.subscribe(() => {
      this.start()
    })
   }

   ngOnInit(){
     this.clear()
   }

  async start() {
    interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.socketioService.disconn()
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    })
    await this.getList()
    await this.ini()
  }

  async ini(){
    this.listarGet = this.socketioService.listarGet().subscribe((data) => {
      this.devices[this.arrayNum] = data
      this.devices[this.arrayNum].add = "f"
      this.names.some((dataL) => {
        if(dataL.name == data.name){
          this.devices[this.arrayNum].add = "t"
        }
        return dataL.name == data.name
      })
      this.arrayNum++
    }) 
  }

  async getList(){
    this.httpSer.listDisp().subscribe(data => {
      this.names = data;
    })
  }

  listSend(){   
    this.clear() 
    this.socketioService.listarSend()
  }

  clear(){
    this.arrayNum = 0
    this.devices = []
  }

  addBtn(item: any){
    this.clear()
    this.router.navigate(['/addElement'], { replaceUrl: true, queryParams: item })
  }

  ngOnDestroy(){
    this.clear()
    this.names = []
    this.listarGet.unsubscribe()
  }

}
