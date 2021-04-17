import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { startWith } from 'rxjs/operators';
import { interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Storage } from '@ionic/storage'
import { SocketioService } from '../../services/socketio.service'

@Component({
  selector: 'app-editname',
  templateUrl: './editname.page.html',
  styleUrls: ['./editname.page.scss'],
})
export class EditnamePage{

  name: String
  text: String
  chip: String
  chipp: String
  listActu: any =  [] 

  selected: String

  constructor(
    private route: ActivatedRoute,
    private socketioService: SocketioService,
    private router: Router,
    private http: HttpClient,
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

    this.route.queryParams.subscribe( async (data) => {
      this.name = data.name
      this.text = data.text
      this.chipp = data.chip
      if(data.chip && this.name.startsWith('b')){
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
            this.listActu = data
            this.listActu.some(element => {
              if(element.chip == this.chipp){
                this.selected = element.text
              }
            });
          });
        })
      }
    })
  }

  guardar(){
    this.socketioService.editname({name:this.name, text:this.text, chip:this.chipp})
    this.router.navigate(['/ch-names'], { replaceUrl: true })
  }

  async borrar(){
    this.socketioService.deletename({name:this.name})
    this.router.navigate(['/ch-names'], { replaceUrl: true })
  }
}
