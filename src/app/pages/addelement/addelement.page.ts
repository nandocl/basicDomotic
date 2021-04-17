import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ToastController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { startWith } from 'rxjs/operators';
import { interval } from 'rxjs';

import { SocketioService } from '../../services/socketio.service'

@Component({
  selector: 'app-addelement',
  templateUrl: './addelement.page.html',
  styleUrls: ['./addelement.page.scss'],
})
export class AddelementPage{

  nameAdd:String
  chipAdd:String
  chippAdd:String = ""
  textAdd:String = ""
  listActuAdd:any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketioService: SocketioService,
    private http: HttpClient,
    private toast: ToastController,
    private storage: Storage
  ) { 
    this.route.params.subscribe(() => {
      this.start()
    })
   }

  start() {

    interval(1000).pipe(startWith(0)).subscribe(() => {
      let i = this.socketioService.socketEcho()
      if(i == false) {
        this.socketioService.disconn()
        this.router.navigateByUrl('/ask', { replaceUrl: true })
      }
    })

    this.route.queryParams.subscribe( (data) => {
      this.nameAdd = data.name
      this.chipAdd = data.chip
      if(this.nameAdd.startsWith('b')){
        let url = this.socketioService.url
        this.storage.get('login').then((val) => {
          this.http.get(url + "/listAct",
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${val.token}`
            })
          }
          ).subscribe(data => {
          this.listActuAdd = data
          });
        })
      }
    })
  }

  agregar(){
    if(this.textAdd.length != 0){
      let data = {name: this.nameAdd, text: this.textAdd}
      if(this.nameAdd.startsWith('b')){
        if(this.chippAdd.length != 0){
          data["chip"] = this.chippAdd
          this.agregarSend(data)
        }else{
          //Toast seleccione chip
          this.toastNoChip()
        }
      }else{
        data["chip"] = this.chipAdd
        this.agregarSend(data)
      }
    }else{
      //Toast de no text
      this.toastNoText()
    }
  }

  async agregarSend(data:any){
    this.socketioService.addElement(data)
    this.router.navigate(['/ch-names'], { replaceUrl: true })
  }
  async

  async toastNoText() {
    const toast = await this.toast.create({
      message: 'Agrege descripción',
      duration: 2000
    });
    toast.present();
  }

  async toastNoChip() {
    const toast = await this.toast.create({
      message: 'Seleccione actuador',
      duration: 2000
    });
    toast.present();
  }

}
