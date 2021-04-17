import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode/ngx'
import { HttpClientModule } from '@angular/common/http'
import { OneSignal } from '@ionic-native/onesignal/ngx';

import { SocketioService } from './services/socketio.service'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SocketioService,
    NetworkInterface,
    BackgroundMode,
    OneSignal,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
