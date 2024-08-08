import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarStocks, CargarStock } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Stock } from 'src/app/core/models/stock.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class StocksService {

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

  cargarStocksAll() {
    const url = `${base_url}/stock/all`
    return this.http.get<CargarStocks>(url, this.headers).pipe(
      map((resp) => {
        const stocks = resp.stocks.map(
          (stock) =>
            new Stock(
              
              stock.tipoStock,
              stock.clave,
              stock.nip,
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
        return {
          total: stocks.length,
          stocks,
        }
      }),
    )
  }
 
  crearStock(formData: Stock) {
    return this.http.post(`${base_url}/stock`, formData, this.headers)
  }


  isActivedStock(stock: Stock) {
    const url = `${base_url}/stock/isActive/${stock.uid}`

    const data = {
      ...stock,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarStock(stock: Stock) {
    const url = `${base_url}/stock/${stock.uid}`
    const data = {
      ...stock,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(stock: Stock) {
    const url = `${base_url}/stock/pass/${stock.uid}`
    const data = {
      ...stock,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarStockById(id: string) {
    const url = `${base_url}/stock/${id}`
    return this.http.get<CargarStock>(url, this.headers)
  }
  cargarStockByEmail(email: string) {

    const url = `${base_url}/stock/email/${email}`

    return this.http.get<CargarStocks>(url, this.headers)
  }

}
