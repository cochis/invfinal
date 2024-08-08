import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TipoSolicitudViaje } from 'src/app/core/models/tipoSolicitudViaje.model';
 
import { TipoSolicitudViajesService } from 'src/app/core/services/tipoSolicitudViaje.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-new-tipo-solicitud-viaje',
  templateUrl: './new-tipo-solicitud-viaje.component.html',
  styleUrls: ['./new-tipo-solicitud-viaje.component.css']
})
export class NewTipoSolicitudViajeComponent {
  loading = false
  tipoSolicitudViajes: TipoSolicitudViaje[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoSolicitudViajesService: TipoSolicitudViajesService,
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
      this.tipoSolicitudViajesService.crearTipoSolicitudViaje(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Tipo de  Solicitud Viajes', 'Tipo de solicitud de viaje creado', 'success')
        this.functionsService.navigateTo('core/catalogos/tipo-solicitud-viaje')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo Tipo de  Solicitud Viajes')

          this.loading = false
          this.functionsService.alertError(error,'Tipo Tipo de  Solicitud Viajes')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Tipo Tipo de  Solicitud Viajes')
      return 
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/tipo-solicitud-viaje')
  }

}

