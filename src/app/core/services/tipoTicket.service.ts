import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoTickets, CargarTipoTicket } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { TipoTicket } from '../models/tipoTicket.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoTicketService {

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

 
  cargarTipoTicketsAll() {
    const url = `${base_url}/tipoTicket/all`
    return this.http.get<CargarTipoTickets>(url, this.headers).pipe(
      map((resp) => {
   
        const tipoTickets = resp.tipoTickets.map(
          (tipoTickets) =>
            new TipoTicket(
              tipoTickets.nombre,
              tipoTickets.clave,
              tipoTickets.activated,
              tipoTickets.usuarioCreated,
              tipoTickets.dateCreated,
              tipoTickets.lastEdited,
              tipoTickets.uid,

            ),
        )
        return {
          total: tipoTickets.length,
          tipoTickets,
        }
      }),
    )
  }
  cargarTipoTicket() {
    const url = `${base_url}/roles/all/tipoTicket`
    return this.http.get<CargarTipoTickets>(url, this.headers).pipe(
      map((resp) => {
        const tipoTickets = resp.tipoTickets.map(
          (tipoTicket) =>
            new Role(
              tipoTicket.nombre,
              tipoTicket.clave,
              tipoTicket.activated,
              tipoTicket.usuarioCreated,
              tipoTicket.dateCreated,
              tipoTicket.lastEdited,
              tipoTicket.uid,

            ),
        )
        return {
          total: tipoTickets.length,
          tipoTickets,
        }
      }),
    )
  }
  
  crearTipoTicket(formData: TipoTicket) {
    return this.http.post(`${base_url}/tipoTicket`, formData, this.headers)
  }


  isActivedTipoTicket(tipoTicket: TipoTicket) {
    const url = `${base_url}/tipoTicket/isActive/${tipoTicket.uid}`
    const data = {
      ...tipoTicket,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoTicket(tipoTicket: TipoTicket) {
    
    const url = `${base_url}/tipoTicket/${tipoTicket.uid}`
    const data = {
      ...tipoTicket,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoTicketById(id: string) {
    const url = `${base_url}/tipoTicket/${id}`
    return this.http.get<CargarTipoTicket>(url, this.headers)
  }
  cargarTipoTicketByClave(clave: string) {
    const url = `${base_url}/tipoTicket/clave/${clave}`
    return this.http.get<CargarTipoTicket>(url, this.headers)
  }

}
