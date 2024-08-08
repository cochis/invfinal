import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {   CargarTipoSolicitudViaje  } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoSolicitudViaje } from 'src/app/core/models/tipoSolicitudViaje.model';
import { TipoSolicitudViajesService } from 'src/app/core/services/tipoSolicitudViaje.service';
 
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-tipo-solicitud-viaje',
  templateUrl: './edit-tipo-solicitud-viaje.component.html',
  styleUrls: ['./edit-tipo-solicitud-viaje.component.css']
})
export class EditTipoSolicitudViajeComponent  {
  loading = false
  ADM =environment.ADM  
 
  public imagenSubir!: File
  public imgTemp: any = undefined
  
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoSolicitudViaje: TipoSolicitudViaje
  id!: string
  edit: string = 'false'
  estadoInicial!: string
  url = environment.base_url
  addPicture=false
  img='default.jpg'
 uid:string = this.functionsService.getLocal('uid')
 rol:string = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoSolicitudViajesService: TipoSolicitudViajesService,
    private route: ActivatedRoute,
  ) {
    this.createForm()
   
    
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {
    this.loading = true
    this.tipoSolicitudViajesService.cargarCargaById(id).subscribe((resp: any) => {
     
      this.tipoSolicitudViaje = resp.tipoSolicitudViaje
      setTimeout(() => {
        this.setForm(this.tipoSolicitudViaje)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Carga')


      })
  }
  

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(tipoSolicitudViaje: TipoSolicitudViaje) {
 

    this.form = this.fb.group({
      nombre: [tipoSolicitudViaje.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoSolicitudViaje.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoSolicitudViaje.activated],
      dateCreated: [tipoSolicitudViaje.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Roles')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.tipoSolicitudViaje = {
        ...this.tipoSolicitudViaje,
        ...this.form.value,


      }

      this.tipoSolicitudViajesService.actualizarCarga(this.tipoSolicitudViaje).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Transportes')
        this.functionsService.navigateTo('core/catalogos/tipo-solicitud-viaje')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo de solicitud de viaje')
          this.loading = false
 

        })
    } else {
      this.functionsService.alertForm('Tipo de solicitud de viaje')
      this.loading = false

      return  
    }



 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/tipo-solicitud-viaje')
  }
}

