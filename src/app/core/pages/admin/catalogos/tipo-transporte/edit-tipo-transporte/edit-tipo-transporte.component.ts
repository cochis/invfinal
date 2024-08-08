import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {   CargarTipoTransporte  } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoTransporte } from 'src/app/core/models/tipoTransporte.model';
import { TipoTransportesService } from 'src/app/core/services/tipoTransporte.service';
 
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-tipo-transporte',
  templateUrl: './edit-tipo-transporte.component.html',
  styleUrls: ['./edit-tipo-transporte.component.css']
})
export class EditTipoTransporteComponent {
  loading = false
  ADM =environment.ADM  
 
  public imagenSubir!: File
  public imgTemp: any = undefined
  
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoTransporte: TipoTransporte
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

    private tipoTransportesService: TipoTransportesService,
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
    this.tipoTransportesService.cargarCargaById(id).subscribe((resp: any) => {
     
      this.tipoTransporte = resp.tipoTransporte
      setTimeout(() => {
        this.setForm(this.tipoTransporte)
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
  setForm(tipoTransporte: TipoTransporte) {
 

    this.form = this.fb.group({
      nombre: [tipoTransporte.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoTransporte.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoTransporte.activated],
      dateCreated: [tipoTransporte.dateCreated],
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

      this.tipoTransporte = {
        ...this.tipoTransporte,
        ...this.form.value,


      }

      this.tipoTransportesService.actualizarCarga(this.tipoTransporte).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Transportes')
        this.functionsService.navigateTo('core/catalogos/tipo-transporte')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo de transporte')
          this.loading = false
 

        })
    } else {
      this.functionsService.alertForm('Tipo de transporte')
      this.loading = false

      return  
    }



 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/tipo-transporte')
  }
}

