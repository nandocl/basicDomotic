import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { SocketioService } from './socketio.service'

@Injectable({
  providedIn: 'root'
})
export class HttpService{

  constructor(
    private socket: SocketioService,
    private storage: Storage,
    private http: HttpClient
  ) { }

  url: string = this.socket.url
  header: any
  public token: string

  private headers = () => {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${this.token}`
      })
    }
  }

  public InitLuces(){
    return this.http.get(this.url + '/initLuces', this.headers())
  }

  public InitClima(){
    return this.http.get(this.url + '/initClima', this.headers())
  }

  public InitPresencia(){
    return this.http.get(this.url + '/initMov', this.headers())
  }

  public listDisp(){
    return this.http.get(this.url + '/listDisp', this.headers())
  }

  public ajustes(){
    return this.http.get(this.url + '/ajustes', this.headers())
  }

}