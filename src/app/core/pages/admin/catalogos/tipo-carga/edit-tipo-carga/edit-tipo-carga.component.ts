import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {   CargarTipoCarga  } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoCarga } from 'src/app/core/models/tipoCarga.model';
import { TipoCargasService } from 'src/app/core/services/tipoCargas.service';
 
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-tipo-carga',
  templateUrl: './edit-tipo-carga.component.html',
  styleUrls: ['./edit-tipo-carga.component.css']
})
export class EditTipoCargaComponent {
  loading = false
  ADM =environment.ADM  
 
  public imagenSubir!: File
  public imgTemp: any = undefined
  
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoCarga: TipoCarga
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

    private tipoCargasService: TipoCargasService,
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
    this.tipoCargasService.cargarCargaById(id).subscribe((resp: TipoCarga) => {
     
      this.tipoCarga = resp.tipoCarga
      setTimeout(() => {
        this.setForm(this.tipoCarga)
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
  setForm(tipoCarga: TipoCarga) {
 

    this.form = this.fb.group({
      nombre: [tipoCarga.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoCarga.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoCarga.activated],
      dateCreated: [tipoCarga.dateCreated],
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

      this.tipoCarga = {
        ...this.tipoCarga,
        ...this.form.value,


      }

      this.tipoCargasService.actualizarCarga(this.tipoCarga).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Cargas')
        this.functionsService.navigateTo('core/catalogos/tipoCarga')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo de carga')
          this.loading = false
 

        })
    } else {
      this.functionsService.alertForm('Tipo de carga')
      this.loading = false

      return  
    }



 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/tipoCarga')
  }
}

