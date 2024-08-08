import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarMoneda, CargarMonedas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Moneda } from 'src/app/core/models/moneda.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class MonedasService {

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

  cargarMonedasInit() {
    const url = `${base_url}/monedas/all`
    return this.http.get<CargarMonedas>(url, this.headers).pipe(
      map((resp) => {
        const monedas = resp.monedas.map(
          (moneda) =>
            new Moneda(
              moneda.nombre,
              moneda.clave,
              moneda.activated,
              moneda.usuarioCreated,
              moneda.dateCreated,
              moneda.lastEdited,
              moneda.uid,

            ),
        )
        return {
          total: monedas.length,
          monedas,
        }
      }),
    )
  }
  cargarMonedasAll() {
    const url = `${base_url}/monedas/all`
    return this.http.get<CargarMonedas>(url, this.headers).pipe(
      map((resp) => {
        const monedas = resp.monedas.map(
          (moneda) =>
            new Moneda(
              moneda.nombre,
              moneda.clave,
              moneda.activated,
              moneda.usuarioCreated,
              moneda.dateCreated,
              moneda.lastEdited,
              moneda.uid,

            ),
        )
        return {
          total: monedas.length,
          monedas,
        }
      }),
    )
  }
  cargarMonedasSalon() {
    const url = `${base_url}/monedas/all/salon`
    return this.http.get<CargarMonedas>(url, this.headers).pipe(
      map((resp) => {
        const monedas = resp.monedas.map(
          (moneda) =>
            new Moneda(
              moneda.nombre,
              moneda.clave,
              moneda.activated,
              moneda.usuarioCreated,
              moneda.dateCreated,
              moneda.lastEdited,
              moneda.uid,

            ),
        )
        return {
          total: monedas.length,
          monedas,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarMonedas>(url, this.headers).pipe(
      map((resp) => {
        const monedas = resp.monedas.map(
          (moneda) =>
            new Moneda(
              moneda.nombre,
              moneda.clave,
              moneda.usuarioCreated,
              moneda.activated,
              moneda.dateCreated,
              moneda.lastEdited,
              moneda.uid,
            ),
        )
        return {
          total: monedas.length,
          monedas,
        }
      }),
    )
  }
  crearMoneda(formData: Moneda) {
    return this.http.post(`${base_url}/monedas`, formData, this.headers)
  }


  isActivedMoneda(moneda: Moneda) {
    const url = `${base_url}/monedas/isActive/${moneda.uid}`
    const data = {
      ...moneda,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarMoneda(moneda: Moneda) {
    const url = `${base_url}/monedas/${moneda.uid}`
    const data = {
      ...moneda,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarMonedaById(id: string) {
    const url = `${base_url}/monedas/${id}`
    return this.http.get<CargarMoneda>(url, this.headers)
  }
  cargarMonedaByClave(clave: string) {
    const url = `${base_url}/monedas/clave/${clave}`
    return this.http.get<CargarMoneda>(url, this.headers)
  }

}
