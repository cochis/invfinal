import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarProveedorLoop, CargarProveedorLoops, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ProveedorLoopsService {

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

  cargarProveedorLoopsInit() {
    const url = `${base_url}/proveedor-loop/all`
    return this.http.get<CargarProveedorLoops>(url, this.headers).pipe(
      map((resp) => {
        const proveedorLoops = resp.proveedorLoops.map(
          (proveedorLoop) =>
            new ProveedorLoop(
              proveedorLoop.taxId,
              proveedorLoop.name,
              proveedorLoop.pais,
              proveedorLoop.activated,
              proveedorLoop.usuarioCreated,
              proveedorLoop.dateCreated,
              proveedorLoop.lastEdited,
              proveedorLoop.uid,

            ),
        )
        return {
          total: proveedorLoops.length,
          proveedorLoops,
        }
      }),
    )
  }
  cargarProveedorLoopsAll() {
    const url = `${base_url}/proveedor-loop/all`
    return this.http.get<CargarProveedorLoops>(url, this.headers).pipe(
      map((resp) => {
        const proveedorLoops = resp.proveedorLoops.map(
          (proveedorLoop) =>
            new ProveedorLoop(
              proveedorLoop.taxId,
              proveedorLoop.name,
              proveedorLoop.pais,
              proveedorLoop.activated,
              proveedorLoop.usuarioCreated,
              proveedorLoop.dateCreated,
              proveedorLoop.lastEdited,
              proveedorLoop.uid,

            ),
        )
        return {
          total: proveedorLoops.length,
          proveedorLoops,
        }
      }),
    )
  }
  cargarProveedorLoopsSalon() {
    const url = `${base_url}/proveedor-loop/all/salon`
    return this.http.get<CargarProveedorLoops>(url, this.headers).pipe(
      map((resp) => {
        const proveedorLoops = resp.proveedorLoops.map(
          (proveedorLoop) =>
            new ProveedorLoop(
              proveedorLoop.taxId,
              proveedorLoop.name,
              proveedorLoop.pais,
              proveedorLoop.activated,
              proveedorLoop.usuarioCreated,
              proveedorLoop.dateCreated,
              proveedorLoop.lastEdited,
              proveedorLoop.uid,

            ),
        )
        return {
          total: proveedorLoops.length,
          proveedorLoops,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarProveedorLoops>(url, this.headers).pipe(
      map((resp) => {
        const proveedorLoops = resp.proveedorLoops.map(
          (proveedorLoop) =>
            new ProveedorLoop(
              proveedorLoop.taxId,
              proveedorLoop.name,
              proveedorLoop.pais,
              proveedorLoop.activated,
              proveedorLoop.usuarioCreated,
              proveedorLoop.dateCreated,
              proveedorLoop.lastEdited,
              proveedorLoop.uid,
            ),
        )
        return {
          total: proveedorLoops.length,
          proveedorLoops,
        }
      }),
    )
  }
  crearProveedorLoop(formData: ProveedorLoop) {
    return this.http.post(`${base_url}/proveedor-loop`, formData, this.headers)
  }
  crearMasivaProveedorLoop(formData: ProveedorLoop) {
    return this.http.post(`${base_url}/proveedor-loop/masiva`, formData, this.headers)
  }


  isActivedProveedorLoop(proveedorLoop: ProveedorLoop) {
    const url = `${base_url}/proveedor-loop/isActive/${proveedorLoop.uid}`
    const data = {
      ...proveedorLoop,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarProveedorLoop(proveedorLoop: ProveedorLoop) {
    const url = `${base_url}/proveedor-loop/${proveedorLoop.uid}`
    const data = {
      ...proveedorLoop,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarProveedorLoopById(id: string) {
    const url = `${base_url}/proveedor-loop/${id}`
    return this.http.get<CargarProveedorLoop>(url, this.headers)
  }
  cargarProveedorLoopByClave(clave: string) {
    const url = `${base_url}/proveedor-loop/clave/${clave}`
    return this.http.get<CargarProveedorLoop>(url, this.headers)
  }

}
