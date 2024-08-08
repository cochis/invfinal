import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarDepartamento, CargarDepartamentos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Departamento } from '../models/departamento.model';
 ;
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

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

  cargarDepartamentosInit() {
    const url = `${base_url}/departamentos/all`
    return this.http.get<CargarDepartamentos>(url, this.headers).pipe(
      map((resp) => {
        const departamentos = resp.departamentos.map(
          (departamento) =>
            new Departamento(
              departamento.nombre,
              departamento.descripcion,
              departamento.clave,
              departamento.activated,
              departamento.usuarioCreated,
              departamento.dateCreated,
              departamento.lastEdited,
              departamento.uid,

            ),
        )
        return {
          total: departamentos.length,
          departamentos,
        }
      }),
    )
  }
  cargarDepartamentosAll() {
    const url = `${base_url}/departamentos/all`
    return this.http.get<CargarDepartamentos>(url, this.headers).pipe(
      map((resp) => {
        const departamentos = resp.departamentos.map(
          (departamento) =>
            new Departamento(
              departamento.nombre,
              departamento.descripcion,
              departamento.clave,
              departamento.activated,
              departamento.usuarioCreated,
              departamento.dateCreated,
              departamento.lastEdited,
              departamento.uid,

            ),
        )
        return {
          total: departamentos.length,
          departamentos,
        }
      }),
    )
  }
  cargarDepartamentosSalon() {
    const url = `${base_url}/departamentos/all/salon`
    return this.http.get<CargarDepartamentos>(url, this.headers).pipe(
      map((resp) => {
        const departamentos = resp.departamentos.map(
          (departamento) =>
            new Departamento(
              departamento.nombre,
              departamento.descripcion,
              departamento.clave,
              departamento.activated,
              departamento.usuarioCreated,
              departamento.dateCreated,
              departamento.lastEdited,
              departamento.uid,

            ),
        )
        return {
          total: departamentos.length,
          departamentos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarDepartamentos>(url, this.headers).pipe(
      map((resp) => {
        const departamentos = resp.departamentos.map(
          (departamento) =>
            new Departamento(
              departamento.nombre,
              departamento.descripcion,
              departamento.clave,
              departamento.usuarioCreated,
              departamento.activated,
              departamento.dateCreated,
              departamento.lastEdited,
              departamento.uid,
            ),
        )
        return {
          total: departamentos.length,
          departamentos,
        }
      }),
    )
  }
  crearDepartamento(formData: Departamento) {
    return this.http.post(`${base_url}/departamentos`, formData, this.headers)
  }


  isActivedDepartamento(departamento: Departamento) {
    const url = `${base_url}/departamentos/isActive/${departamento.uid}`
    const data = {
      ...departamento,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarDepartamento(departamento: Departamento) {
    const url = `${base_url}/departamentos/${departamento.uid}`
    const data = {
      ...departamento,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarDepartamentoById(id: string) {
    const url = `${base_url}/departamentos/${id}`
    return this.http.get<CargarDepartamento>(url, this.headers)
  }
  cargarDepartamentoByClave(clave: string) {
    const url = `${base_url}/departamentos/clave/${clave}`
    return this.http.get<CargarDepartamento>(url, this.headers)
  }

}
