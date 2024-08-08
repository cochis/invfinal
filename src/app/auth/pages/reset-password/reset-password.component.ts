import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { Usuario } from 'src/app/core/models/usuario.model';
import { CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  loading = false
  emailOk: boolean = true
  email = this.functionsService.getLocal('email')
  usuario: Usuario
  vieWPass = false
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
  ) { 
    this.setForm()
  }

  submit(): void {
    
      this.loading = true

    this.usuariosService.cargarUsuarioByEmail(this.email).subscribe((resp:any)=>{
     
   
      this.usuario = resp.usuario[0]
 
    
      this.form.value.email = this.form.value.email.toLowerCase()
      let usuario = {
        ...this.usuario,
        ...this.form.value,
      }
  
      this.usuariosService.actualizarPass(usuario).subscribe((resp: any) => {
         
        this.functionsService.removeItemLocal('resetPass')
        setTimeout(() => {
          this.loading = false
          this.functionsService.navigateTo('auth/login')
        }, 1500);
      })
    })

 
    /*   this.router.navigateByUrl('core', { replaceUrl: true }); */
  }

  resetPassword(): void {
    this.router.navigateByUrl('auth/reset-password', { replaceUrl: true });
  }

  verPass() {
    this.vieWPass = !this.vieWPass;
  }

  setForm() {
    
    this.form = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
}
