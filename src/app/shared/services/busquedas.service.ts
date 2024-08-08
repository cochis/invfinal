import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Abasto } from 'src/app/core/models/abasto.model';
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { Ticket } from 'src/app/core/models/ticket.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class BusquedasService {
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
  constructor(private http: HttpClient) { }
  private transformaUsuario(resultado: any): Usuario[] {
    return resultado.map(
      (user) =>
        new Usuario(

          user.nombre,
          user.apellidoPaterno,
          user.apellidoMaterno,
          user.usuario,
          user.email,
          user.password,
          user.img,
          user.role,
          user.puesto,
          user.departamento,
          user.supervisor,
          user.emmpresa,
          user.usuarioCreated,
          user.activated,
          user.dateCreated,
          user.lastEdited,
          user.uid,


        ),
    )
  }
  private transformaRole(resultado: any): Role[] {
    return resultado.map(
      (role) =>
        new Role(
          role.nombre,
          role.clave,
          role.activated,
          role.usuarioCreated,
          role.dateCreated,
          role.lastEdited,
          role.uid
        ),
    )
  }
  private transformaStock(resultado: any): Stock[] {
    return resultado.map(
      (stock) =>
        new Stock(

          stock.tipoStock,
          stock.clave,
          stock.modelo,
          stock.serie,
          stock.img,
          stock.status,
          stock.asignado,
          stock.usuarioAsignado,
          stock.activated,
          stock.usuarioCreated,
          stock.dateCreated,
          stock.lastEdited,
          stock.uid,

        ),
    )
  }

  private transformaTicket(resultado: any): Ticket[] {
    return resultado.map(
      (ticket) =>
        new Ticket(

          ticket.tipoTicket,
          ticket.usuarioCreated,
          ticket.usuarioAtendio,
          ticket.descripcion,
          ticket.respuesta,
          ticket.img,
          ticket.estado,
          ticket.activated,
          ticket.dateCreated,
          ticket.lastEdited,
          ticket.uid,

        ),
    )
  }

  private transformaAbasto(resultado: any): Abasto[] {
    return resultado.map(
      (abasto) =>
        new Abasto(

          abasto.origen,
          abasto.destino,
          abasto.proveedor,
          abasto.materiaPrima,
          abasto.unidadMedida,
          abasto.cantidadTotal,
          abasto.cantidadOrigenProceso,
          abasto.cantidadDestinoProceso,
          abasto.viajes,
          abasto.usuarioCreated,
          abasto.activated,
          abasto.dateCreated,
          abasto.lastEdited,
          abasto.uid,

        ),
    )
  }


  buscar(
    tipo: 'usuarios' | 'roles' | 'tipoStocks' | 'tipoTickets' | 'stocks' | 'tickets' 
        | 'cargas' |'tipoCargas' |'proveedors'|'zonas'|'incoterms' | 'tipoProveedors' 
        | 'productos'| 'origens'| 'destinos' | 'tipoMaterials' | 'unidadMedidas' | 'monedas'
        | 'materiaPrimas' |'abastos' | 'companias' | 'proveedorTransportes' | 'plantas'
        | 'subsidiarias'| 'terminoPagos' |'tipoGastos' |'pagoProgramados' |'departamentos' 
        |'puestos' |'tipoTransportes' |'tipoSolicitudViajes' | 'solicitudViajes'| 'tipoFacturas' | 'empresas' |'proveedorLoop'|'clienteLoop',
    termino: string = '',
    admin: true | false,
  ): any {


    const url = `${base_url}/search/coleccion/${tipo}/${termino}/${admin}`

    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
      

        switch (tipo) {
          case 'usuarios':
            return this.transformaUsuario(resp.resultados)
            break
          case 'roles':
            return this.transformaRole(resp.resultados)
            break
          case 'tipoStocks':
            return this.transformaRole(resp.resultados)
            break
          case 'tipoTickets':
            return this.transformaRole(resp.resultados)
            break
          case 'stocks':
            return this.transformaStock(resp.resultados)
            break
          case 'tickets':
            return this.transformaTicket(resp.resultados)
            break
          case 'abastos':
            return this.transformaAbasto(resp.resultados)
            break

          default:
            return false
            break
        }
      }),
    )
  }
  buscarCatalogo(
    tipo: 'usuarios' | 'roles' | 'usuarios-rol' | 'tipoStocks' | 'stocks' | 'stock-usuarioAsignado' | 'usuarios-ticket' | 
          'tipoTicket-ticket' | 'estado-ticket' | 'origens-abasto' | 'proveedors-abasto' | 'destinos-abasto' |
          'materiaPrimas-abasto' | 'pagoProgramados'| 'solicitudViajes',
    termino: string = '',
    ): any {
      const url = `${base_url}/search/coleccion-catalogo/${tipo}/${termino}`
    


    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformaUsuario(resp.resultados)
            break
          case 'usuarios-rol':
            return this.transformaUsuario(resp.resultados)
            break
          case 'roles':
            return this.transformaRole(resp.resultados)
            break
          case 'tipoStocks':
            return this.transformaRole(resp.resultados)
            break
          case 'stocks':
            return this.transformaStock(resp.resultados)
            break
          case 'stock-usuarioAsignado':
            return this.transformaStock(resp.resultados)
            break
          case 'usuarios-ticket':
            return this.transformaTicket(resp.resultados)
            break
          case 'tipoTicket-ticket':
            return this.transformaTicket(resp.resultados)
            break
          case 'estado-ticket':
            return this.transformaTicket(resp.resultados)
            break
          case 'origens-abasto':
            return this.transformaAbasto(resp.resultados)
            break
          case 'destinos-abasto':
            return this.transformaAbasto(resp.resultados)
            break
          case 'proveedors-abasto':
            return this.transformaAbasto(resp.resultados)
            break
          case 'materiaPrimas-abasto':
            return this.transformaAbasto(resp.resultados)
            break

          default:
            return false
            break
        }
      }),
    )
  }
}
