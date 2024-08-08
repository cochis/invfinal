import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarZonas, CargarZona } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Zona } from 'src/app/core/models/zona.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ZonasService {

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

  cargarZonasAll() {
    const url = `${base_url}/zona/all`
    return this.http.get<CargarZonas>(url, this.headers).pipe(
      map((resp) => {
        const zonas = resp.zonas.map(
          (zona) =>
            new Zona(
              zona.nombre,
              zona.descripcion,
              zona.clave,
              zona.img,
              zona.usuarioCreated,
              zona.activated,
              zona.dateCreated,
              zona.lastEdited,
              zona.uid,

            ),
        )
        return {
          total: zonas.length,
          zonas,
        }
      }),
    )
  }
 
  crearZona(formData: Zona) {
    return this.http.post(`${base_url}/zona`, formData, this.headers)
  }


  isActivedZona(zona: Zona) {
    const url = `${base_url}/zona/isActive/${zona.uid}`

    const data = {
      ...zona,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarZona(zona: Zona) {
    const url = `${base_url}/zona/${zona.uid}`
    const data = {
      ...zona,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(zona: Zona) {
    const url = `${base_url}/zona/pass/${zona.uid}`
    const data = {
      ...zona,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarZonaById(id: string) {
    const url = `${base_url}/zona/${id}`
    return this.http.get<CargarZona>(url, this.headers)
  }
  cargarZonaByEmail(email: string) {

    const url = `${base_url}/zona/email/${email}`

    return this.http.get<CargarZonas>(url, this.headers)
  }

}
