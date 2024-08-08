import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarClienteLoop } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ClienteLoop } from 'src/app/core/models/clienteLoop.model';
import { ClienteLoopsService } from 'src/app/core/services/clienteLoops.service';
import { RolesService } from 'src/app/core/services/roles.service';
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-cliente-loop',
  templateUrl: './edit-cliente-loop.component.html',
  styleUrls: ['./edit-cliente-loop.component.css']
})
export class EditClienteLoopComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  clienteLoop: ClienteLoop
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
 private clienteLoopsService: ClienteLoopsService,
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
    this.clienteLoopsService.cargarClienteLoopById(id).subscribe((resp: CargarClienteLoop) => {
      

      this.clienteLoop = resp.clienteLoop
  

      setTimeout(() => {

        this.setForm(this.clienteLoop)
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
  setForm(clienteLoop: ClienteLoop) {
 

    this.form = this.fb.group({
      name: [clienteLoop.name, [Validators.required, Validators.minLength(3)]],
      pais: [clienteLoop.pais, [Validators.required, Validators.minLength(3)]],
      taxId: [clienteLoop.taxId, [Validators.required, Validators.minLength(3)]],
      activated: [clienteLoop.activated],
      dateCreated: [clienteLoop.dateCreated],
      lastEdited: [this.today],
    })
    
 



  }

  onSubmit() {
    this.loading = true
    this.form.value.name = this.form.value.name.toUpperCase().trim()
    this.form.value.pais = this.form.value.pais.toUpperCase().trim()
    this.form.value.taxId = this.form.value.taxId.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Cliente loop')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.clienteLoop = {
        ...this.clienteLoop,
        ...this.form.value,


      }

      this.clienteLoopsService.actualizarClienteLoop(this.clienteLoop).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Cliente de Loop')
        this.functionsService.navigateTo('core/catalogos/cliente-loop')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'ClienteLoop')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/cliente-loop')
  }

}
