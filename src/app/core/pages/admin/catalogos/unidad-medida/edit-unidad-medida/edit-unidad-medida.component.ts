import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarUnidadMedida } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { UnidadMedidasService } from 'src/app/core/services/unidadMedida.service';
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-unidad-medida',
  templateUrl: './edit-unidad-medida.component.html',
  styleUrls: ['./edit-unidad-medida.component.css']
})
export class EditUnidadMedidaComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  unidadMedida: UnidadMedida
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
 private unidadMedidasService: UnidadMedidasService,
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
    this.unidadMedidasService.cargarUnidadMedidaById(id).subscribe((resp: CargarUnidadMedida) => {
      

      this.unidadMedida = resp.unidadMedida
  

      setTimeout(() => {

        this.setForm(this.unidadMedida)
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
  setForm(unidadMedida: UnidadMedida) {
 

    this.form = this.fb.group({
      nombre: [unidadMedida.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [unidadMedida.clave, [Validators.required, Validators.minLength(3)]],
      activated: [unidadMedida.activated],
      dateCreated: [unidadMedida.dateCreated],
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

      this.unidadMedida = {
        ...this.unidadMedida,
        ...this.form.value,


      }

      this.unidadMedidasService.actualizarUnidadMedida(this.unidadMedida).subscribe((resp: any) => {
        this.functionsService.alertUpdate('UnidadMedida')
        this.functionsService.navigateTo('core/catalogos/unidadMedida')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'UnidadMedida')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/unidadMedida')
  }

}
