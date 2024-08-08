import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarMateriaPrima, CargarMateriaPrimas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class MateriaPrimasService {

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

  cargarMateriaPrimasInit() {
    const url = `${base_url}/materiaPrimas/all`
    return this.http.get<CargarMateriaPrimas>(url, this.headers).pipe(
      map((resp) => {
        const materiaPrimas = resp.materiaPrimas.map(
          (materiaPrima) =>
            new MateriaPrima(

              materiaPrima.nombre,
              materiaPrima.clave,
              materiaPrima.descripcion,
              materiaPrima.tipoMaterial,
              materiaPrima.unidadMedida,
              materiaPrima.precioStd,
              materiaPrima.moneda,
              materiaPrima.variedad,
              materiaPrima.area,
              materiaPrima.tipo,
              materiaPrima.activated,
              materiaPrima.usuarioCreated,
              materiaPrima.dateCreated,
              materiaPrima.lastEdited,
              materiaPrima.uid,
 

            ),
        )
        return {
          total: materiaPrimas.length,
          materiaPrimas,
        }
      }),
    )
  }
  cargarMateriaPrimasAll() {
    const url = `${base_url}/materiaPrimas/all`
    return this.http.get<CargarMateriaPrimas>(url, this.headers).pipe(
      map((resp) => {
        const materiaPrimas = resp.materiaPrimas.map(
          (materiaPrima) =>
            new MateriaPrima(
              materiaPrima.nombre,
              materiaPrima.clave,
              materiaPrima.descripcion,
              materiaPrima.tipoMaterial,
              materiaPrima.unidadMedida,
              materiaPrima.precioStd,
              materiaPrima.moneda,
              materiaPrima.variedad,
              materiaPrima.area,
              materiaPrima.tipo,
              materiaPrima.activated,
              materiaPrima.usuarioCreated,
              materiaPrima.dateCreated,
              materiaPrima.lastEdited,
              materiaPrima.uid,
            ),
        )
        return {
          total: materiaPrimas.length,
          materiaPrimas,
        }
      }),
    )
  }
  cargarMateriaPrimasSalon() {
    const url = `${base_url}/materiaPrimas/all/salon`
    return this.http.get<CargarMateriaPrimas>(url, this.headers).pipe(
      map((resp) => {
        const materiaPrimas = resp.materiaPrimas.map(
          (materiaPrima) =>
            new MateriaPrima(
              materiaPrima.nombre,
              materiaPrima.clave,
              materiaPrima.descripcion,
              materiaPrima.tipoMaterial,
              materiaPrima.unidadMedida,
              materiaPrima.precioStd,
              materiaPrima.moneda,
              materiaPrima.variedad,
              materiaPrima.area,
              materiaPrima.tipo,
              materiaPrima.activated,
              materiaPrima.usuarioCreated,
              materiaPrima.dateCreated,
              materiaPrima.lastEdited,
              materiaPrima.uid,
            ),
        )
        return {
          total: materiaPrimas.length,
          materiaPrimas,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarMateriaPrimas>(url, this.headers).pipe(
      map((resp) => {
        const materiaPrimas = resp.materiaPrimas.map(
          (materiaPrima) =>
            new MateriaPrima(
              materiaPrima.nombre,
              materiaPrima.clave,
              materiaPrima.descripcion,
              materiaPrima.tipoMaterial,
              materiaPrima.unidadMedida,
              materiaPrima.precioStd,
              materiaPrima.moneda,
              materiaPrima.variedad,
              materiaPrima.area,
              materiaPrima.tipo,
              materiaPrima.activated,
              materiaPrima.usuarioCreated,
              materiaPrima.dateCreated,
              materiaPrima.lastEdited,
              materiaPrima.uid,
            ),
        )
        return {
          total: materiaPrimas.length,
          materiaPrimas,
        }
      }),
    )
  }
  crearMateriaPrima(formData: MateriaPrima) {
    return this.http.post(`${base_url}/materiaPrimas`, formData, this.headers)
  }


  isActivedMateriaPrima(materiaPrima: MateriaPrima) {
    const url = `${base_url}/materiaPrimas/isActive/${materiaPrima.uid}`
    const data = {
      ...materiaPrima,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarMateriaPrima(materiaPrima: MateriaPrima) {
    const url = `${base_url}/materiaPrimas/${materiaPrima.uid}`
    const data = {
      ...materiaPrima,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarMateriaPrimaById(id: string) {
    const url = `${base_url}/materiaPrimas/${id}`
    return this.http.get<CargarMateriaPrima>(url, this.headers)
  }
  cargarMateriaPrimaByClave(clave: string) {
    const url = `${base_url}/materiaPrimas/clave/${clave}`
    return this.http.get<CargarMateriaPrima>(url, this.headers)
  }

}
