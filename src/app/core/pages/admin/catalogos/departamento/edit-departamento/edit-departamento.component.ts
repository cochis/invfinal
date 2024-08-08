import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarDepartamento } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Departamento } from 'src/app/core/models/departamento.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { DepartamentosService } from 'src/app/core/services/departamentos.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-departamento',
  templateUrl: './edit-departamento.component.html',
  styleUrls: ['./edit-departamento.component.css']
})
export class EditDepartamentoComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  departamento: Departamento
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
 private departamentosService: DepartamentosService,
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
    this.departamentosService.cargarDepartamentoById(id).subscribe((resp: CargarDepartamento) => {
      

      this.departamento = resp.departamento
  

      setTimeout(() => {

        this.setForm(this.departamento)
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
  setForm(departamento: Departamento) {
 

    this.form = this.fb.group({
      nombre: [departamento.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [departamento.clave, [Validators.required, Validators.minLength(3)]],
      descripcion: [departamento.descripcion, [Validators.required, Validators.minLength(3)]],
      activated: [departamento.activated],
      dateCreated: [departamento.dateCreated],
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

      this.departamento = {
        ...this.departamento,
        ...this.form.value,


      }

      this.departamentosService.actualizarDepartamento(this.departamento).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Departamento')
        this.functionsService.navigateTo('core/catalogos/departamentos')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Departamento')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/departamento')
  }

}
