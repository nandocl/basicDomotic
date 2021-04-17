import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocalLogin2Component } from './local-login2.page';

const routes: Routes = [
  {
    path: '',
    component: LocalLogin2Component
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LocalLogin2Component]
})
export class LocalLogin2PageModule {}
