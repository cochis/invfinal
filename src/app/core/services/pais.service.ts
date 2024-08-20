import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarPaiss, CargarPais } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Pais } from 'src/app/core/models/pais.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PaissService {

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

  cargarPaissAll() {
    const url = `${base_url}/pais/all`
    return this.http.get<CargarPaiss>(url, this.headers).pipe(
      map((resp) => {
        const paiss = resp.paiss.map(
          (pais) =>
            new Pais(
              
              pais.nombre,
              pais.clave,
              pais.activated,
              pais.usuarioCreated,
              pais.dateCreated,
              pais.lastEdited,
              pais.uid,

            ),
        )
        return {
          total: paiss.length,
          paiss,
        }
      }),
    )
  }
 
  crearPais(formData: Pais) {
    return this.http.post(`${base_url}/pais`, formData, this.headers)
  }


  isActivedPais(pais: Pais) {
    const url = `${base_url}/pais/isActive/${pais.uid}`

    const data = {
      ...pais,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarPais(pais: Pais) {
    const url = `${base_url}/pais/${pais.uid}`
    const data = {
      ...pais,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(pais: Pais) {
    const url = `${base_url}/pais/pass/${pais.uid}`
    const data = {
      ...pais,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarPaisById(id: string) {
    const url = `${base_url}/pais/${id}`
    return this.http.get<CargarPais>(url, this.headers)
  }
  cargarPaisByEmail(email: string) {

    const url = `${base_url}/pais/email/${email}`

    return this.http.get<CargarPaiss>(url, this.headers)
  }

}
