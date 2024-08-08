import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarEmpresa } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { RolesService } from 'src/app/core/services/roles.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-empresa',
  templateUrl: './edit-empresa.component.html',
  styleUrls: ['./edit-empresa.component.css']
})
export class EditEmpresaComponent{
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  empresa: Empresa
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
 private empresasService: EmpresasService,
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
    this.empresasService.cargarEmpresaById(id).subscribe((resp: CargarEmpresa) => {
      

      this.empresa = resp.empresa
  

      setTimeout(() => {

        this.setForm(this.empresa)
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
  setForm(empresa: Empresa) {
 

    this.form = this.fb.group({
      nombre: [empresa.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [empresa.clave, [Validators.required, Validators.minLength(3)]],
       
      activated: [empresa.activated],
      dateCreated: [empresa.dateCreated],
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

      this.empresa = {
        ...this.empresa,
        ...this.form.value,


      }

      this.empresasService.actualizarEmpresa(this.empresa).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Empresa')
        this.functionsService.navigateTo('core/catalogos/empresas')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Empresa')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/empresas')
  }

}
