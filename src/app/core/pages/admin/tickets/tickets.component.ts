import { Component } from '@angular/core';
import { CargarEstadoTickets, CargarRoles, CargarTickets, CargarTipoTickets, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EstadoTicket } from 'src/app/core/models/estadoTicket.model';
import { Role } from 'src/app/core/models/role.model';
import { Ticket } from 'src/app/core/models/ticket.model';
import { TipoTicket } from 'src/app/core/models/tipoTicket.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { EstadoTicketService } from 'src/app/core/services/estadoTicket.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { TipoTicketService } from 'src/app/core/services/tipoTicket.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  ADM = environment.ADM
  REH = environment.REH
  url = environment.base_url
  loading = false
  usuarios: Usuario[]
  tipoTickets: TipoTicket[]
  estadoTickets: EstadoTicket[]
  usuariosTemp: Usuario[]
  tickets: Ticket[]
  ticketsTemp: Ticket[]

  rol = this.functionsService.getLocal('role')
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private ticketsService: TicketService,
    private tipoTiketsService: TipoTicketService,
    private estadoTiketsService: EstadoTicketService,
    private usuariosService: UsuariosService,
  ) {
    this.getTickets()
    this.getCatalogos()
  }

  getTickets() {
    this.loading = true


    this.ticketsService.cargarTicketsAll().subscribe((resp: CargarTickets) => {


      this.tickets = resp.tickets
      setTimeout(() => {
        this.ticketsTemp = resp.tickets

        this.loading = false
      }, 1500);
    });

  }
  getCatalogos() {

    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = resp.usuarios
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tickets-Usuarios')
        this.loading = false
      })
    this.tipoTiketsService.cargarTipoTicketsAll().subscribe((resp: CargarTipoTickets) => {
      this.tipoTickets = resp.tipoTickets
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tickets-Tipo tickets')
        this.loading = false
      })
    this.estadoTiketsService.cargarEstadoTicketsAll().subscribe((resp: CargarEstadoTickets) => {
      this.estadoTickets = resp.estadoTickets
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tickets-Estado tickets')
        this.loading = false
      })



  }

  editTicket(id: string) {

    this.functionsService.navigateTo(`/core/edit-ticket/true/${id}`)

  }
  isActived(ticket: Ticket) {

    this.ticketsService.isActivedTicket(ticket).subscribe((resp: any) => {
      this.getTickets()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Ticket')


      })
  }
  viewTicket(id: string) {
    this.functionsService.navigateTo(`/core/edit-ticket/false/${id}`)

  }

  newTicket() {

    this.functionsService.navigateTo('core/new-ticket')
  }


  buscar(termino) {
    this.loading = true
    termino = termino.trim()

    setTimeout(() => {
      if (termino.length === 0) {
        this.tickets = this.ticketsTemp
        return
      }
      this.busquedasService.buscar('tickets', termino, this.functionsService.isAdmin()).subscribe((resp) => {

        this.tickets = resp


      })
      this.loading = false
    }, 800);
  }
  buscarCatalogo(tipo: string, value) {
    this.loading = true

    setTimeout(() => {

      switch (tipo) {
        case 'usuarios':
          if (value == '') {
            this.tickets = this.ticketsTemp

          }
          this.busquedasService.buscarCatalogo('usuarios', value).subscribe((resp) => {
            this.tickets = resp
          })
          break;
        case 'usuarios-ticket':
          if (value == '') {
            this.tickets = this.ticketsTemp

          }
          this.busquedasService.buscarCatalogo('usuarios-ticket', value).subscribe((resp) => {
            this.tickets = resp
          })
          break;
        case 'tipoTicket-ticket':
          if (value == '') {
            this.tickets = this.ticketsTemp

          }
          this.busquedasService.buscarCatalogo('tipoTicket-ticket', value).subscribe((resp) => {
            this.tickets = resp
          })
          break;
        case 'estado-ticket':
          if (value == '') {
            this.tickets = this.ticketsTemp

          }
          this.busquedasService.buscarCatalogo('estado-ticket', value).subscribe((resp) => {
            this.tickets = resp
          })
          break;


      }
      this.loading = false
    }, 800);
  }

}
