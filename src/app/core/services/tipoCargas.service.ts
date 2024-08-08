import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoCargas, CargarTipoCarga } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { TipoCarga } from 'src/app/core/models/tipoCarga.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoCargasService {

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

 
  cargarTipoCargasAll() {
    const url = `${base_url}/tipoCarga/all`
   
    return this.http.get<CargarTipoCargas>(url, this.headers).pipe(
      map((resp) => {
        const tipoCargas = resp.tipoCargas.map(
          (rol) =>
            new TipoCarga(
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
          total: tipoCargas.length,
          tipoCargas,
        }
      }),
    )
  }
  
 
  crearTipoCarga(formData: TipoCarga) {
    return this.http.post(`${base_url}/tipoCarga`, formData, this.headers)
  }


  isActivedCarga(tipoCarga: TipoCarga) {
    const url = `${base_url}/tipoCarga/isActive/${tipoCarga.uid}`
    const data = {
      ...tipoCarga,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCarga(tipoCarga: TipoCarga) {
    const url = `${base_url}/tipoCarga/${tipoCarga.uid}`
    const data = {
      ...tipoCarga,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCargaById(id: string) {
    const url = `${base_url}/tipoCarga/${id}`
    return this.http.get<CargarTipoCarga>(url, this.headers)
  }
  cargarCargaByClave(clave: string) {
    const url = `${base_url}/tipoCarga/clave/${clave}`
    return this.http.get<CargarTipoCarga>(url, this.headers)
  }

}
