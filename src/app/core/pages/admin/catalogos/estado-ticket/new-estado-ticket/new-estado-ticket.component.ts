import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoTicket } from 'src/app/core/models/estadoTicket.model';
import { EstadoTicketService } from 'src/app/core/services/estadoTicket.service';


import { FunctionsService } from 'src/app/shared/services/functions.service'
@Component({
  selector: 'app-new-estado-ticket',
  templateUrl: './new-estado-ticket.component.html',
  styleUrls: ['./new-estado-ticket.component.css']
})
export class NewEstadoTicketComponent  {
  loading = false
  estadoTicket: EstadoTicket[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private estadoTicketsService: EstadoTicketService,
  ) {
    this.loading = true

    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }




  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],

      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()
      this.estadoTicketsService.crearEstadoTicket(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Tipo estado', 'Tipo estado creado', 'success')
        this.functionsService.navigateTo('core/catalogos/estadoTicket')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo Estado')

          this.loading = false
          this.functionsService.alertError(error,'Estado ticket')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Tipo estado ')
      return  
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/estadoTicket')
  }

}

