import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoProveedors, CargarTipoProveedor } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { TipoProveedor } from '../models/tipoProveedor.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoProveedorService {

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

 
  cargarTipoProveedorsAll() {
    const url = `${base_url}/tipoProveedor/all`
    return this.http.get<CargarTipoProveedors>(url, this.headers).pipe(
      map((resp) => {
   
        const tipoProveedors = resp.tipoProveedors.map(
          (tipoProveedors) =>
            new TipoProveedor(
              tipoProveedors.nombre,
              tipoProveedors.clave,
              tipoProveedors.activated,
              tipoProveedors.usuarioCreated,
              tipoProveedors.dateCreated,
              tipoProveedors.lastEdited,
              tipoProveedors.uid,

            ),
        )
        return {
          total: tipoProveedors.length,
          tipoProveedors,
        }
      }),
    )
  }
  cargarTipoProveedor() {
    const url = `${base_url}/roles/all/tipoProveedor`
    return this.http.get<CargarTipoProveedors>(url, this.headers).pipe(
      map((resp) => {
        const tipoProveedors = resp.tipoProveedors.map(
          (tipoProveedor) =>
            new Role(
              tipoProveedor.nombre,
              tipoProveedor.clave,
              tipoProveedor.activated,
              tipoProveedor.usuarioCreated,
              tipoProveedor.dateCreated,
              tipoProveedor.lastEdited,
              tipoProveedor.uid,

            ),
        )
        return {
          total: tipoProveedors.length,
          tipoProveedors,
        }
      }),
    )
  }
  
  crearTipoProveedor(formData: TipoProveedor) {
    return this.http.post(`${base_url}/tipoProveedor`, formData, this.headers)
  }


  isActivedTipoProveedor(tipoProveedor: TipoProveedor) {
    const url = `${base_url}/tipoProveedor/isActive/${tipoProveedor.uid}`
    const data = {
      ...tipoProveedor,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoProveedor(tipoProveedor: TipoProveedor) {
    
    const url = `${base_url}/tipoProveedor/${tipoProveedor.uid}`
    const data = {
      ...tipoProveedor,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoProveedorById(id: string) {
    const url = `${base_url}/tipoProveedor/${id}`
    return this.http.get<CargarTipoProveedor>(url, this.headers)
  }
  cargarTipoProveedorByClave(clave: string) {
    const url = `${base_url}/tipoProveedor/clave/${clave}`
    return this.http.get<CargarTipoProveedor>(url, this.headers)
  }

}
