import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarPuesto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Puesto } from 'src/app/core/models/puesto.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { PuestosService } from 'src/app/core/services/puesto.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-puesto',
  templateUrl: './edit-puesto.component.html',
  styleUrls: ['./edit-puesto.component.css']
})
export class EditPuestoComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  puesto: Puesto
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
 private puestosService: PuestosService,
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
    this.puestosService.cargarPuestoById(id).subscribe((resp: CargarPuesto) => {
      

      this.puesto = resp.puesto
  

      setTimeout(() => {

        this.setForm(this.puesto)
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
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(puesto: Puesto) {
 

    this.form = this.fb.group({
      nombre: [puesto.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [puesto.clave, [Validators.required, Validators.minLength(3)]],
      descripcion: [puesto.descripcion, [Validators.required, Validators.minLength(3)]],
      activated: [puesto.activated],
      dateCreated: [puesto.dateCreated],
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

      this.puesto = {
        ...this.puesto,
        ...this.form.value,


      }

      this.puestosService.actualizarPuesto(this.puesto).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Puesto')
        this.functionsService.navigateTo('core/catalogos/puestos')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Puesto')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/puesto')
  }

}
