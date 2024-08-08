import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarPuestos, CargarPuesto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Puesto } from 'src/app/core/models/puesto.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PuestosService {

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

  cargarPuestosAll() {
    const url = `${base_url}/puesto/all`
    return this.http.get<CargarPuestos>(url, this.headers).pipe(
      map((resp) => {
        const puestos = resp.puestos.map(
          (puesto) =>
            new Puesto(
              puesto.nombre,
              puesto.clave,
              puesto.descripcion,
              puesto.activated,
              puesto.usuarioCreated,
              puesto.dateCreated,
              puesto.lastEdited,
              puesto.uid,

            ),
        )
        return {
          total: puestos.length,
          puestos,
        }
      }),
    )
  }
 
  crearPuesto(formData: Puesto) {
    return this.http.post(`${base_url}/puesto`, formData, this.headers)
  }


  isActivedPuesto(puesto: Puesto) {
    const url = `${base_url}/puesto/isActive/${puesto.uid}`

    const data = {
      ...puesto,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarPuesto(puesto: Puesto) {
    const url = `${base_url}/puesto/${puesto.uid}`
    const data = {
      ...puesto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(puesto: Puesto) {
    const url = `${base_url}/puesto/pass/${puesto.uid}`
    const data = {
      ...puesto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarPuestoById(id: string) {
    const url = `${base_url}/puesto/${id}`
    return this.http.get<CargarPuesto>(url, this.headers)
  }
  cargarPuestoByEmail(email: string) {

    const url = `${base_url}/puesto/email/${email}`

    return this.http.get<CargarPuestos>(url, this.headers)
  }

}
