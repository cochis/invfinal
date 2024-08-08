import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarOrigen, CargarOrigens, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Origen } from 'src/app/core/models/origen.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class OrigensService {

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

  cargarOrigensInit() {
    const url = `${base_url}/origens/all`
    return this.http.get<CargarOrigens>(url, this.headers).pipe(
      map((resp) => {
        const origens = resp.origens.map(
          (rol) =>
            new Origen(
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
          total: origens.length,
          origens,
        }
      }),
    )
  }
  cargarOrigensAll() {
    const url = `${base_url}/origens/all`
    return this.http.get<CargarOrigens>(url, this.headers).pipe(
      map((resp) => {
        const origens = resp.origens.map(
          (rol) =>
            new Origen(
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
          total: origens.length,
          origens,
        }
      }),
    )
  }
  cargarOrigensSalon() {
    const url = `${base_url}/origens/all/salon`
    return this.http.get<CargarOrigens>(url, this.headers).pipe(
      map((resp) => {
        const origens = resp.origens.map(
          (rol) =>
            new Origen(
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
          total: origens.length,
          origens,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarOrigens>(url, this.headers).pipe(
      map((resp) => {
        const origens = resp.origens.map(
          (rol) =>
            new Origen(
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
          total: origens.length,
          origens,
        }
      }),
    )
  }
  crearOrigen(formData: Origen) {
    return this.http.post(`${base_url}/origens`, formData, this.headers)
  }


  isActivedOrigen(origen: Origen) {
    const url = `${base_url}/origens/isActive/${origen.uid}`
    const data = {
      ...origen,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarOrigen(origen: Origen) {
    const url = `${base_url}/origens/${origen.uid}`
    const data = {
      ...origen,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarOrigenById(id: string) {
    const url = `${base_url}/origens/${id}`
    return this.http.get<CargarOrigen>(url, this.headers)
  }
  cargarOrigenByClave(clave: string) {
    const url = `${base_url}/origens/clave/${clave}`
    return this.http.get<CargarOrigen>(url, this.headers)
  }

}
