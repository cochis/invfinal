import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarSubsidiarias, CargarSubsidiaria } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { Subsidiaria } from '../models/subsidiaria.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class SubsidiariaService {

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


  cargarSubsidiariasAll() {
    const url = `${base_url}/subsidiaria/all`
    return this.http.get<CargarSubsidiarias>(url, this.headers).pipe(
      map((resp) => {

        const subsidiarias = resp.subsidiarias.map(
          (subsidiarias) =>
            new Subsidiaria(
              subsidiarias.empresa,
              subsidiarias.nombre,
              subsidiarias.clave,
              subsidiarias.activated,
              subsidiarias.usuarioCreated,
              subsidiarias.dateCreated,
              subsidiarias.lastEdited,
              subsidiarias.uid,

            ),
        )
        return {
          total: subsidiarias.length,
          subsidiarias,
        }
      }),
    )
  }
  cargarSubsidiaria() {
    const url = `${base_url}/roles/all/subsidiaria`
    return this.http.get<CargarSubsidiarias>(url, this.headers).pipe(
      map((resp) => {
        const subsidiarias = resp.subsidiarias.map(
          (subsidiaria) =>
            new Role(
              subsidiaria.nombre,
              subsidiaria.clave,
              subsidiaria.activated,
              subsidiaria.usuarioCreated,
              subsidiaria.dateCreated,
              subsidiaria.lastEdited,
              subsidiaria.uid,

            ),
        )
        return {
          total: subsidiarias.length,
          subsidiarias,
        }
      }),
    )
  }

  crearSubsidiaria(formData: any) {
    return this.http.post(`${base_url}/subsidiaria`, formData, this.headers)
  }


  isActivedSubsidiaria(subsidiaria: Subsidiaria) {
    const url = `${base_url}/subsidiaria/isActive/${subsidiaria.uid}`
    const data = {
      ...subsidiaria,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarSubsidiaria(subsidiaria: Subsidiaria) {

    const url = `${base_url}/subsidiaria/${subsidiaria.uid}`
    const data = {
      ...subsidiaria,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarSubsidiariaById(id: string) {
    const url = `${base_url}/subsidiaria/${id}`
    return this.http.get<CargarSubsidiaria>(url, this.headers)
  }
  cargarSubsidiariaByClave(clave: string) {
    const url = `${base_url}/subsidiaria/clave/${clave}`
    return this.http.get<CargarSubsidiaria>(url, this.headers)
  }

}
