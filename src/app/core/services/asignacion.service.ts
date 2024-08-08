import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarAsignacions, CargarAsignacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Asignacion } from 'src/app/core/models/asignacion.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class AsignacionsService {

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

  cargarAsignacionsAll() {
    const url = `${base_url}/asignacion/all`
    return this.http.get<CargarAsignacions>(url, this.headers).pipe(
      map((resp) => {
        const asignacions = resp.asignacions.map(
          (asignacion) =>
            new Asignacion(
              
              asignacion.stock,
              asignacion.usuario,
              asignacion.estadoEntrega,
              asignacion.imgEntrega,
              asignacion.descripcionEntrega,
              asignacion.aceptacion,
              asignacion.quienEntrego,
              asignacion.estadoRegreso,
              asignacion.imgRegreso,
              asignacion.descripcionRegreso,
              asignacion.aceptacionRegreso,
              asignacion.quienRecibio,
              asignacion.activated,
              asignacion.usuarioCreated,
              asignacion.dateCreated,
              asignacion.lastEdited,
              asignacion.uid,

            ),
        )
        return {
          total: asignacions.length,
          asignacions,
        }
      }),
    )
  }
 
  crearAsignacion(formData: Asignacion) {
    return this.http.post(`${base_url}/asignacion`, formData, this.headers)
  }


  isActivedAsignacion(asignacion: Asignacion) {
    const url = `${base_url}/asignacion/isActive/${asignacion.uid}`

    const data = {
      ...asignacion,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarAsignacion(asignacion: Asignacion) {
    const url = `${base_url}/asignacion/${asignacion.uid}`
    const data = {
      ...asignacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(asignacion: Asignacion) {
    const url = `${base_url}/asignacion/pass/${asignacion.uid}`
    const data = {
      ...asignacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarAsignacionById(id: string) {
    const url = `${base_url}/asignacion/${id}`
    return this.http.get<CargarAsignacion>(url, this.headers)
  }
  cargarAsignacionByEmail(email: string) {

    const url = `${base_url}/asignacion/email/${email}`

    return this.http.get<CargarAsignacions>(url, this.headers)
  }

}
