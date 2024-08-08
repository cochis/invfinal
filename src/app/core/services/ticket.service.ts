import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTickets, CargarTicket } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { Ticket } from '../models/ticket.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient,) { }
  get token(): string {
    return localStorage.getItem('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

 
  cargarMyTickets(uid:string) {
    const url = `${base_url}/ticket/my-tickets/${uid}`
    return this.http.get<CargarTickets>(url, this.headers).pipe(
      map((resp) => {
   
        const tickets = resp.tickets.map(
          (ticket) =>
            new Ticket(
              ticket.tipoTicket,
              ticket.usuarioCreated,
              ticket.usuarioAtendio,
              ticket.descripcion,
              ticket.respuesta,
              ticket.img,
              ticket.estado,
              ticket.activated,
              ticket.dateCreated,
              ticket.lastEdited,
              ticket.uid,
               

            ),
        )
        return {
          total: tickets.length,
          tickets,
        }
      }),
    )
  }
  cargarTicketsAll() {
    const url = `${base_url}/ticket/all`
    return this.http.get<CargarTickets>(url, this.headers).pipe(
      map((resp) => {
   
        const tickets = resp.tickets.map(
          (ticket) =>
            new Ticket(
              ticket.tipoTicket,
              ticket.usuarioCreated,
              ticket.usuarioAtendio,
              ticket.descripcion,
              ticket.respuesta,
              ticket.img,
              ticket.estado,
              ticket.activated,
              ticket.dateCreated,
              ticket.lastEdited,
              ticket.uid,
               

            ),
        )
        return {
          total: tickets.length,
          tickets,
        }
      }),
    )
  }
  cargarTicket() {
    const url = `${base_url}/roles/all/ticket`
    return this.http.get<CargarTickets>(url, this.headers).pipe(
      map((resp) => {
        const tickets = resp.tickets.map(
          (ticket) =>
            new Ticket(
              ticket.tipoTicket,
              ticket.usuarioCreated,
              ticket.usuarioAtendio,
              ticket.descripcion,
              ticket.respuesta,
              ticket.img,
              ticket.estado,
              ticket.activated,
              ticket.dateCreated,
              ticket.lastEdited,
              ticket.uid,

            ),
        )
        return {
          total: tickets.length,
          tickets,
        }
      }),
    )
  }
  
  crearTicket(formData: Ticket) {

    const ticket = {
      ...formData,
      url: base_url
    }
    return this.http.post(`${base_url}/ticket`, ticket, this.headers)
  }


  isActivedTicket(ticket: Ticket) {
    const url = `${base_url}/ticket/isActive/${ticket.uid}`
    const data = {
      ...ticket,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTicket(ticket: Ticket) {
   
    const url = `${base_url}/ticket/${ticket.uid}`
    const data = {
      ...ticket,
      lastEdited: Date.now(),
      url: base_url
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTicketById(id: string) {
    const url = `${base_url}/ticket/${id}`
    return this.http.get<CargarTicket>(url, this.headers)
  }
  cargarTicketByClave(clave: string) {
    const url = `${base_url}/ticket/clave/${clave}`
    return this.http.get<CargarTicket>(url, this.headers)
  }

}
