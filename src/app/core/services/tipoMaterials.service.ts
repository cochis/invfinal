import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoMaterial, CargarTipoMaterials } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { TipoMaterial } from 'src/app/core/models/tipoMaterial.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoMaterialsService {

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

  cargarTipoMaterialsInit() {
    const url = `${base_url}/tipoMaterials/all`
    return this.http.get<CargarTipoMaterials>(url, this.headers).pipe(
      map((resp) => {
        const tipoMaterials = resp.tipoMaterials.map(
          (rol) =>
            new TipoMaterial(
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
          total: tipoMaterials.length,
          tipoMaterials,
        }
      }),
    )
  }
  cargarTipoMaterialsAll() {
    const url = `${base_url}/tipoMaterials/all`
    return this.http.get<CargarTipoMaterials>(url, this.headers).pipe(
      map((resp) => {
        const tipoMaterials = resp.tipoMaterials.map(
          (rol) =>
            new TipoMaterial(
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
          total: tipoMaterials.length,
          tipoMaterials,
        }
      }),
    )
  }
  cargarTipoMaterialsSalon() {
    const url = `${base_url}/tipoMaterials/all/salon`
    return this.http.get<CargarTipoMaterials>(url, this.headers).pipe(
      map((resp) => {
        const tipoMaterials = resp.tipoMaterials.map(
          (rol) =>
            new TipoMaterial(
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
          total: tipoMaterials.length,
          tipoMaterials,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoMaterials>(url, this.headers).pipe(
      map((resp) => {
        const tipoMaterials = resp.tipoMaterials.map(
          (rol) =>
            new TipoMaterial(
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
          total: tipoMaterials.length,
          tipoMaterials,
        }
      }),
    )
  }
  crearTipoMaterial(formData: TipoMaterial) {
    return this.http.post(`${base_url}/tipoMaterials`, formData, this.headers)
  }


  isActivedTipoMaterial(tipoMaterial: TipoMaterial) {
    const url = `${base_url}/tipoMaterials/isActive/${tipoMaterial.uid}`
    const data = {
      ...tipoMaterial,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoMaterial(tipoMaterial: TipoMaterial) {
    const url = `${base_url}/tipoMaterials/${tipoMaterial.uid}`
    const data = {
      ...tipoMaterial,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoMaterialById(id: string) {
    const url = `${base_url}/tipoMaterials/${id}`
    return this.http.get<CargarTipoMaterial>(url, this.headers)
  }
  cargarTipoMaterialByClave(clave: string) {
    const url = `${base_url}/tipoMaterials/clave/${clave}`
    return this.http.get<CargarTipoMaterial>(url, this.headers)
  }

}
