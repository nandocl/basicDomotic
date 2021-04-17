import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }

  private dataM = {}

  public saveData(nameVar:string, data:any){
    this.dataM[nameVar] = data
  }

  public getData(nameVar:string){
    return this.dataM[nameVar]
  }
}
