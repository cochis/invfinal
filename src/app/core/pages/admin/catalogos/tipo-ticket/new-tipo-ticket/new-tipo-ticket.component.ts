import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoTicket } from 'src/app/core/models/tipoTicket.model';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { TipoTicketService } from 'src/app/core/services/tipoTicket.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-new-tipo-ticket',
  templateUrl: './new-tipo-ticket.component.html',
  styleUrls: ['./new-tipo-ticket.component.css']
})
export class NewTipoTicketComponent {
  loading = false
  tipoTicket: TipoTicket[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoTicketsService: TipoTicketService,
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
     
      this.tipoTicketsService.crearTipoTicket(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Tipo ticket', 'Tipo ticket creado', 'success')
        this.functionsService.navigateTo('core/catalogos/tipoTicket')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo Ticket')

          this.loading = false
          

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Tipo ticket ')
      return 
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/tipoTicket')
  }

}

