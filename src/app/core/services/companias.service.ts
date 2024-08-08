import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarCompania, CargarCompanias, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Compania } from 'src/app/core/models/compania.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CompaniasService {

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

  cargarCompaniasInit() {
    const url = `${base_url}/companias/all`
    return this.http.get<CargarCompanias>(url, this.headers).pipe(
      map((resp) => {
        const companias = resp.companias.map(
          (compania) =>
            new Compania(
              compania.nombre,
              compania.clave,
              compania.calle,
              compania.ciudad,
              compania.estado,
              compania.pais,
              compania.codigoPostal,
              compania.activated,
              compania.usuarioCreated,
              compania.dateCreated,
              compania.lastEdited,
              compania.uid,

            ),
        )
        return {
          total: companias.length,
          companias,
        }
      }),
    )
  }
  cargarCompaniasAll() {
    const url = `${base_url}/companias/all`
    return this.http.get<CargarCompanias>(url, this.headers).pipe(
      map((resp) => {
        const companias = resp.companias.map(
          (compania) =>
            new Compania(
              compania.nombre,
              compania.clave,
              compania.calle,
              compania.ciudad,
              compania.estado,
              compania.pais,
              compania.codigoPostal,
              compania.activated,
              compania.usuarioCreated,
              compania.dateCreated,
              compania.lastEdited,
              compania.uid,

            ),
        )
        return {
          total: companias.length,
          companias,
        }
      }),
    )
  }
  cargarCompaniasSalon() {
    const url = `${base_url}/companias/all/salon`
    return this.http.get<CargarCompanias>(url, this.headers).pipe(
      map((resp) => {
        const companias = resp.companias.map(
          (compania) =>
          new Compania(
            compania.nombre,
            compania.clave,
            compania.calle,
            compania.ciudad,
            compania.estado,
            compania.pais,
            compania.codigoPostal,
            compania.activated,
            compania.usuarioCreated,
            compania.dateCreated,
            compania.lastEdited,
            compania.uid,

          ),
        )
        return {
          total: companias.length,
          companias,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarCompanias>(url, this.headers).pipe(
      map((resp) => {
        const companias = resp.companias.map(
          (compania) =>
            new Compania(
              compania.nombre,
              compania.clave,
              compania.calle,
              compania.ciudad,
              compania.estado,
              compania.pais,
              compania.codigoPostal,
              compania.activated,
              compania.usuarioCreated,
              compania.dateCreated,
              compania.lastEdited,
              compania.uid,

            ),
        )
        return {
          total: companias.length,
          companias,
        }
      }),
    )
  }
  crearCompania(formData: Compania) {
    return this.http.post(`${base_url}/companias`, formData, this.headers)
  }


  isActivedCompania(compania: Compania) {
    const url = `${base_url}/companias/isActive/${compania.uid}`
    const data = {
      ...compania,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCompania(compania: Compania) {
    const url = `${base_url}/companias/${compania.uid}`
    const data = {
      ...compania,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCompaniaById(id: string) {
    const url = `${base_url}/companias/${id}`
    return this.http.get<CargarCompania>(url, this.headers)
  }
  cargarCompaniaByClave(clave: string) {
    const url = `${base_url}/companias/clave/${clave}`
    return this.http.get<CargarCompania>(url, this.headers)
  }

}
