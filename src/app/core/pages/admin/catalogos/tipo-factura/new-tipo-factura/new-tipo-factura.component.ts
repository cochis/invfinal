import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 
import { Usuario } from 'src/app/core/models/usuario.model';

 
import { TipoFacturaService } from 'src/app/core/services/tipoFactura.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-tipo-factura',
  templateUrl: './new-tipo-factura.component.html',
  styleUrls: ['./new-tipo-factura.component.css']
})
export class NewTipoFacturaComponent {
  loading = false
  
  usuarios: Usuario[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  ADM = environment.ADM
  CTB = environment.CTB
  CTM = environment.CTM
  PGP = environment.PGP

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private tipoFacturaService: TipoFacturaService,
  ) {
    this.loading = true
    
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }




  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      

      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      let tipoFactura = {
        nombre: this.form.value.nombre,
        clave: this.form.value.clave,
      
        usuarioCreated: this.functionsService.getLocal('uid')
      }

      this.tipoFacturaService.crearTipoFactura(tipoFactura).subscribe((resp: any) => {
        this.functionsService.alert('Tipo Factura', 'Tipo de factura creada', 'success')
        this.functionsService.navigateTo('core/catalogos/tipo-factura')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo Factura')

          this.loading = false
          this.functionsService.alertError(error, 'Tipo Factura')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Tipo Factura')
      return
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/tipo-factura')
  }

 
}

