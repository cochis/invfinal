import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false
  vieWPass = false
  latitude: number = 0
  longitude: number = 0
  loginForm: FormGroup = this.fb.group({
    email: [''],
    password: [''],
  });
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private authService: AuthService,
    private functionsService: FunctionsService
  ) { this.getLocation()}
  getLocation() {
    this.functionsService.getPosition().then(pos => {
      this.latitude = pos.lat;
      this.longitude = pos.lng;
  
    });
  }
  submit(): void {

    this.loading = true

   
    this.loginForm.value.email = this.loginForm.value.email.toLowerCase()
    if (this.loginForm.value.password == '123456') {
      this.functionsService.setLocal('resetPass', true)
    }
    this.authService.login(this.loginForm.value).subscribe((resp: any) => {
     
      setTimeout(() => {
        this.functionsService.navigateTo('core')
        this.loading = false
      }, 2000);
    },
      (error: any) => {

        if (error.error.msg === 'Usuario desactivado') {
          this.loading = false
          this.functionsService.alertError(error, 'Login')
          return
        } else {

          this.loading = false
          this.functionsService.alertError(error, 'Login')

          return
        }



      })
    /*   this.router.navigateByUrl('core', { replaceUrl: true }); */
  } 

 

  resetPassword(): void {
    this.router.navigateByUrl('auth/reset-password', { replaceUrl: true });
  }
  register(): void {
    this.router.navigateByUrl('auth/register', { replaceUrl: true });
  }
  verPass() {
    this.vieWPass = !this.vieWPass;
  }
}
