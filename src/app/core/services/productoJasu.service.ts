import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarProductoJasus, CargarProductoJasu } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { ProductoJasu } from 'src/app/core/models/productoJasu.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ProductoJasusService {

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

  cargarProductoJasusInit() {
    const url = `${base_url}/productoJasu/all`
    return this.http.get<CargarProductoJasus>(url, this.headers).pipe(
      map((resp) => {
        const productoJasus = resp.productoJasus.map(
          (productoJasu) =>
            new ProductoJasu(

              productoJasu.id,
              productoJasu.product,
              productoJasu.fruit,
              productoJasu.descriptionEn,
              productoJasu.image,
              productoJasu.url,
              productoJasu.category,
              productoJasu.producto,
              productoJasu.fruta,
              productoJasu.descripcionEs,
              productoJasu.imagen,
              productoJasu.categoria,
              productoJasu.activated,
              productoJasu.usuarioCreated,
              productoJasu.dateCreated,
              productoJasu.lastEdited,
              productoJasu.variedad,
              productoJasu.paisOrigen,
              productoJasu.variety,
              productoJasu.countryOrigin,
              productoJasu.uid,

 
            ),
        )
        return {
          total: productoJasus.length,
          productoJasus,
        }
      }),
    )
  }
  cargarProductoJasusAll() {
    const url = `${base_url}/productoJasu/all`
    return this.http.get<CargarProductoJasus>(url, this.headers).pipe(
      map((resp) => {
        const productoJasus = resp.productoJasus.map(
          (productoJasu) =>
            new ProductoJasu(
              productoJasu.id,
              productoJasu.product,
              productoJasu.fruit,
              productoJasu.descriptionEn,
              productoJasu.image,
              productoJasu.url,
              productoJasu.category,
              productoJasu.producto,
              productoJasu.fruta,
              productoJasu.descripcionEs,
              productoJasu.imagen,
              productoJasu.categoria,
              productoJasu.activated,
              productoJasu.usuarioCreated,
              productoJasu.dateCreated,
              productoJasu.lastEdited,
              productoJasu.variedad,
              productoJasu.paisOrigen,
              productoJasu.variety,
              productoJasu.countryOrigin,
              productoJasu.uid,

            ),
        )
        return {
          total: productoJasus.length,
          productoJasus,
        }
      }),
    )
  }
 
  crearProductoJasu(formData: ProductoJasu) {
    return this.http.post(`${base_url}/productoJasu`, formData, this.headers)
  }


  isActivedProductoJasu(productoJasu: ProductoJasu) {
    const url = `${base_url}/productoJasu/isActive/${productoJasu.uid}`
    const data = {
      ...productoJasu,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarProductoJasu(productoJasu: ProductoJasu) {
   
    const url = `${base_url}/productoJasu/${productoJasu.uid}`
    const data = {
      ...productoJasu,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarProductoJasuById(id: string) {
    const url = `${base_url}/productoJasu/${id}`
    return this.http.get<CargarProductoJasu>(url, this.headers)
  }
  dropProductoJasu() {
    const url = `${base_url}/productoJasu/table/drop`
    return this.http.put(url, [],this.headers)
  }
  cargarProductoJasuByClave(clave: string) {
    const url = `${base_url}/productoJasu/clave/${clave}`
    return this.http.get<CargarProductoJasu>(url, this.headers)
  }

}
