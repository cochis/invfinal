import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarPagoProgramados, CargarPagoProgramado } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { PagoProgramado } from '../models/pagoProgramado.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PagoProgramadoService {

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


  cargarPagoProgramadosAll() {
    const url = `${base_url}/pagoProgramado/all`
    return this.http.get<CargarPagoProgramados>(url, this.headers).pipe(
      map((resp) => {

        const pagoProgramados = resp.pagoProgramados.map(
          (pagoProgramado) =>
            new PagoProgramado(
             
              pagoProgramado.consecutivo,
              pagoProgramado.urgente,
              pagoProgramado.subsidiaria,
              pagoProgramado.tipoGasto,
              pagoProgramado.terminoPago,
              pagoProgramado.proveedor,
              pagoProgramado.proveedorLoop,
              pagoProgramado.clienteLoop,
              pagoProgramado.impExpLoop,
              pagoProgramado.concepto,
              pagoProgramado.conceptoLoop,
              pagoProgramado.otroConcepto,
              pagoProgramado.cantidad,
              pagoProgramado.fechaSolicitud,
              pagoProgramado.fechaPago,
              pagoProgramado.pagado,
              pagoProgramado.fechaProgramada,
              pagoProgramado.fechaVencimiento,
              pagoProgramado.pagoA,
              pagoProgramado.quote,
              pagoProgramado.aprobacion,
              pagoProgramado.tipoServicio,
              pagoProgramado.observaciones,
              pagoProgramado.factura,
              pagoProgramado.tipoFactura,
              pagoProgramado.cotizacion,
              pagoProgramado.comprobante,
              pagoProgramado.empresa,
              pagoProgramado.moneda,
              pagoProgramado.activated,
              pagoProgramado.usuarioCreated,
              pagoProgramado.dateCreated,
              pagoProgramado.lastEdited,
              pagoProgramado.uid,

            ),
        )
        return {
          total: pagoProgramados.length,
          pagoProgramados,
        }
      }),
    )
  }
  cargarPagoProgramadosByCreated(user) {
    const url = `${base_url}/pagoProgramado/user/${user}`
    // console.log('url', url)
    return this.http.get<CargarPagoProgramados>(url, this.headers).pipe(
      map((resp) => {

        const pagoProgramados = resp.pagoProgramados.map(
          (pagoProgramado) =>
            new PagoProgramado(
             
              pagoProgramado.consecutivo,
              pagoProgramado.urgente,
              pagoProgramado.subsidiaria,
              pagoProgramado.tipoGasto,
              pagoProgramado.terminoPago,
              pagoProgramado.proveedor,
              pagoProgramado.proveedorLoop,
              pagoProgramado.clienteLoop,
              pagoProgramado.impExpLoop,
              pagoProgramado.concepto,
              pagoProgramado.conceptoLoop,
              pagoProgramado.otroConcepto,
              pagoProgramado.cantidad,
              pagoProgramado.fechaSolicitud,
              pagoProgramado.fechaPago,
              pagoProgramado.pagado,
              pagoProgramado.fechaProgramada,
              pagoProgramado.fechaVencimiento,
              pagoProgramado.pagoA,
              pagoProgramado.quote,
              pagoProgramado.aprobacion,
              pagoProgramado.tipoServicio,
              pagoProgramado.observaciones,
              pagoProgramado.factura,
              pagoProgramado.tipoFactura,
              pagoProgramado.cotizacion,
              pagoProgramado.comprobante,
              pagoProgramado.empresa,
              pagoProgramado.moneda,
              pagoProgramado.activated,
              pagoProgramado.usuarioCreated,
              pagoProgramado.dateCreated,
              pagoProgramado.lastEdited,
              pagoProgramado.uid,

            ),
        )
        return {
          total: pagoProgramados.length,
          pagoProgramados,
        }
      }),
    )
  }
  cargarPagoProgramado() {
    const url = `${base_url}/roles/all/pagoProgramado`
    return this.http.get<CargarPagoProgramados>(url, this.headers).pipe(
      map((resp) => {
        const pagoProgramados = resp.pagoProgramados.map(
          (pagoProgramado) =>
            new PagoProgramado(

              pagoProgramado.consecutivo,
              pagoProgramado.urgente,
              pagoProgramado.subsidiaria,
              pagoProgramado.tipoGasto,
              pagoProgramado.terminoPago,
              pagoProgramado.proveedor,
              pagoProgramado.proveedorLoop,
              pagoProgramado.clienteLoop,
              pagoProgramado.impExpLoop,
              pagoProgramado.concepto,
              pagoProgramado.conceptoLoop,
              pagoProgramado.otroConcepto,
              pagoProgramado.cantidad,
              pagoProgramado.fechaSolicitud,
              pagoProgramado.fechaPago,
              pagoProgramado.pagado,
              pagoProgramado.fechaProgramada,
              pagoProgramado.fechaVencimiento,
              pagoProgramado.pagoA,
              pagoProgramado.quote,
              pagoProgramado.aprobacion,
              pagoProgramado.tipoServicio,
              pagoProgramado.observaciones,
              pagoProgramado.factura,
              pagoProgramado.tipoFactura,
              pagoProgramado.cotizacion,
              pagoProgramado.comprobante,
              pagoProgramado.empresa,
              pagoProgramado.moneda,
              pagoProgramado.activated,
              pagoProgramado.usuarioCreated,
              pagoProgramado.dateCreated,
              pagoProgramado.lastEdited,
              pagoProgramado.uid,
            ),
        )
        return {
          total: pagoProgramados.length,
          pagoProgramados,
        }
      }),
    )
  }

  crearPagoProgramado(formData: any) {
    // console.log('formData', formData)
    return this.http.post(`${base_url}/pagoProgramado`, formData, this.headers)
  }


  isActivedPagoProgramado(pagoProgramado: PagoProgramado) {
    const url = `${base_url}/pagoProgramado/isActive/${pagoProgramado.uid}`
    const data = {
      ...pagoProgramado,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPagoProgramado(pagoProgramado: any) {

    const url = `${base_url}/pagoProgramado/${pagoProgramado.uid}`
    const data = {
      ...pagoProgramado,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarPagoProgramadoById(id: string) {
    const url = `${base_url}/pagoProgramado/${id}`
    return this.http.get<CargarPagoProgramado>(url, this.headers)
  }
  cargarPagoProgramadoByClave(clave: string) {
    const url = `${base_url}/pagoProgramado/clave/${clave}`
    return this.http.get<CargarPagoProgramado>(url, this.headers)
  }

}
