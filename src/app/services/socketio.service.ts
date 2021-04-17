import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket:any;
  public connected:boolean = false
  public connectedAuth:boolean = false

  private keepAliveV: boolean = false

  constructor() {}

  public async auth(data) {
    if(!this.connectedAuth){
      this.socket.emit('authentication', data)
      this.connectedAuth = true
    }
  }

  public errorConn = () => {
    return Observable.create((observer) => {
        this.socket.on('unauthorized', () => {
          observer.next();
          this.keepAliveV = false
        });
    });
  }

  public startConn = () => {
    return Observable.create((observer) => {
      this.socket.on('authenticated', (message) => {
        observer.next(message);
        this.keepAliveV = true
      });
    });
  }

  public gMenuInit = () => {
    return Observable.create((observer) => {
        this.socket.on('menuInitC', (message) => {
            observer.next(message);
        });
    });
  }

  public sMenuInit() {
    this.socket.emit('menuInitS', true);
  }

  public url: string = ""

  public conn(){
    if(!this.connected){
      this.socket = io(this.url, 
        {
          'reconnection': true,
          'reconnectionDelay': 1000,
          'reconnectionDelayMax': 7000,
          'reconnectionAttempts': 'Infinity'
        }
      )
      this.connected = true
    }
  }

  public async disconn(){
    this.socket.disconnect()
    this.connected = false
    this.connectedAuth = false
    this.keepAliveV = false
  }

  public socketEcho(){
    return this.socket.connected
  }

  ///////////////////////////////////////---Luces

  public lucesFromServer = () => {
    return Observable.create((observer) => {
        this.socket.on('lucesC', (data) => {
            observer.next(data);
        });
    });
  }

  public async lucesToServer(data:any) {    
    this.socket.emit('lucesS', data)
  }

  ///////////////////////////////////////---Movimiento
  public movFromServer = () => {
    return Observable.create((observer) => {
        this.socket.on('movC', (data) => {
            observer.next(data);
        });
    });
  }

  public async movToServer(data:any) {    
    this.socket.emit('movS', data)
  }

  ///////////////////////////////////////---/Movimiento
  //////////////////////////////////////----Clima

  public climaFromServer = () => {
    return Observable.create((observer) => {
        this.socket.on('climaC', (data) => {
            observer.next(data);
        });
    });
  }
  //////////////////////////////////////----\Clima
  //////////////////////////////////////----Device
  public async listarSend() {
    this.socket.emit('listarS', {id: this.socket.id})
  }

  public listarGet = () => {
    return Observable.create((observer) => {
        this.socket.on('listarC', (data) => {
            observer.next(data);
        });
    });
  }

  public emparejarSend(){
    this.socket.emit('emparejarS')
  }
  
  //////////////////////////////////////----\Device
  //////////////////////////////////////----Ajustes

  public ajustesSend(data){
    this.socket.emit('ajustesSendS', {name: data.name, state: data.state, num: data.num})
  }

  public ajustesGet = () => {
    return Observable.create((observer) => {
        this.socket.on('ajustesGetC', (data) => {
            observer.next(data);
        });
    });
  }
  //////////////////////////////////////----\Ajustes
  //////////////////////////////////////----Edit nombres

  public editname = (data) => {
    this.socket.emit('editname', data)
  }

  public deletename = (data) => {
    this.socket.emit('deletename', data)
  }

  public addElement = (data) => {
    this.socket.emit('addElement', data)
  }

  //////////////////////////////////////----\Edit nombres

  //////////////////////////////////////-----keep alive
  private ping = interval(1000).subscribe(async() => {
    const c = await this.socketEcho()
    if(c == true && this.keepAliveV == true){
      this.socket.emit('ping')
    }
  })
  //////////////////////////////////////----\keep alive

}
