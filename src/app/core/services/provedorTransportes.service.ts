import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarProveedorTransporte, CargarProveedorTransportes, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { ProveedorTransporte } from 'src/app/core/models/proveedorTransporte.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ProveedorTransportesService {

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

  cargarProveedorTransportesInit() {
    const url = `${base_url}/proveedorTransportes/all`
    return this.http.get<CargarProveedorTransportes>(url, this.headers).pipe(
      map((resp) => {
        const proveedorTransportes = resp.proveedorTransportes.map(
          (rol) =>
            new ProveedorTransporte(
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
          total: proveedorTransportes.length,
          proveedorTransportes,
        }
      }),
    )
  }
  cargarProveedorTransportesAll() {
    const url = `${base_url}/proveedorTransportes/all`
    return this.http.get<CargarProveedorTransportes>(url, this.headers).pipe(
      map((resp) => {
        const proveedorTransportes = resp.proveedorTransportes.map(
          (rol) =>
            new ProveedorTransporte(
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
          total: proveedorTransportes.length,
          proveedorTransportes,
        }
      }),
    )
  }
  cargarProveedorTransportesSalon() {
    const url = `${base_url}/proveedorTransportes/all/salon`
    return this.http.get<CargarProveedorTransportes>(url, this.headers).pipe(
      map((resp) => {
        const proveedorTransportes = resp.proveedorTransportes.map(
          (rol) =>
            new ProveedorTransporte(
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
          total: proveedorTransportes.length,
          proveedorTransportes,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarProveedorTransportes>(url, this.headers).pipe(
      map((resp) => {
        const proveedorTransportes = resp.proveedorTransportes.map(
          (rol) =>
            new ProveedorTransporte(
              rol.nombre,
              rol.clave,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: proveedorTransportes.length,
          proveedorTransportes,
        }
      }),
    )
  }
  crearProveedorTransporte(formData: ProveedorTransporte) {
    return this.http.post(`${base_url}/proveedorTransportes`, formData, this.headers)
  }


  isActivedProveedorTransporte(proveedorTransporte: ProveedorTransporte) {
    const url = `${base_url}/proveedorTransportes/isActive/${proveedorTransporte.uid}`
    const data = {
      ...proveedorTransporte,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarProveedorTransporte(proveedorTransporte: ProveedorTransporte) {
    const url = `${base_url}/proveedorTransportes/${proveedorTransporte.uid}`
    const data = {
      ...proveedorTransporte,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarProveedorTransporteById(id: string) {
    const url = `${base_url}/proveedorTransportes/${id}`
    return this.http.get<CargarProveedorTransporte>(url, this.headers)
  }
  cargarProveedorTransporteByClave(clave: string) {
    const url = `${base_url}/proveedorTransportes/clave/${clave}`
    return this.http.get<CargarProveedorTransporte>(url, this.headers)
  }

}
