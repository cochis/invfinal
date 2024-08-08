import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarDestino, CargarDestinos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Destino } from 'src/app/core/models/destino.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class DestinosService {

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

  cargarDestinosInit() {
    const url = `${base_url}/destinos/all`
    return this.http.get<CargarDestinos>(url, this.headers).pipe(
      map((resp) => {
        const destinos = resp.destinos.map(
          (rol) =>
            new Destino(
              rol.nombre,
              rol.clave,
              rol.activated,
              rol.usuarioCreated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: destinos.length,
          destinos,
        }
      }),
    )
  }
  cargarDestinosAll() {
    const url = `${base_url}/destinos/all`
    return this.http.get<CargarDestinos>(url, this.headers).pipe(
      map((resp) => {
        const destinos = resp.destinos.map(
          (rol) =>
            new Destino(
              rol.nombre,
              rol.clave,
              rol.activated,
              rol.usuarioCreated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: destinos.length,
          destinos,
        }
      }),
    )
  }
  cargarDestinosSalon() {
    const url = `${base_url}/destinos/all/salon`
    return this.http.get<CargarDestinos>(url, this.headers).pipe(
      map((resp) => {
        const destinos = resp.destinos.map(
          (rol) =>
            new Destino(
              rol.nombre,
              rol.clave,
              rol.activated,
              rol.usuarioCreated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: destinos.length,
          destinos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarDestinos>(url, this.headers).pipe(
      map((resp) => {
        const destinos = resp.destinos.map(
          (rol) =>
            new Destino(
              rol.nombre,
              rol.clave,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: destinos.length,
          destinos,
        }
      }),
    )
  }
  crearDestino(formData: Destino) {
    return this.http.post(`${base_url}/destinos`, formData, this.headers)
  }


  isActivedDestino(destino: Destino) {
    const url = `${base_url}/destinos/isActive/${destino.uid}`
    const data = {
      ...destino,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarDestino(destino: Destino) {
    const url = `${base_url}/destinos/${destino.uid}`
    const data = {
      ...destino,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarDestinoById(id: string) {
    const url = `${base_url}/destinos/${id}`
    return this.http.get<CargarDestino>(url, this.headers)
  }
  cargarDestinoByClave(clave: string) {
    const url = `${base_url}/destinos/clave/${clave}`
    return this.http.get<CargarDestino>(url, this.headers)
  }

}
