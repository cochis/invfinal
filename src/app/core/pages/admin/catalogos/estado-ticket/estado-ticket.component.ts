import { Component } from '@angular/core';

 import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { EstadoTicket } from 'src/app/core/models/estadoTicket.model';
import { EstadoTicketService } from 'src/app/core/services/estadoTicket.service';
import { CargarEstadoTickets } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


@Component({
  selector: 'app-estado-ticket',
  templateUrl: './estado-ticket.component.html',
  styleUrls: ['./estado-ticket.component.css']
})
export class EstadoTicketComponent {
  data!: any
  estadoTickets: EstadoTicket[] = [];
  estadoTicketsTemp: EstadoTicket[] = [];
  loading = false
  url = environment.base_url
constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private estadoTicketsServices: EstadoTicketService
  ) {
    this.getEstadoTicket()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.estadoTickets = this.estadoTicketsTemp
        return
      }
      this.busquedasService.buscar('tipoTickets', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.estadoTickets = resp

   
      })

    }, 500);
  }



 
  getEstadoTicket() {
    this.loading = true
    this.estadoTicketsServices.cargarEstadoTicketsAll().subscribe((resp: CargarEstadoTickets) => {
   
 
      this.estadoTickets = resp.estadoTickets
this.estadoTicketsTemp = resp.estadoTickets
      setTimeout(() => {
this.loading = false
      }, 1500);
    },
      (error) => {
        this.functionsService.alertError(error,'Estado ticket')
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editRol(id: string) {
this.functionsService.navigateTo(`/core/catalogos/edit-estadoTicket/true/${id}`)
}
  isActived(estadoTicket: EstadoTicket) {

    this.estadoTicketsServices.isActivedEstadoTicket(estadoTicket).subscribe((resp: any) => {
      this.getEstadoTicket()


    },
      (error: any) => {
        this.functionsService.alertError(error,'Estado ticket')

      })
  }
  viewTipoTicket(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-estadoTicket/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-estadoTicket')
  }

}
