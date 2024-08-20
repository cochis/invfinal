import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarPais } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Pais } from 'src/app/core/models/pais.model';
import { PaissService } from 'src/app/core/services/pais.service';
 
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-pais',
  templateUrl: './edit-pais.component.html',
  styleUrls: ['./edit-pais.component.css']
})
export class EditPaisComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  pais: Pais
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
 private paissService: PaissService,
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
    this.paissService.cargarPaisById(id).subscribe((resp: CargarPais) => {
      

      this.pais = resp.pais
  

      setTimeout(() => {

        this.setForm(this.pais)
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
  setForm(pais: Pais) {
 

    this.form = this.fb.group({
      nombre: [pais.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [pais.clave, [Validators.required, Validators.minLength(3)]],
      activated: [pais.activated],
      dateCreated: [pais.dateCreated],
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

      this.pais = {
        ...this.pais,
        ...this.form.value,


      }

      this.paissService.actualizarPais(this.pais).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Pais')
        this.functionsService.navigateTo('core/catalogos/paises')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Pais')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/paises')
  }

}
