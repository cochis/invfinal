import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarSolicitudViajes, CargarSolicitudViaje } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { SolicitudViaje } from 'src/app/core/models/solicitudViaje.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class SolicitudViajesService {

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

  cargarAlumnosAll() {
    const url = `${base_url}/solicitudViajes/all`
    return this.http.get<CargarSolicitudViajes>(url, this.headers).pipe(
      map((resp) => {
        const solicitudViajes = resp.solicitudViajes.map(
          (sv) =>
            new SolicitudViaje(

              sv.tipoSolicitudViaje,
              sv.empleado,
              sv.dateViaje,
              sv.duracion,
              sv.destino,
              sv.proposito,
              sv.dateSalida,
              sv.dateRegreso,
              sv.medioTransporte,
              sv.tipoTransporte,
              sv.detalleTransporte,
              sv.numeroTransporte,
              sv.cantidadSolicitada,
              sv.cantidadAprobada,
              sv.cantidadJustifico,
              sv.cantidadRegreso,
              sv.aprobado,
              sv.fechaAprobacion,
              sv.moneda,
              sv.usuarioCreated,
              sv.activated,
              sv.dateCreated,
              sv.lastEdited,
              sv.fechaPagado,
              sv.pagado,
              sv.uid,

            ),
        )
        return {
          total: solicitudViajes.length,
          solicitudViajes,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarSolicitudViajes>(url, this.headers).pipe(
      map((resp) => {
        const solicitudViajes = resp.solicitudViajes.map(
          (sv) =>
            new SolicitudViaje(
              sv.tipoSolicitudViaje,
              sv.empleado,
              sv.dateViaje,
              sv.duracion,
              sv.destino,
              sv.proposito,
              sv.dateSalida,
              sv.dateRegreso,
              sv.medioTransporte,
              sv.tipoTransporte,
              sv.detalleTransporte,
              sv.numeroTransporte,
              sv.cantidadSolicitada,
              sv.cantidadAprobada,
              sv.cantidadJustifico,
              sv.cantidadRegreso,
              sv.aprobado,
              sv.fechaAprobacion,
              sv.moneda,
              sv.usuarioCreated,
              sv.activated,
              sv.dateCreated,
              sv.lastEdited,
              sv.fechaPagado,
              sv.pagado,
              sv.uid,


            ),
        )
        return {
          total: solicitudViajes.length,
          solicitudViajes,
        }
      }),
    )
  }
  crearSolicitudViaje(formData: SolicitudViaje) {
    let solicitud: any = {
      ...formData,
      url: base_url
    }
    return this.http.post(`${base_url}/solicitudViajes`, solicitud, this.headers)
  }


  isActivedSolicitudViaje(solicitudViaje: SolicitudViaje) {
    const url = `${base_url}/solicitudViajes/isActive/${solicitudViaje.uid}`

    const data = {
      ...solicitudViaje,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarSolicitudViaje(solicitudViaje: any) {
    const url = `${base_url}/solicitudViajes/${solicitudViaje.uid}`
    const data = {
      ...solicitudViaje,
      lastEdited: Date.now(),
      url: base_url
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(solicitudViaje: SolicitudViaje) {
    const url = `${base_url}/solicitudViajes/pass/${solicitudViaje.uid}`
    const data = {
      ...solicitudViaje,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarSolicitudViajeById(id: string) {
    const url = `${base_url}/solicitudViajes/${id}`
    return this.http.get<CargarSolicitudViaje>(url, this.headers)
  }
  cargarSolicitudesViajeByEmpleado(user: string) {
    const url = `${base_url}/solicitudViajes/user/${user}`
    return this.http.get<CargarSolicitudViajes>(url, this.headers)
  }

}
