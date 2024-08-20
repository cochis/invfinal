import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarConceptoLoop, CargarConceptoLoops, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { ConceptoLoop } from 'src/app/core/models/conceptoLoop.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ConceptoLoopsService {

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

  cargarConceptoLoopsInit() {
    const url = `${base_url}/concepto-loop/all`
    return this.http.get<CargarConceptoLoops>(url, this.headers).pipe(
      map((resp) => {
        const conceptoLoops = resp.conceptoLoops.map(
          (conceptoLoop) =>
            new ConceptoLoop(
              conceptoLoop.name,
              conceptoLoop.clave,
              conceptoLoop.activated,
              conceptoLoop.usuarioCreated,
              conceptoLoop.dateCreated,
              conceptoLoop.lastEdited,
              conceptoLoop.uid,

            ),
        )
        return {
          total: conceptoLoops.length,
          conceptoLoops,
        }
      }),
    )
  }
  cargarConceptoLoopsAll() {
    const url = `${base_url}/concepto-loop/all`
    return this.http.get<CargarConceptoLoops>(url, this.headers).pipe(
      map((resp) => {
        const conceptoLoops = resp.conceptoLoops.map(
          (conceptoLoop) =>
            new ConceptoLoop(
              conceptoLoop.name,
              conceptoLoop.clave,
              conceptoLoop.activated,
              conceptoLoop.usuarioCreated,
              conceptoLoop.dateCreated,
              conceptoLoop.lastEdited,
              conceptoLoop.uid,

            ),
        )
        return {
          total: conceptoLoops.length,
          conceptoLoops,
        }
      }),
    )
  }
  cargarConceptoLoopsSalon() {
    const url = `${base_url}/concepto-loop/all/salon`
    return this.http.get<CargarConceptoLoops>(url, this.headers).pipe(
      map((resp) => {
        const conceptoLoops = resp.conceptoLoops.map(
          (conceptoLoop) =>
            new ConceptoLoop(
              conceptoLoop.name,
              conceptoLoop.clave,
              conceptoLoop.activated,
              conceptoLoop.usuarioCreated,
              conceptoLoop.dateCreated,
              conceptoLoop.lastEdited,
              conceptoLoop.uid,
            ),
        )
        return {
          total: conceptoLoops.length,
          conceptoLoops,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarConceptoLoops>(url, this.headers).pipe(
      map((resp) => {
        const conceptoLoops = resp.conceptoLoops.map(
          (conceptoLoop) =>
            new ConceptoLoop(
              conceptoLoop.name,
              conceptoLoop.clave,
              conceptoLoop.activated,
              conceptoLoop.usuarioCreated,
              conceptoLoop.dateCreated,
              conceptoLoop.lastEdited,
              conceptoLoop.uid,
            ),
        )
        return {
          total: conceptoLoops.length,
          conceptoLoops,
        }
      }),
    )
  }
  crearConceptoLoop(formData: ConceptoLoop) {
    return this.http.post(`${base_url}/concepto-loop`, formData, this.headers)
  }


  isActivedConceptoLoop(conceptoLoop: ConceptoLoop) {
    const url = `${base_url}/concepto-loop/isActive/${conceptoLoop.uid}`
    const data = {
      ...conceptoLoop,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarConceptoLoop(conceptoLoop: ConceptoLoop) {
    const url = `${base_url}/concepto-loop/${conceptoLoop.uid}`
    const data = {
      ...conceptoLoop,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarConceptoLoopById(id: string) {
    const url = `${base_url}/concepto-loop/${id}`
    return this.http.get<CargarConceptoLoop>(url, this.headers)
  }
  cargarConceptoLoopByClave(clave: string) {
    const url = `${base_url}/concepto-loop/clave/${clave}`
    return this.http.get<CargarConceptoLoop>(url, this.headers)
  }

}
