import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-tipo-stock',
  templateUrl: './edit-tipo-stock.component.html',
  styleUrls: ['./edit-tipo-stock.component.css']
})
export class EditTipoStockComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoStock: TipoStock
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
 private tipoStockService: TipoStockService,
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
    this.tipoStockService.cargarTipoStockById(id).subscribe((resp: CargarTipoStock) => {
      

      this.tipoStock = resp.tipoStock
    

      setTimeout(() => {

        this.setForm(this.tipoStock)
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
  setForm(tipoStock: TipoStock) {
   

    this.form = this.fb.group({
      nombre: [tipoStock.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoStock.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoStock.activated],
      dateCreated: [tipoStock.dateCreated],
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

      this.tipoStock = {
        ...this.tipoStock,
        ...this.form.value,


      }

      this.tipoStockService.actualizarTipoStock(this.tipoStock).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Tipo Stock')
        this.functionsService.navigateTo('core/catalogos/tipoStock')
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
    this.functionsService.navigateTo('core/catalogos/tipoStock')
  }

}
