import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarCargas, CargarCarga } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Carga } from 'src/app/core/models/carga.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CargasService {

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

  cargarCargasInit() {
    const url = `${base_url}/cargas/all`
    return this.http.get<CargarCargas>(url, this.headers).pipe(
      map((resp) => {
        const cargas = resp.cargas.map(
          (rol) =>
            new Carga(
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
          total: cargas.length,
          cargas,
        }
      }),
    )
  }
  cargarCargasAll() {
    const url = `${base_url}/cargas/all`
    
    return this.http.get<CargarCargas>(url, this.headers).pipe(
      map((resp) => {
        const cargas = resp.cargas.map(
          (rol) =>
            new Carga(
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
          total: cargas.length,
          cargas,
        }
      }),
    )
  }
  cargarCargasSalon() {
    const url = `${base_url}/cargas/all/salon`
    return this.http.get<CargarCargas>(url, this.headers).pipe(
      map((resp) => {
        const cargas = resp.cargas.map(
          (rol) =>
            new Carga(
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
          total: cargas.length,
          cargas,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarCargas>(url, this.headers).pipe(
      map((resp) => {
        const cargas = resp.cargas.map(
          (rol) =>
            new Carga(
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
          total: cargas.length,
          cargas,
        }
      }),
    )
  }
  crearCarga(formData: Carga) {
    return this.http.post(`${base_url}/cargas`, formData, this.headers)
  }


  isActivedCarga(carga: Carga) {
    const url = `${base_url}/cargas/isActive/${carga.uid}`
    const data = {
      ...carga,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCarga(carga: Carga) {
    const url = `${base_url}/cargas/${carga.uid}`
    const data = {
      ...carga,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCargaById(id: string) {
    const url = `${base_url}/cargas/${id}`
    return this.http.get<CargarCarga>(url, this.headers)
  }
  cargarCargaByClave(clave: string) {
    const url = `${base_url}/cargas/clave/${clave}`
    return this.http.get<CargarCarga>(url, this.headers)
  }

}
