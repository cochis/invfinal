import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarCompania } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Compania } from 'src/app/core/models/compania.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { CompaniasService } from 'src/app/core/services/companias.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-compania',
  templateUrl: './edit-compania.component.html',
  styleUrls: ['./edit-compania.component.css']
})
export class EditCompaniaComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  compania: Compania
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
 private companiasService: CompaniasService,
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
    this.companiasService.cargarCompaniaById(id).subscribe((resp: CargarCompania) => {
      

      this.compania = resp.compania
  

      setTimeout(() => {

        this.setForm(this.compania)
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
      calle: [''],
      ciudad: [''],
      estado: [''],
      pais: [''],
      codigoPostal: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(compania: Compania) {
    this.form = this.fb.group({
      nombre: [compania.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [compania.clave, [Validators.required, Validators.minLength(3)]],
      calle: [compania.calle],
      ciudad: [compania.ciudad],
      estado: [compania.estado],
      pais: [compania.pais],
      codigoPostal: [compania.codigoPostal],
      activated: [compania.activated],
      dateCreated: [compania.dateCreated],
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

      this.compania = {
        ...this.compania,
        ...this.form.value,


      }

      this.companiasService.actualizarCompania(this.compania).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Compania')
        this.functionsService.navigateTo('core/catalogos/compania')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Compania')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/compania')
  }

}
