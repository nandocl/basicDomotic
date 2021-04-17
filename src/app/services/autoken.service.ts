import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'

@Injectable({
  providedIn: 'root'
})
export class AutokenService {

  constructor(
    private storage: Storage
  ) { }

  public getToken(){
    this.storage.get('login').then((val:any) => {
      return val.token
    })
  }
}
