import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoProveedor } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoProveedor } from 'src/app/core/models/tipoProveedor.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { TipoProveedorService } from 'src/app/core/services/tipoProveedor.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-tipo-proveedor',
  templateUrl: './edit-tipo-proveedor.component.html',
  styleUrls: ['./edit-tipo-proveedor.component.css']
})
export class EditTipoProveedorComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoProveedor: TipoProveedor
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
 private tipoProveedorService: TipoProveedorService,
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
    this.tipoProveedorService.cargarTipoProveedorById(id).subscribe((resp: CargarTipoProveedor) => {
      

      this.tipoProveedor = resp.tipoProveedor
    

      setTimeout(() => {

        this.setForm(this.tipoProveedor)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Tipo stock')


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
  setForm(tipoProveedor: TipoProveedor) {
   

    this.form = this.fb.group({
      nombre: [tipoProveedor.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoProveedor.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoProveedor.activated],
      dateCreated: [tipoProveedor.dateCreated],
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

      this.tipoProveedor = {
        ...this.tipoProveedor,
        ...this.form.value,


      }

      this.tipoProveedorService.actualizarTipoProveedor(this.tipoProveedor).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Tipo Stock')
        this.functionsService.navigateTo('core/catalogos/tipoProveedor')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo Stock')
          this.loading = false

       

        })
    } else {
      this.functionsService.alertForm('Tipo stock')
      this.loading = false

      return  
    }



 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/tipoProveedor')
  }

}
