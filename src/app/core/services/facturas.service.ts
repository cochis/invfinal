import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarFacturas, CargarFactura } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Factura } from 'src/app/core/models/factura.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class FacturasService {

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

  cargarFacturasInit() {
    const url = `${base_url}/facturas/all`
    return this.http.get<CargarFacturas>(url, this.headers).pipe(
      map((resp) => {
        const facturas = resp.facturas.map(
          (factura) =>
            new Factura(
              factura.solicitudViaje,
              factura.date,
              factura.descripcion,
              factura.tipoFactura,
              factura.cantidad,
              factura.moneda,
              factura.currencyExchange,
              factura.file,
              factura.activated,
              factura.usuarioCreated,
              factura.dateCreated,
              factura.lastEdited,
              factura.uid,
            
            ),
        )
        return {
          total: facturas.length,
          facturas,
        }
      }),
    )
  }
  cargarFacturasAll() {
    const url = `${base_url}/facturas/all`
    return this.http.get<CargarFacturas>(url, this.headers).pipe(
      map((resp) => {
        const facturas = resp.facturas.map(
          (factura) =>
            new Factura(
              factura.solicitudViaje,
              factura.date,
              factura.descripcion,
              factura.tipoFactura,
              factura.cantidad,
              factura.moneda,
              factura.currencyExchange,
              factura.file,
              factura.activated,
              factura.usuarioCreated,
              factura.dateCreated,
              factura.lastEdited,
              factura.uid,

            ),
        )
        return {
          total: facturas.length,
          facturas,
        }
      }),
    )
  }
  cargarFacturasSolicitud(solicitud:string) {
    const url = `${base_url}/facturas/solicitud/${solicitud}`
    return this.http.get<CargarFacturas>(url, this.headers).pipe(
      map((resp) => {
        const facturas = resp.facturas.map(
          (factura) =>
            new Factura(
              factura.solicitudViaje,
              factura.date,
              factura.descripcion,
              factura.tipoFactura,
              factura.cantidad,
              factura.moneda,
              factura.currencyExchange,
              factura.file,
              factura.activated,
              factura.usuarioCreated,
              factura.dateCreated,
              factura.lastEdited,
              factura.uid,

            ),
        )
        return {
          total: facturas.length,
          facturas,
        }
      }),
    )
  }
 
  crearFactura(formData: Factura) {
    return this.http.post(`${base_url}/facturas`, formData, this.headers)
  }


  isActivedFactura(factura: Factura) {
    const url = `${base_url}/facturas/isActive/${factura.uid}`
    const data = {
      ...factura,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarFactura(factura: Factura) {
   
    const url = `${base_url}/facturas/${factura.uid}`
    const data = {
      ...factura,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarFacturaById(id: string) {
    const url = `${base_url}/facturas/${id}`
    return this.http.get<CargarFactura>(url, this.headers)
  }
  cargarFacturaByClave(clave: string) {
    const url = `${base_url}/facturas/clave/${clave}`
    return this.http.get<CargarFactura>(url, this.headers)
  }

}
