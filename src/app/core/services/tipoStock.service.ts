import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoStocks, CargarTipoStock } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { TipoStock } from '../models/tipoStock.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoStockService {

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

 
  cargarTipoStocksAll() {
    const url = `${base_url}/tipoStock/all`
    return this.http.get<CargarTipoStocks>(url, this.headers).pipe(
      map((resp) => {
   
        const tipoStocks = resp.tipoStocks.map(
          (tipoStocks) =>
            new TipoStock(
              tipoStocks.nombre,
              tipoStocks.clave,
              tipoStocks.activated,
              tipoStocks.usuarioCreated,
              tipoStocks.dateCreated,
              tipoStocks.lastEdited,
              tipoStocks.uid,

            ),
        )
        return {
          total: tipoStocks.length,
          tipoStocks,
        }
      }),
    )
  }
  cargarTipoStock() {
    const url = `${base_url}/roles/all/tipoStock`
    return this.http.get<CargarTipoStocks>(url, this.headers).pipe(
      map((resp) => {
        const tipoStocks = resp.tipoStocks.map(
          (tipoStock) =>
            new Role(
              tipoStock.nombre,
              tipoStock.clave,
              tipoStock.activated,
              tipoStock.usuarioCreated,
              tipoStock.dateCreated,
              tipoStock.lastEdited,
              tipoStock.uid,

            ),
        )
        return {
          total: tipoStocks.length,
          tipoStocks,
        }
      }),
    )
  }
  
  crearTipoStock(formData: TipoStock) {
    return this.http.post(`${base_url}/tipoStock`, formData, this.headers)
  }


  isActivedTipoStock(tipoStock: TipoStock) {
    const url = `${base_url}/tipoStock/isActive/${tipoStock.uid}`
    const data = {
      ...tipoStock,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoStock(tipoStock: TipoStock) {
    
    const url = `${base_url}/tipoStock/${tipoStock.uid}`
    const data = {
      ...tipoStock,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoStockById(id: string) {
    const url = `${base_url}/tipoStock/${id}`
    return this.http.get<CargarTipoStock>(url, this.headers)
  }
  cargarTipoStockByClave(clave: string) {
    const url = `${base_url}/tipoStock/clave/${clave}`
    return this.http.get<CargarTipoStock>(url, this.headers)
  }

}
