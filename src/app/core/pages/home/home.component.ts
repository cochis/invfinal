import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private functionsService: FunctionsService
  ) {

    if(this.functionsService.getLocal('resetPass')){
      if (this.functionsService.getLocal('resetPass') == 'true'){
        this.functionsService.navigateTo('auth/new-password')
      }
    }


    this.createForm()
  }
  scannerActive = false
  loading = false
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  public form!: FormGroup
  scan() {
    this.scannerActive = true
    setTimeout(() => {
      this.scannerActive = false
    }, 15000);

  }
  createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  stop() {
    this.scannerActive = false
  }
  showQr(qr: any) {
   



  }



  onSubmit() {
    this.loading = true
    this.submited = true

    
    if (this.form.valid) {
      this.form.value.email = this.form.value.email.toLowerCase()

       
      this.loading = false


      this.usuariosService.cargarUsuarioByEmail(this.form.value.email).subscribe((resp: any) => {
         
        if(resp.usuario.length >0){
          
          let id = resp.usuario[0].uid
          this.functionsService.navigateTo(`/core/create-ticket/${id}`)
        }else {
          this.functionsService.alert('Home','No esta registrado favor de comunicarse con el administrador','error')
        }

        
        this.loading = false
      },
      (error) => {
         
          this.loading = false
          this.functionsService.alertError(error,'Home')

        })
    } else {

      //Message
      this.loading = false
      return  
    }


  }

}
