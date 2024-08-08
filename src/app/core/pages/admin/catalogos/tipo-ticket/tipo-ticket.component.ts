import { Component } from '@angular/core';
import { CargarTipoTickets } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';


import { environment } from 'src/environments/environment';
import { TipoTicket } from 'src/app/core/models/tipoTicket.model';
import { TipoTicketService } from 'src/app/core/services/tipoTicket.service';



@Component({
  selector: 'app-tipo-ticket',
  templateUrl: './tipo-ticket.component.html',
  styleUrls: ['./tipo-ticket.component.css']
})
export class TipoTicketComponent  {
  data!: any
  tipoTickets: TipoTicket[] = [];
  tipoTicketsTemp: TipoTicket[] = [];
  loading = false
  url = environment.base_url
constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoTicketsServices: TipoTicketService
  ) {
    this.getTipoTickets()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoTickets = this.tipoTicketsTemp
        return
      }
      this.busquedasService.buscar('tipoTickets', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoTickets = resp

        this.setTipoTickets()
      })

    }, 500);
  }




  setTipoTickets() {
    this.loading = true
    setTimeout(() => {

      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false

    }, 500);
  }
  getTipoTickets() {
    this.loading = true
    this.tipoTicketsServices.cargarTipoTicketsAll().subscribe((resp: CargarTipoTickets) => {
     
 
      this.tipoTickets = resp.tipoTickets
this.tipoTicketsTemp = resp.tipoTickets
      setTimeout(() => {
this.loading = false
      }, 1500);
    },
      (error) => {
        this.functionsService.alertError(error,'Tipo ticket')
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editRol(id: string) {
this.functionsService.navigateTo(`/core/catalogos/edit-tipoTicket/true/${id}`)
}
  isActived(tipoTicket: TipoTicket) {

    this.tipoTicketsServices.isActivedTipoTicket(tipoTicket).subscribe((resp: any) => {
      this.getTipoTickets()


    },
      (error: any) => {
     
         this.functionsService.alertError(error,'Tipo ticket')

      })
  }
  viewTipoTicket(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipoTicket/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-tipoTicket')
  }

}
