import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarPlanta, CargarPlantas, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Planta } from 'src/app/core/models/planta.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PlantasService {

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

  cargarPlantasInit() {
    const url = `${base_url}/plantas/all`
    return this.http.get<CargarPlantas>(url, this.headers).pipe(
      map((resp) => {
        const plantas = resp.plantas.map(
          (planta) =>
            new Planta(
              planta.nombre,
              planta.compania,
              planta.clave,
              planta.activated,
              planta.usuarioCreated,
              planta.dateCreated,
              planta.lastEdited,
              planta.uid,

            ),
        )
        return {
          total: plantas.length,
          plantas,
        }
      }),
    )
  }
  cargarPlantasAll() {
    const url = `${base_url}/plantas/all`
    return this.http.get<CargarPlantas>(url, this.headers).pipe(
      map((resp) => {
        const plantas = resp.plantas.map(
          (planta) =>
            new Planta(
              planta.nombre,
              planta.compania,
              planta.clave,
              planta.activated,
              planta.usuarioCreated,
              planta.dateCreated,
              planta.lastEdited,
              planta.uid,

            ),
        )
        return {
          total: plantas.length,
          plantas,
        }
      }),
    )
  }
  cargarPlantasSalon() {
    const url = `${base_url}/plantas/all/salon`
    return this.http.get<CargarPlantas>(url, this.headers).pipe(
      map((resp) => {
        const plantas = resp.plantas.map(
          (planta) =>
            new Planta(
              planta.nombre,
              planta.compania,
              planta.clave,
              planta.activated,
              planta.usuarioCreated,
              planta.dateCreated,
              planta.lastEdited,
              planta.uid,

            ),
        )
        return {
          total: plantas.length,
          plantas,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarPlantas>(url, this.headers).pipe(
      map((resp) => {
        const plantas = resp.plantas.map(
          (planta) =>
            new Planta(
              planta.nombre,
              planta.compania,
              planta.clave,
              planta.usuarioCreated,
              planta.activated,
              planta.dateCreated,
              planta.lastEdited,
              planta.uid,
            ),
        )
        return {
          total: plantas.length,
          plantas,
        }
      }),
    )
  }
  crearPlanta(formData: Planta) {
    return this.http.post(`${base_url}/plantas`, formData, this.headers)
  }


  isActivedPlanta(planta: Planta) {
    const url = `${base_url}/plantas/isActive/${planta.uid}`
    const data = {
      ...planta,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPlanta(planta: Planta) {
    const url = `${base_url}/plantas/${planta.uid}`
    const data = {
      ...planta,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarPlantaById(id: string) {
    const url = `${base_url}/plantas/${id}`
    return this.http.get<CargarPlanta>(url, this.headers)
  }
  cargarPlantaByClave(clave: string) {
    const url = `${base_url}/plantas/clave/${clave}`
    return this.http.get<CargarPlanta>(url, this.headers)
  }

}
