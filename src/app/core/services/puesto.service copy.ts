import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarEmpresas, CargarEmpresa } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Empresa } from '../models/Empresa';
 
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

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

  cargarEmpresasAll() {
    const url = `${base_url}/empresa/all`
    return this.http.get<CargarEmpresas>(url, this.headers).pipe(
      map((resp) => {
        const empresas = resp.empresas.map(
          (empresa) =>
            new Empresa(
              empresa.nombre,
              empresa.clave,
              empresa.activated,
              empresa.usuarioCreated,
              empresa.dateCreated,
              empresa.lastEdited,
              empresa.uid,

            ),
        )
        return {
          total: empresas.length,
          empresas,
        }
      }),
    )
  }
 
  crearEmpresa(formData: Empresa) {
    return this.http.post(`${base_url}/empresa`, formData, this.headers)
  }


  isActivedEmpresa(empresa: Empresa) {
    const url = `${base_url}/empresa/isActive/${empresa.uid}`

    const data = {
      ...empresa,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarEmpresa(empresa: Empresa) {
    const url = `${base_url}/empresa/${empresa.uid}`
    const data = {
      ...empresa,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(empresa: Empresa) {
    const url = `${base_url}/empresa/pass/${empresa.uid}`
    const data = {
      ...empresa,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarEmpresaById(id: string) {
    const url = `${base_url}/empresa/${id}`
    return this.http.get<CargarEmpresa>(url, this.headers)
  }
  cargarEmpresaByEmail(email: string) {

    const url = `${base_url}/empresa/email/${email}`

    return this.http.get<CargarEmpresas>(url, this.headers)
  }

}
