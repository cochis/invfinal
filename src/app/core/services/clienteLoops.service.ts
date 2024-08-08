import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarClienteLoop, CargarClienteLoops, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { ClienteLoop } from 'src/app/core/models/clienteLoop.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ClienteLoopsService {

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

  cargarClienteLoopsInit() {
    const url = `${base_url}/cliente-loop/all`
    return this.http.get<CargarClienteLoops>(url, this.headers).pipe(
      map((resp) => {
        const clienteLoops = resp.clienteLoops.map(
          (clienteLoop) =>
            new ClienteLoop(
              clienteLoop.taxId,
              clienteLoop.name,
              clienteLoop.pais,
              clienteLoop.activated,
              clienteLoop.usuarioCreated,
              clienteLoop.dateCreated,
              clienteLoop.lastEdited,
              clienteLoop.uid,

            ),
        )
        return {
          total: clienteLoops.length,
          clienteLoops,
        }
      }),
    )
  }
  cargarClienteLoopsAll() {
    const url = `${base_url}/cliente-loop/all`
    return this.http.get<CargarClienteLoops>(url, this.headers).pipe(
      map((resp) => {
        const clienteLoops = resp.clienteLoops.map(
          (clienteLoop) =>
            new ClienteLoop(
              clienteLoop.taxId,
              clienteLoop.name,
              clienteLoop.pais,
              clienteLoop.activated,
              clienteLoop.usuarioCreated,
              clienteLoop.dateCreated,
              clienteLoop.lastEdited,
              clienteLoop.uid,

            ),
        )
        return {
          total: clienteLoops.length,
          clienteLoops,
        }
      }),
    )
  }
  cargarClienteLoopsSalon() {
    const url = `${base_url}/cliente-loop/all/salon`
    return this.http.get<CargarClienteLoops>(url, this.headers).pipe(
      map((resp) => {
        const clienteLoops = resp.clienteLoops.map(
          (clienteLoop) =>
            new ClienteLoop(
              clienteLoop.taxId,
              clienteLoop.name,
              clienteLoop.pais,
              clienteLoop.activated,
              clienteLoop.usuarioCreated,
              clienteLoop.dateCreated,
              clienteLoop.lastEdited,
              clienteLoop.uid,

            ),
        )
        return {
          total: clienteLoops.length,
          clienteLoops,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarClienteLoops>(url, this.headers).pipe(
      map((resp) => {
        const clienteLoops = resp.clienteLoops.map(
          (clienteLoop) =>
            new ClienteLoop(
              clienteLoop.taxId,
              clienteLoop.name,
              clienteLoop.pais,
              clienteLoop.activated,
              clienteLoop.usuarioCreated,
              clienteLoop.dateCreated,
              clienteLoop.lastEdited,
              clienteLoop.uid,
            ),
        )
        return {
          total: clienteLoops.length,
          clienteLoops,
        }
      }),
    )
  }
  crearClienteLoop(formData: ClienteLoop) {
    return this.http.post(`${base_url}/cliente-loop`, formData, this.headers)
  }


  isActivedClienteLoop(clienteLoop: ClienteLoop) {
    const url = `${base_url}/cliente-loop/isActive/${clienteLoop.uid}`
    const data = {
      ...clienteLoop,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarClienteLoop(clienteLoop: ClienteLoop) {
    const url = `${base_url}/cliente-loop/${clienteLoop.uid}`
    const data = {
      ...clienteLoop,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarClienteLoopById(id: string) {
    const url = `${base_url}/cliente-loop/${id}`
    return this.http.get<CargarClienteLoop>(url, this.headers)
  }
  cargarClienteLoopByClave(clave: string) {
    const url = `${base_url}/cliente-loop/clave/${clave}`
    return this.http.get<CargarClienteLoop>(url, this.headers)
  }

}
