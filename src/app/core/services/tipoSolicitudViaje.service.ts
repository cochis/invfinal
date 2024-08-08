import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoSolicitudViajes, CargarTipoSolicitudViaje } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { TipoSolicitudViaje } from 'src/app/core/models/tipoSolicitudViaje.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoSolicitudViajesService {

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

 
  cargarTipoSolicitudViajesAll() {
    const url = `${base_url}/tipoSolicitudViaje/all`
   
    return this.http.get<CargarTipoSolicitudViajes>(url, this.headers).pipe(
      map((resp) => {
        const tipoSolicitudViajes = resp.tipoSolicitudViajes.map(
          (rol) =>
            new TipoSolicitudViaje(
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
          total: tipoSolicitudViajes.length,
          tipoSolicitudViajes,
        }
      }),
    )
  }
  
 
  crearTipoSolicitudViaje(formData: TipoSolicitudViaje) {
    return this.http.post(`${base_url}/tipoSolicitudViaje`, formData, this.headers)
  }


  isActivedCarga(tipoSolicitudViaje: TipoSolicitudViaje) {
    const url = `${base_url}/tipoSolicitudViaje/isActive/${tipoSolicitudViaje.uid}`
    const data = {
      ...tipoSolicitudViaje,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCarga(tipoSolicitudViaje: TipoSolicitudViaje) {
    const url = `${base_url}/tipoSolicitudViaje/${tipoSolicitudViaje.uid}`
    const data = {
      ...tipoSolicitudViaje,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCargaById(id: string) {
    const url = `${base_url}/tipoSolicitudViaje/${id}`
    return this.http.get<CargarTipoSolicitudViaje>(url, this.headers)
  }
  cargarCargaByClave(clave: string) {
    const url = `${base_url}/tipoSolicitudViaje/clave/${clave}`
    return this.http.get<CargarTipoSolicitudViaje>(url, this.headers)
  }

}
