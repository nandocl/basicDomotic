import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'ask', pathMatch: 'full' },
  { path: 'ask', loadChildren: './pages/ask/ask.module#AskPageModule' },
  { path: 'local', loadChildren: './pages/local/local.module#LocalPageModule' },
  { path: 'luces', loadChildren: './pages/luces/luces.module#LucesPageModule' },
  { path: 'local-login', loadChildren: './pages/local-login/local-login.module#LocalLoginPageModule' },
  { path: 'local-login2', loadChildren: './pages/local-login2/local-login2.module#LocalLogin2PageModule' },
  { path: 'clima', loadChildren: './pages/clima/clima.module#ClimaPageModule' },
  { path: 'devices', loadChildren: './pages/devices/devices.module#DevicesPageModule' },
  { path: 'presencia', loadChildren: './pages/presencia/presencia.module#PresenciaPageModule' },
  { path: 'cocina', loadChildren: './pages/cocina/cocina.module#CocinaPageModule' },
  { path: 'ajustes', loadChildren: './pages/ajustes/ajustes.module#AjustesPageModule' },
  { path: 'ch-names', loadChildren: './pages/ch-names/ch-names.module#ChNamesPageModule' },
  { path: 'editname', loadChildren: './pages/editname/editname.module#EditnamePageModule'},
  { path: 'listDisp', loadChildren: './pages/list/list.module#ListPageModule'},
  { path: 'addElement', loadChildren: './pages/addelement/addelement.module#AddelementPageModule'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
