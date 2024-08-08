import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarDollarApi } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { DollarApi } from '../models/dolarApi.model';

const base_url = environment.base_url
const dolar_url = environment.dolarUrl
@Injectable({
  providedIn: 'root'
})
export class DollarApisService {

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

  cargarDollar() {
    fetch("https://mx.dolarapi.com/v1/cotizaciones/usd")
      .then(response => response.json())
      .then(data => {

        return data
      });


  }


}
