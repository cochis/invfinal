import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEstadoTicket } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EstadoTicket } from 'src/app/core/models/estadoTicket.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { EstadoTicketService } from 'src/app/core/services/estadoTicket.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-estado-ticket',
  templateUrl: './edit-estado-ticket.component.html',
  styleUrls: ['./edit-estado-ticket.component.css']
})
export class EditEstadoTicketComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  estadoTicket: EstadoTicket
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
 private estadoTicketService: EstadoTicketService,
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
    this.estadoTicketService.cargarEstadoTicketById(id).subscribe((resp: CargarEstadoTicket) => {
      

      this.estadoTicket = resp.estadoTicket
 
      setTimeout(() => {

        this.setForm(this.estadoTicket)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Estado de ticket')
     


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
  setForm(estadoTicket: EstadoTicket) {
 

    this.form = this.fb.group({
      nombre: [estadoTicket.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [estadoTicket.clave, [Validators.required, Validators.minLength(3)]],
      activated: [estadoTicket.activated],
      dateCreated: [estadoTicket.dateCreated],
      lastEdited: [this.today],
    })
    
  



  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Estado ticket')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.estadoTicket = {
        ...this.estadoTicket,
        ...this.form.value,


      }

      this.estadoTicketService.actualizarEstadoTicket(this.estadoTicket).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Estado Ticket')
        this.functionsService.navigateTo('core/catalogos/estadoTicket')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Estado Ticket')
          this.loading = false

          this.functionsService.alertError(error,'Estado ticket')

        })
    } else {
      this.functionsService.alertForm('Estado Ticket')
      this.loading = false

      return  
    }


 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/estadoTicket')
  }

}
