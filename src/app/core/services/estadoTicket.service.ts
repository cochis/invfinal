import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarEstadoTickets, CargarEstadoTicket } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { EstadoTicket } from '../models/estadoTicket.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class EstadoTicketService {

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

 
  cargarEstadoTicketsAll() {
    const url = `${base_url}/estadoTicket/all`
    return this.http.get<CargarEstadoTickets>(url, this.headers).pipe(
      map((resp) => {
   
        const estadoTickets = resp.estadoTickets.map(
          (estadoTickets) =>
            new EstadoTicket(
              estadoTickets.nombre,
              estadoTickets.clave,
              estadoTickets.activated,
              estadoTickets.usuarioCreated,
              estadoTickets.dateCreated,
              estadoTickets.lastEdited,
              estadoTickets.uid,

            ),
        )
        return {
          total: estadoTickets.length,
          estadoTickets,
        }
      }),
    )
  }
  cargarEstadoTicket() {
    const url = `${base_url}/roles/all/estadoTicket`
    return this.http.get<CargarEstadoTickets>(url, this.headers).pipe(
      map((resp) => {
        const estadoTickets = resp.estadoTickets.map(
          (estadoTicket) =>
            new Role(
              estadoTicket.nombre,
              estadoTicket.clave,
              estadoTicket.activated,
              estadoTicket.usuarioCreated,
              estadoTicket.dateCreated,
              estadoTicket.lastEdited,
              estadoTicket.uid,

            ),
        )
        return {
          total: estadoTickets.length,
          estadoTickets,
        }
      }),
    )
  }
  
  crearEstadoTicket(formData: EstadoTicket) {
    return this.http.post(`${base_url}/estadoTicket`, formData, this.headers)
  }


  isActivedEstadoTicket(estadoTicket: EstadoTicket) {
    const url = `${base_url}/estadoTicket/isActive/${estadoTicket.uid}`
    const data = {
      ...estadoTicket,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarEstadoTicket(estadoTicket: EstadoTicket) {
     
    const url = `${base_url}/estadoTicket/${estadoTicket.uid}`
    const data = {
      ...estadoTicket,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarEstadoTicketById(id: string) {
    const url = `${base_url}/estadoTicket/${id}`
    return this.http.get<CargarEstadoTicket>(url, this.headers)
  }
  cargarEstadoTicketByClave(clave: string) {
    const url = `${base_url}/estadoTicket/clave/${clave}`
    return this.http.get<CargarEstadoTicket>(url, this.headers)
  }

}
