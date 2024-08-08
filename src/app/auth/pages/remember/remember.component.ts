import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { Usuario } from 'src/app/core/models/usuario.model';

@Component({
  selector: 'app-remember',
  templateUrl: './remember.component.html',
  styleUrls: ['./remember.component.css']
})
export class RememberComponent {
  loading = false
  emailOk: boolean = false

  usuario: Usuario
  form: FormGroup = this.fb.group({
    email: [''],
    password: [''],
  });
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private authService: AuthService,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService
  ) { }

  submit(): void {
    if (!this.emailOk) {

      this.loading = true

      this.form.value.email = this.form.value.email.toLowerCase()

      this.authService.existEmail(this.form.value.email).subscribe((resp: any) => {
      
        this.functionsService.setLocal('token', resp.token)
        resp.usuario.activated = false
        this.usuariosService.isActivedUsuario(resp.usuario).subscribe((act: any) => {
          this.usuario = act.usuarioActualizado
          this.setForm(resp.usuario)
          this.emailOk = true

        })


      },
        (error: any) => {

          setTimeout(() => {
            this.functionsService.alertError(error,'No se encontró su correo electrónico')
            this.loading = false
          }, 1500);
      

        })
    } else {
      this.loading = true
      this.form.value.email = this.form.value.email.toLowerCase()
      let usuario = {
        ...this.usuario,
        ...this.form.value,
      }
 
      this.usuariosService.actualizarPass(usuario).subscribe((resp: any) => {
    
        setTimeout(() => {
          this.loading = false
          this.functionsService.logout()
          this.functionsService.alert('Infra','Se envío correo para la activación de usuario','success')
          this.functionsService.navigateTo('auth/login')
        }, 1500);
      })
    }
    /*   this.router.navigateByUrl('core', { replaceUrl: true }); */
  }

  resetPassword(): void {
    this.router.navigateByUrl('auth/reset-password', { replaceUrl: true });
  }



  setForm(usuario) {
    
    this.form = this.fb.group({
      email: [usuario.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
}
