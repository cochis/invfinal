import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarIncoterm } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Incoterm } from 'src/app/core/models/incoterm.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { IncotermsService } from 'src/app/core/services/incoterm.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-incoterm',
  templateUrl: './edit-incoterm.component.html',
  styleUrls: ['./edit-incoterm.component.css']
})
export class EditIncotermComponent{
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  incoterm: Incoterm
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
 private incotermsService: IncotermsService,
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
    this.incotermsService.cargarIncotermById(id).subscribe((resp: CargarIncoterm) => {
      

      this.incoterm = resp.incoterm
  

      setTimeout(() => {

        this.setForm(this.incoterm)
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
  setForm(incoterm: Incoterm) {
 

    this.form = this.fb.group({
      nombre: [incoterm.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [incoterm.clave, [Validators.required, Validators.minLength(3)]],
      descripcion: [incoterm.clave, [Validators.required, Validators.minLength(3)]],
      activated: [incoterm.activated],
      dateCreated: [incoterm.dateCreated],
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

      this.incoterm = {
        ...this.incoterm,
        ...this.form.value,


      }

      this.incotermsService.actualizarIncoterm(this.incoterm).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Incoterm')
        this.functionsService.navigateTo('core/catalogos/incoterm')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Incoterm')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/incoterm')
  }

}
