import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarTickets, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Ticket } from 'src/app/core/models/ticket.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css']
})
export class MyTicketsComponent {
  ADM =environment.ADM  
  url = environment.base_url 
  loading = false
  usuarios: Usuario[]
  usuariosTemp: Usuario[]
  tickets: Ticket[]
  ticketsTemp: Ticket[]
  id!:string
 
  rol = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
    constructor( 
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private ticketsService: TicketService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute
    ){
      this.id = this.route.snapshot.params['id']
 
  
      this.getTickets()
      this.getCatalogos()
    }
  
    getTickets() {
      this.loading = true
     
  
        this.ticketsService.cargarMyTickets(this.uid).subscribe((resp: CargarTickets) => {
        
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
            this.functionsService.alertError(error,'Ticket')
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
          this.functionsService.alertError(error,'Ticket')
  
        })
    }
    viewTicket(id: string) {
      this.functionsService.navigateTo(`/core/edit-ticket/false/${id}`)
  
    }
  
    newTicket() {
  
      this.functionsService.navigateTo('core/new-ticket')
    }
  
  
    buscar(termino) {
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.tickets = this.ticketsTemp
          return
        }
        this.busquedasService.buscar('usuarios', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.tickets = this.functionsService.getActives(resp)
          
       
        })
  
      }, 500);
    }
     
     
  }
  