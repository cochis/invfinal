import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarProveedorLoop } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';
import { ProveedorLoopsService } from 'src/app/core/services/proveedorLoops.service';
import { RolesService } from 'src/app/core/services/roles.service';
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-proveedor-loop',
  templateUrl: './edit-proveedor-loop.component.html',
  styleUrls: ['./edit-proveedor-loop.component.css']
})
export class EditProveedorLoopComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  proveedorLoop: ProveedorLoop
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
 private proveedorLoopsService: ProveedorLoopsService,
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
    this.proveedorLoopsService.cargarProveedorLoopById(id).subscribe((resp: CargarProveedorLoop) => {
      

      this.proveedorLoop = resp.proveedorLoop
  

      setTimeout(() => {

        this.setForm(this.proveedorLoop)
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
  setForm(proveedorLoop: ProveedorLoop) {
 

    this.form = this.fb.group({
      name: [proveedorLoop.name, [Validators.required, Validators.minLength(3)]],
      pais: [proveedorLoop.pais, [Validators.required, Validators.minLength(3)]],
      taxId: [proveedorLoop.taxId, [Validators.required, Validators.minLength(3)]],
      activated: [proveedorLoop.activated],
      dateCreated: [proveedorLoop.dateCreated],
      lastEdited: [this.today],
    })
    
 



  }

  onSubmit() {
    this.loading = true
    this.form.value.name = this.form.value.name.toUpperCase().trim()
    this.form.value.pais = this.form.value.pais.toUpperCase().trim()
    this.form.value.taxId = this.form.value.taxId.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Proveedor loop')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.proveedorLoop = {
        ...this.proveedorLoop,
        ...this.form.value,


      }

      this.proveedorLoopsService.actualizarProveedorLoop(this.proveedorLoop).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Proveedor de Loop')
        this.functionsService.navigateTo('core/catalogos/proveedor-loop')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'ProveedorLoop')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/proveedor-loop')
  }

}
