import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarZona } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Zona } from 'src/app/core/models/zona.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { ZonasService } from 'src/app/core/services/zona.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-zona',
  templateUrl: './edit-zona.component.html',
  styleUrls: ['./edit-zona.component.css']
})
export class EditZonaComponent  {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  zona: Zona
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
 private zonasService: ZonasService,
 private route: ActivatedRoute,
 ) {
    this.id = this.route.snapshot.params['id']
   

    this.edit = this.route.snapshot.params['edit']
    
    this.loading = true

    this.getId(this.id)
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.loading = true
    this.zonasService.cargarZonaById(id).subscribe((resp: CargarZona) => {
      

      this.zona = resp.zona
  

      setTimeout(() => {

        this.setForm(this.zona)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Tipo ticket')


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
  setForm(zona: Zona) {
 

    this.form = this.fb.group({
      nombre: [zona.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [zona.clave, [Validators.required, Validators.minLength(3)]],
      activated: [zona.activated],
      dateCreated: [zona.dateCreated],
      lastEdited: [this.today],
    })
    
 



  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Tipo Ticket')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.zona = {
        ...this.zona,
        ...this.form.value,


      }

      this.zonasService.actualizarZona(this.zona).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Zona')
        this.functionsService.navigateTo('core/catalogos/zona')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Zona')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/zona')
  }

}
