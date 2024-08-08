import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarProductos, CargarProducto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Producto } from 'src/app/core/models/producto.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ProductosService {

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

  cargarProductosAll() {
    const url = `${base_url}/producto/all`
    return this.http.get<CargarProductos>(url, this.headers).pipe(
      map((resp) => {
        const productos = resp.productos.map(
          (producto) =>
            new Producto(
              
              producto.nombre,
              producto.clave,
              producto.activated,
              producto.usuarioCreated,
              producto.dateCreated,
              producto.lastEdited,
              producto.uid,

            ),
        )
        return {
          total: productos.length,
          productos,
        }
      }),
    )
  }
 
  crearProducto(formData: Producto) {
    return this.http.post(`${base_url}/producto`, formData, this.headers)
  }


  isActivedProducto(producto: Producto) {
    const url = `${base_url}/producto/isActive/${producto.uid}`

    const data = {
      ...producto,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarProducto(producto: Producto) {
    const url = `${base_url}/producto/${producto.uid}`
    const data = {
      ...producto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(producto: Producto) {
    const url = `${base_url}/producto/pass/${producto.uid}`
    const data = {
      ...producto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarProductoById(id: string) {
    const url = `${base_url}/producto/${id}`
    return this.http.get<CargarProducto>(url, this.headers)
  }
  cargarProductoByEmail(email: string) {

    const url = `${base_url}/producto/email/${email}`

    return this.http.get<CargarProductos>(url, this.headers)
  }

}
