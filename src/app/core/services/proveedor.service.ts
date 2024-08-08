import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarProveedors, CargarProveedor } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Proveedor } from '../models/proveedor.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ProveedorsService {

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

  cargarProveedorsAll() {
    const url = `${base_url}/proveedor/all`
    return this.http.get<CargarProveedors>(url, this.headers).pipe(
      map((resp) => {
        const proveedors = resp.proveedors.map(
          (proveedor) =>
            new Proveedor(
              proveedor.clave,
              proveedor.nombreEmpresa,
              proveedor.nombreRepresentante,
              proveedor.materiaPrimas,
              proveedor.actividadEconomica,
              proveedor.rfc,
              proveedor.direccionFiscal,
              proveedor.estado,
              proveedor.municipio,
              proveedor.codigoPostal,
              proveedor.telefono,
              proveedor.correo,
              proveedor.incoterm,
              proveedor.img,
              proveedor.activated,
              proveedor.usuarioCreated,
              proveedor.dateCreated,
              proveedor.lastEdited,
              proveedor.uid,

            ),
        )
        return {
          total: proveedors.length,
          proveedors,
        }
      }),
    )
  }
 
  crearProveedor(formData: Proveedor) {
    return this.http.post(`${base_url}/proveedor`, formData, this.headers)
  }


  isActivedProveedor(proveedor: Proveedor) {
    const url = `${base_url}/proveedor/isActive/${proveedor.uid}`

    const data = {
      ...proveedor,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarProveedor(proveedor: Proveedor) {
    const url = `${base_url}/proveedor/${proveedor.uid}`
    const data = {
      ...proveedor,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(proveedor: Proveedor) {
    const url = `${base_url}/proveedor/pass/${proveedor.uid}`
    const data = {
      ...proveedor,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarProveedorById(id: string) {
    const url = `${base_url}/proveedor/${id}`
    return this.http.get<CargarProveedor>(url, this.headers)
  }
  cargarProveedorByEmail(email: string) {

    const url = `${base_url}/proveedor/email/${email}`

    return this.http.get<CargarProveedor>(url, this.headers)
  }

}
