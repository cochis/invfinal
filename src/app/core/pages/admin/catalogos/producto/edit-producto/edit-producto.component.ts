import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarProducto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Producto } from 'src/app/core/models/producto.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { ProductosService } from 'src/app/core/services/producto.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css']
})
export class EditProductoComponent  {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  producto: Producto
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
 private productosService: ProductosService,
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
    this.productosService.cargarProductoById(id).subscribe((resp: CargarProducto) => {
      

      this.producto = resp.producto
  

      setTimeout(() => {

        this.setForm(this.producto)
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
  setForm(producto: Producto) {
 

    this.form = this.fb.group({
      nombre: [producto.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [producto.clave, [Validators.required, Validators.minLength(3)]],
      activated: [producto.activated],
      dateCreated: [producto.dateCreated],
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

      this.producto = {
        ...this.producto,
        ...this.form.value,


      }

      this.productosService.actualizarProducto(this.producto).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Producto')
        this.functionsService.navigateTo('core/catalogos/producto')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Producto')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/producto')
  }

}
