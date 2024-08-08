import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoFacturas, CargarTipoFactura } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { TipoFactura } from '../models/tipoFactura.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoFacturaService {

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

 
  cargarTipoFacturasAll() {
    const url = `${base_url}/tipoFactura/all`
    return this.http.get<CargarTipoFacturas>(url, this.headers).pipe(
      map((resp) => {
   
        const tipoFacturas = resp.tipoFacturas.map(
          (tipoFacturas) =>
            new TipoFactura(
              tipoFacturas.nombre,
              tipoFacturas.clave,
              
              tipoFacturas.activated,
              tipoFacturas.usuarioCreated,
              tipoFacturas.dateCreated,
              tipoFacturas.lastEdited,
              tipoFacturas.uid,

            ),
        )
        return {
          total: tipoFacturas.length,
          tipoFacturas,
        }
      }),
    )
  }
  cargarTipoFactura() {
    const url = `${base_url}/roles/all/tipoFactura`
    return this.http.get<CargarTipoFacturas>(url, this.headers).pipe(
      map((resp) => {
        const tipoFacturas = resp.tipoFacturas.map(
          (tipoFactura) =>
            new TipoFactura(
              tipoFactura.nombre,
              tipoFactura.clave,
            
              tipoFactura.activated,
              tipoFactura.usuarioCreated,
              tipoFactura.dateCreated,
              tipoFactura.lastEdited,
              tipoFactura.uid,
            ),
        )
        return {
          total: tipoFacturas.length,
          tipoFacturas,
        }
      }),
    )
  }
  
  crearTipoFactura(formData: any) {
    return this.http.post(`${base_url}/tipoFactura`, formData, this.headers)
  }


  isActivedTipoFactura(tipoFactura: TipoFactura) {
    const url = `${base_url}/tipoFactura/isActive/${tipoFactura.uid}`
    const data = {
      ...tipoFactura,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoFactura(tipoFactura: TipoFactura) {
    
    const url = `${base_url}/tipoFactura/${tipoFactura.uid}`
    const data = {
      ...tipoFactura,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoFacturaById(id: string) {
    const url = `${base_url}/tipoFactura/${id}`
    return this.http.get<CargarTipoFactura>(url, this.headers)
  }
  cargarTipoFacturaByClave(clave: string) {
    const url = `${base_url}/tipoFactura/clave/${clave}`
    return this.http.get<CargarTipoFactura>(url, this.headers)
  }

}
