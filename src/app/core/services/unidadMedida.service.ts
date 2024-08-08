import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarUnidadMedida, CargarUnidadMedidas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class UnidadMedidasService {

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

  cargarUnidadMedidasInit() {
    const url = `${base_url}/unidadMedidas/all`
    return this.http.get<CargarUnidadMedidas>(url, this.headers).pipe(
      map((resp) => {
        const unidadMedidas = resp.unidadMedidas.map(
          (rol) =>
            new UnidadMedida(
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
          total: unidadMedidas.length,
          unidadMedidas,
        }
      }),
    )
  }
  cargarUnidadMedidasAll() {
    const url = `${base_url}/unidadMedidas/all`
    return this.http.get<CargarUnidadMedidas>(url, this.headers).pipe(
      map((resp) => {
        const unidadMedidas = resp.unidadMedidas.map(
          (rol) =>
            new UnidadMedida(
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
          total: unidadMedidas.length,
          unidadMedidas,
        }
      }),
    )
  }
  cargarUnidadMedidasSalon() {
    const url = `${base_url}/unidadMedidas/all/salon`
    return this.http.get<CargarUnidadMedidas>(url, this.headers).pipe(
      map((resp) => {
        const unidadMedidas = resp.unidadMedidas.map(
          (rol) =>
            new UnidadMedida(
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
          total: unidadMedidas.length,
          unidadMedidas,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarUnidadMedidas>(url, this.headers).pipe(
      map((resp) => {
        const unidadMedidas = resp.unidadMedidas.map(
          (rol) =>
            new UnidadMedida(
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
          total: unidadMedidas.length,
          unidadMedidas,
        }
      }),
    )
  }
  crearUnidadMedida(formData: UnidadMedida) {
    return this.http.post(`${base_url}/unidadMedidas`, formData, this.headers)
  }


  isActivedUnidadMedida(unidadMedida: UnidadMedida) {
    const url = `${base_url}/unidadMedidas/isActive/${unidadMedida.uid}`
    const data = {
      ...unidadMedida,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarUnidadMedida(unidadMedida: UnidadMedida) {
    const url = `${base_url}/unidadMedidas/${unidadMedida.uid}`
    const data = {
      ...unidadMedida,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarUnidadMedidaById(id: string) {
    const url = `${base_url}/unidadMedidas/${id}`
    return this.http.get<CargarUnidadMedida>(url, this.headers)
  }
  cargarUnidadMedidaByClave(clave: string) {
    const url = `${base_url}/unidadMedidas/clave/${clave}`
    return this.http.get<CargarUnidadMedida>(url, this.headers)
  }

}
