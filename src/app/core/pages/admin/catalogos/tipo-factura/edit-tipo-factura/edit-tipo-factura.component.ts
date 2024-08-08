import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarTipoFactura } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoFactura } from 'src/app/core/models/tipoFactura.model';
import { RolesService } from 'src/app/core/services/roles.service';
import {  TipoFacturaService } from 'src/app/core/services/tipoFactura.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-tipo-factura',
  templateUrl: './edit-tipo-factura.component.html',
  styleUrls: ['./edit-tipo-factura.component.css']
})
export class EditTipoFacturaComponent  {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoFactura: TipoFactura
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
 private tipoFacturaService: TipoFacturaService,
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
    this.tipoFacturaService.cargarTipoFacturaById(id).subscribe((resp: CargarTipoFactura) => {
      

      this.tipoFactura = resp.tipoFactura
  

      setTimeout(() => {

        this.setForm(this.tipoFactura)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Tipo factura')


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
  setForm(tipoFactura: TipoFactura) {
 

    this.form = this.fb.group({
      nombre: [tipoFactura.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoFactura.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoFactura.activated],
      dateCreated: [tipoFactura.dateCreated],
      lastEdited: [this.today],
    })
    
 



  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Tipo Factura')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.tipoFactura = {
        ...this.tipoFactura,
        ...this.form.value,


      }

      this.tipoFacturaService.actualizarTipoFactura(this.tipoFactura).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Tipo Factura')
        this.functionsService.navigateTo('core/catalogos/tipo-factura')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo Factura')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Facturas')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/tipoFactura')
  }

}
