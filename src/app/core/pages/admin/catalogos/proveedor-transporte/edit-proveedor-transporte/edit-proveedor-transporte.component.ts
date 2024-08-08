import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarProveedorTransporte } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ProveedorTransporte } from 'src/app/core/models/proveedorTransporte.model';
import { ProveedorTransportesService } from 'src/app/core/services/provedorTransportes.service';
import { RolesService } from 'src/app/core/services/roles.service';
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-proveedor-transporte',
  templateUrl: './edit-proveedor-transporte.component.html',
  styleUrls: ['./edit-proveedor-transporte.component.css']
})
export class EditProveedorTransporteComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  proveedorTransporte: ProveedorTransporte
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
 private proveedorTransportesService: ProveedorTransportesService,
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
    this.proveedorTransportesService.cargarProveedorTransporteById(id).subscribe((resp: CargarProveedorTransporte) => {
      

      this.proveedorTransporte = resp.proveedorTransporte
      

      setTimeout(() => {

        this.setForm(this.proveedorTransporte)
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
  setForm(proveedorTransporte: ProveedorTransporte) {
 

    this.form = this.fb.group({
      nombre: [proveedorTransporte.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [proveedorTransporte.clave, [Validators.required, Validators.minLength(3)]],
      activated: [proveedorTransporte.activated],
      dateCreated: [proveedorTransporte.dateCreated],
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

      this.proveedorTransporte = {
        ...this.proveedorTransporte,
        ...this.form.value,


      }

      this.proveedorTransportesService.actualizarProveedorTransporte(this.proveedorTransporte).subscribe((resp: any) => {
        this.functionsService.alertUpdate('ProveedorTransporte')
        this.functionsService.navigateTo('core/catalogos/proveedorTransporte')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'ProveedorTransporte')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/proveedorTransporte')
  }

}
