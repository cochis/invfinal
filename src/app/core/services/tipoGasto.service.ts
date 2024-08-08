import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoGastos, CargarTipoGasto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { TipoGasto } from '../models/tipoGasto.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoGastoService {

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


  cargarTipoGastosAll() {
    const url = `${base_url}/tipoGasto/all`
    return this.http.get<CargarTipoGastos>(url, this.headers).pipe(
      map((resp) => {

        const tipoGastos = resp.tipoGastos.map(
          (tipoGastos) =>
            new TipoGasto(
              tipoGastos.empresa,
              tipoGastos.nombre,
              tipoGastos.clave,
              tipoGastos.aprobacionPor,
              tipoGastos.activated,
              tipoGastos.usuarioCreated,
              tipoGastos.dateCreated,
              tipoGastos.lastEdited,
              tipoGastos.uid,

            ),
        )
        return {
          total: tipoGastos.length,
          tipoGastos,
        }
      }),
    )
  }
  cargarTipoGasto() {
    const url = `${base_url}/roles/all/tipoGasto`
    return this.http.get<CargarTipoGastos>(url, this.headers).pipe(
      map((resp) => {
        const tipoGastos = resp.tipoGastos.map(
          (tipoGasto) =>
            new TipoGasto(
              tipoGastos.empresa,
              tipoGasto.nombre,
              tipoGasto.clave,
              tipoGasto.aprobacionPor,
              tipoGasto.activated,
              tipoGasto.usuarioCreated,
              tipoGasto.dateCreated,
              tipoGasto.lastEdited,
              tipoGasto.uid,
            ),
        )
        return {
          total: tipoGastos.length,
          tipoGastos,
        }
      }),
    )
  }

  crearTipoGasto(formData: any) {
    return this.http.post(`${base_url}/tipoGasto`, formData, this.headers)
  }


  isActivedTipoGasto(tipoGasto: TipoGasto) {
    const url = `${base_url}/tipoGasto/isActive/${tipoGasto.uid}`
    const data = {
      ...tipoGasto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoGasto(tipoGasto: TipoGasto) {

    const url = `${base_url}/tipoGasto/${tipoGasto.uid}`
    const data = {
      ...tipoGasto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoGastoById(id: string) {
    const url = `${base_url}/tipoGasto/${id}`
    return this.http.get<CargarTipoGasto>(url, this.headers)
  }
  cargarTipoGastoByClave(clave: string) {
    const url = `${base_url}/tipoGasto/clave/${clave}`
    return this.http.get<CargarTipoGasto>(url, this.headers)
  }

}
