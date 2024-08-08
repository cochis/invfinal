import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarAbastos, CargarAbasto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Abasto } from 'src/app/core/models/abasto.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class AbastosService {

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

  cargarAbastosInit() {
    const url = `${base_url}/abastos/all`
    return this.http.get<CargarAbastos>(url, this.headers).pipe(
      map((resp) => {
        const abastos = resp.abastos.map(
          (abasto) =>
            new Abasto(
              abasto.origen,
              abasto.destino,
              abasto.proveedor,
              abasto.materiaPrima,
              abasto.unidadMedida,
              abasto.cantidadTotal,
              abasto.cantidadOrigenProceso,
              abasto.cantidadDestinoProceso,
              abasto.viajes,
              abasto.finalizado,
              abasto.usuarioCreated,
              abasto.activated,
              abasto.dateCreated,
              abasto.lastEdited,
              abasto.uid,
            ),
        )
        return {
          total: abastos.length,
          abastos,
        }
      }),
    )
  }
  cargarAbastosAll() {
    const url = `${base_url}/abastos/all`
    return this.http.get<CargarAbastos>(url, this.headers).pipe(
      map((resp) => {
        const abastos = resp.abastos.map(
          (abasto) =>
            new Abasto(
              abasto.origen,
              abasto.destino,
              abasto.proveedor,
              abasto.materiaPrima,
              abasto.unidadMedida,
              abasto.cantidadTotal,
              abasto.cantidadOrigenProceso,
              abasto.cantidadDestinoProceso,
              abasto.viajes,
              abasto.finalizado,
              abasto.usuarioCreated,
              abasto.activated,
              abasto.dateCreated,
              abasto.lastEdited,
              abasto.uid,

            ),
        )
        return {
          total: abastos.length,
          abastos,
        }
      }),
    )
  }
 
  crearAbasto(formData: Abasto) {
    return this.http.post(`${base_url}/abastos`, formData, this.headers)
  }


  isActivedAbasto(abasto: Abasto) {
    const url = `${base_url}/abastos/isActive/${abasto.uid}`
    const data = {
      ...abasto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarAbasto(abasto: Abasto) {
   
    const url = `${base_url}/abastos/${abasto.uid}`
    const data = {
      ...abasto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarAbastoById(id: string) {
    const url = `${base_url}/abastos/${id}`
    return this.http.get<CargarAbasto>(url, this.headers)
  }
  cargarAbastoByClave(clave: string) {
    const url = `${base_url}/abastos/clave/${clave}`
    return this.http.get<CargarAbasto>(url, this.headers)
  }

}
