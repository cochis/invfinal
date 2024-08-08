import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTerminoPagos, CargarTerminoPago } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { TerminoPago } from '../models/terminoPago.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TerminoPagoService {

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


  cargarTerminoPagosAll() {
    const url = `${base_url}/terminoPago/all`
    return this.http.get<CargarTerminoPagos>(url, this.headers).pipe(
      map((resp) => {

        const terminoPagos = resp.terminoPagos.map(
          (terminoPagos) =>
            new TerminoPago(
              terminoPagos.empresa,
              terminoPagos.nombre,
              terminoPagos.clave,
              terminoPagos.activated,
              terminoPagos.usuarioCreated,
              terminoPagos.dateCreated,
              terminoPagos.lastEdited,
              terminoPagos.uid,

            ),
        )
        return {
          total: terminoPagos.length,
          terminoPagos,
        }
      }),
    )
  }


  crearTerminoPago(formData: any) {
    return this.http.post(`${base_url}/terminoPago`, formData, this.headers)
  }


  isActivedTerminoPago(terminoPago: TerminoPago) {
    const url = `${base_url}/terminoPago/isActive/${terminoPago.uid}`
    const data = {
      ...terminoPago,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTerminoPago(terminoPago: TerminoPago) {

    const url = `${base_url}/terminoPago/${terminoPago.uid}`
    const data = {
      ...terminoPago,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTerminoPagoById(id: string) {
    const url = `${base_url}/terminoPago/${id}`
    return this.http.get<CargarTerminoPago>(url, this.headers)
  }
  cargarTerminoPagoByClave(clave: string) {
    const url = `${base_url}/terminoPago/clave/${clave}`
    return this.http.get<CargarTerminoPago>(url, this.headers)
  }

}
