import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {   CargarCarga,   CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Carga } from 'src/app/core/models/carga.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { CargasService } from 'src/app/core/services/cargas.service';
 
 
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-carga',
  templateUrl: './edit-carga.component.html',
  styleUrls: ['./edit-carga.component.css']
})
export class EditCargaComponent{
  loading = false
  ADM =environment.ADM  
 
  public imagenSubir!: File
  public imgTemp: any = undefined
  
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  carga: Carga
  usuarios: Usuario[]
 
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
    private usuariosService: UsuariosService,
    private cargasService: CargasService,
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
    this.cargasService.cargarCargaById(id).subscribe((resp: CargarCarga) => {
     
      this.carga = resp.carga
      setTimeout(() => {
        this.setForm(this.carga)
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
  setForm(carga: Carga) {
 

    this.form = this.fb.group({
      nombre: [carga.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [carga.clave, [Validators.required, Validators.minLength(3)]],
      activated: [carga.activated],
      dateCreated: [carga.dateCreated],
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

      this.carga = {
        ...this.carga,
        ...this.form.value,


      }

      this.cargasService.actualizarCarga(this.carga).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Cargas')
        this.functionsService.navigateTo('core/catalogos/carga')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Cargas')
          this.loading = false
 

        })
    } else {
      this.functionsService.alertForm('Cargas')
      this.loading = false

      return  
    }



 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/carga')
  }
}
