import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarTipoTicket } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoTicket } from 'src/app/core/models/tipoTicket.model';
import { RolesService } from 'src/app/core/services/roles.service';
import {  TipoTicketService } from 'src/app/core/services/tipoTicket.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-tipo-ticket',
  templateUrl: './edit-tipo-ticket.component.html',
  styleUrls: ['./edit-tipo-ticket.component.css']
})
export class EditTipoTicketComponent  {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoTicket: TipoTicket
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
 private tipoTicketService: TipoTicketService,
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
    this.tipoTicketService.cargarTipoTicketById(id).subscribe((resp: CargarTipoTicket) => {
      

      this.tipoTicket = resp.tipoTicket
  

      setTimeout(() => {

        this.setForm(this.tipoTicket)
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
  setForm(tipoTicket: TipoTicket) {
 

    this.form = this.fb.group({
      nombre: [tipoTicket.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoTicket.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoTicket.activated],
      dateCreated: [tipoTicket.dateCreated],
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

      this.tipoTicket = {
        ...this.tipoTicket,
        ...this.form.value,


      }

      this.tipoTicketService.actualizarTipoTicket(this.tipoTicket).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Tipo Stock')
        this.functionsService.navigateTo('core/catalogos/tipoTicket')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo Stock')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/tipoTicket')
  }

}
