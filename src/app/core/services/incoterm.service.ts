import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarIncoterms, CargarIncoterm } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Incoterm } from 'src/app/core/models/incoterm.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class IncotermsService {

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

  cargarIncotermsAll() {
    const url = `${base_url}/incoterm/all`
    return this.http.get<CargarIncoterms>(url, this.headers).pipe(
      map((resp) => {
        const incoterms = resp.incoterms.map(
          (incoterm) =>
            new Incoterm(
              
              incoterm.nombre,
              incoterm.clave,
              incoterm.descripcion,
              incoterm.img,
              incoterm.activated,
              incoterm.usuarioCreated,
              incoterm.dateCreated,
              incoterm.lastEdited,
              incoterm.uid,

            ),
        )
        return {
          total: incoterms.length,
          incoterms,
        }
      }),
    )
  }
 
  crearIncoterm(formData: Incoterm) {
    return this.http.post(`${base_url}/incoterm`, formData, this.headers)
  }


  isActivedIncoterm(incoterm: Incoterm) {
    const url = `${base_url}/incoterm/isActive/${incoterm.uid}`

    const data = {
      ...incoterm,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarIncoterm(incoterm: Incoterm) {
    const url = `${base_url}/incoterm/${incoterm.uid}`
    const data = {
      ...incoterm,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(incoterm: Incoterm) {
    const url = `${base_url}/incoterm/pass/${incoterm.uid}`
    const data = {
      ...incoterm,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarIncotermById(id: string) {
    const url = `${base_url}/incoterm/${id}`
    return this.http.get<CargarIncoterm>(url, this.headers)
  }
  cargarIncotermByEmail(email: string) {

    const url = `${base_url}/incoterm/email/${email}`

    return this.http.get<CargarIncoterms>(url, this.headers)
  }

}
