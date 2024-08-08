import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarTipoMaterial } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoMaterial } from 'src/app/core/models/tipoMaterial.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { TipoMaterialsService } from 'src/app/core/services/tipoMaterials.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-tipo-material',
  templateUrl: './edit-tipo-material.component.html',
  styleUrls: ['./edit-tipo-material.component.css']
})
export class EditTipoMaterialComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoMaterial: TipoMaterial
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
 private tipoMaterialsService: TipoMaterialsService,
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
    this.tipoMaterialsService.cargarTipoMaterialById(id).subscribe((resp: CargarTipoMaterial) => {
      

      this.tipoMaterial = resp.tipoMaterial
  

      setTimeout(() => {

        this.setForm(this.tipoMaterial)
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
  setForm(tipoMaterial: TipoMaterial) {
 

    this.form = this.fb.group({
      nombre: [tipoMaterial.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoMaterial.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoMaterial.activated],
      dateCreated: [tipoMaterial.dateCreated],
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

      this.tipoMaterial = {
        ...this.tipoMaterial,
        ...this.form.value,


      }

      this.tipoMaterialsService.actualizarTipoMaterial(this.tipoMaterial).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoMaterial')
        this.functionsService.navigateTo('core/catalogos/tipoMaterial')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'TipoMaterial')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/tipoMaterial')
  }

}
