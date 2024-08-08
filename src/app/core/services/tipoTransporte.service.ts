import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoTransportes, CargarTipoTransporte } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { TipoTransporte } from 'src/app/core/models/tipoTransporte.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoTransportesService {

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

 
  cargarTipoTransportesAll() {
    const url = `${base_url}/tipoTransporte/all`
   
    return this.http.get<CargarTipoTransportes>(url, this.headers).pipe(
      map((resp) => {
        const tipoTransportes = resp.tipoTransportes.map(
          (rol) =>
            new TipoTransporte(
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
          total: tipoTransportes.length,
          tipoTransportes,
        }
      }),
    )
  }
  
 
  crearTipoTransporte(formData: TipoTransporte) {
    return this.http.post(`${base_url}/tipoTransporte`, formData, this.headers)
  }


  isActivedCarga(tipoTransporte: TipoTransporte) {
    const url = `${base_url}/tipoTransporte/isActive/${tipoTransporte.uid}`
    const data = {
      ...tipoTransporte,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCarga(tipoTransporte: TipoTransporte) {
    const url = `${base_url}/tipoTransporte/${tipoTransporte.uid}`
    const data = {
      ...tipoTransporte,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCargaById(id: string) {
    const url = `${base_url}/tipoTransporte/${id}`
    return this.http.get<CargarTipoTransporte>(url, this.headers)
  }
  cargarCargaByClave(clave: string) {
    const url = `${base_url}/tipoTransporte/clave/${clave}`
    return this.http.get<CargarTipoTransporte>(url, this.headers)
  }

}
