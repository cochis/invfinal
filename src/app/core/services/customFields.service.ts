import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarCustomField, CargarCustomFields, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { CustomField } from '../models/customField.model';
 
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CustomFieldsService {

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
  cargarCustomFieldsAll() {
    const url = `${base_url}/customFields/all`
    return this.http.get<CargarCustomFields>(url, this.headers).pipe(
      map((resp) => {
     
        const customFields = resp.customFields.map(
          (customField) =>
            new CustomField(
              customField.id,
              customField.name,
              customField.data_type,
              customField.available_on,
              customField.is_filterable,
              customField.activated,
              customField.usuarioCreated,
              customField.dateCreated,
              customField.lastEdited,
              customField.uid,
              customField.options,
              customField.currency,

  

            ),
        )
        return {
          total: customFields.length,
          customFields,
        }
      }),
    )
  }
   
  crearCustomField(formData: any) {
    return this.http.post(`${base_url}/customFields`, formData, this.headers)
  }


  isActivedCustomField(customField: CustomField) {
    const url = `${base_url}/customFields/isActive/${customField.uid}`
    const data = {
      ...customField,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCustomField(customField: CustomField) {
    const url = `${base_url}/customFields/${customField.uid}`
    const data = {
      ...customField,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCustomFieldById(id: string) {
    const url = `${base_url}/customFields/${id}`
    return this.http.get<CargarCustomField>(url, this.headers)
  }
  cargarCustomFieldByClave(clave: string) {
    const url = `${base_url}/customFields/clave/${clave}`
    return this.http.get<CargarCustomField>(url, this.headers)
  }

}
