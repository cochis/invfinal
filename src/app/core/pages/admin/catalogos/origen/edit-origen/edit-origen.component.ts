import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarOrigen } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Origen } from 'src/app/core/models/origen.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { OrigensService } from 'src/app/core/services/origens.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-origen',
  templateUrl: './edit-origen.component.html',
  styleUrls: ['./edit-origen.component.css']
})
export class EditOrigenComponent{
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  origen: Origen
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
 private origensService: OrigensService,
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
    this.origensService.cargarOrigenById(id).subscribe((resp: CargarOrigen) => {
      

      this.origen = resp.origen
  

      setTimeout(() => {

        this.setForm(this.origen)
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
  setForm(origen: Origen) {
 

    this.form = this.fb.group({
      nombre: [origen.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [origen.clave, [Validators.required, Validators.minLength(3)]],
      activated: [origen.activated],
      dateCreated: [origen.dateCreated],
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

      this.origen = {
        ...this.origen,
        ...this.form.value,


      }

      this.origensService.actualizarOrigen(this.origen).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Origen')
        this.functionsService.navigateTo('core/catalogos/origen')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Origen')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/origen')
  }

}
