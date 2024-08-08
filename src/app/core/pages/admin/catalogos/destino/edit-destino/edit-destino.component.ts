import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarDestino } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Destino } from 'src/app/core/models/destino.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { DestinosService } from 'src/app/core/services/destinos.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-destino',
  templateUrl: './edit-destino.component.html',
  styleUrls: ['./edit-destino.component.css']
})
export class EditDestinoComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  destino: Destino
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
 private destinosService: DestinosService,
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
    this.destinosService.cargarDestinoById(id).subscribe((resp: CargarDestino) => {
      

      this.destino = resp.destino
  

      setTimeout(() => {

        this.setForm(this.destino)
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
  setForm(destino: Destino) {
 

    this.form = this.fb.group({
      nombre: [destino.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [destino.clave, [Validators.required, Validators.minLength(3)]],
      activated: [destino.activated],
      dateCreated: [destino.dateCreated],
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

      this.destino = {
        ...this.destino,
        ...this.form.value,


      }

      this.destinosService.actualizarDestino(this.destino).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Destino')
        this.functionsService.navigateTo('core/catalogos/destino')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Destino')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/destino')
  }

}
