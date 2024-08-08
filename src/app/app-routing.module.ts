import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreRoutingModule } from './core/core.routing';
import { AuthRoutingModule } from './auth/auth.routing';
import { NopagefoundComponent } from './shared/pages/nopagefound/nopagefound.component';



const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CoreRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
