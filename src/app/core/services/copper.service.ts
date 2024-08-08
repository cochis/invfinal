import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { CustomField } from '../models/customField.model';
import { Company } from '../models/company.model';
import { UserCopper } from '../models/userCopper.model';
import { ContacType } from '../models/contacType.model';
import { CargarCompany } from '../interfaces/cargar-interfaces.interfaces';


const base_url = environment.base_url
const base_urlC = environment.base_copper
@Injectable({
  providedIn: 'root'
})
export class CopperServices {

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
  get headersCoopers() {
    return {
      headers: {
        'X-PW-AccessToken': environment.XAccessToken,
        'X-PW-Application': 'developer_api',
        'X-PW-UserEmail': environment.XUserEmail,
        'Content-Type': 'application/json'
      },
    }
  }
  crearCustomField(formData: CustomField) {
    return this.http.post(`${base_url}/customFields`, formData, this.headers)
  }
  crearuserCopper(formData: UserCopper) {
    return this.http.post(`${base_url}/userCoppers`, formData, this.headers)
  }
  crearCompany(formData: Company) {
    return this.http.post(`${base_url}/companies`, formData, this.headers)
  }
  cargarCustomFieldAll() {
    // const url = `${base_url}/custom_field_definitions`
    const url = base_urlC + `/custom_field_definitions`
    return this.http.get(url, this.headersCoopers)

  }
  crearContacType(formData: ContacType) {
    return this.http.post(`${base_url}/contacTypes`, formData, this.headers)
  }
  cargarContacTypeAll() {
    // const url = `${base_url}/custom_field_definitions`
    const url = base_url + `/contacTypes/all`
    return this.http.get(url, this.headersCoopers)

  }
  cargarCompaniesAll() {
    // const url = `${base_url}/custom_field_definitions`
    const url = base_url + `/companies/all`
    return this.http.get(url, this.headersCoopers)

  }
  cargarUserCoppesAll() {
    // const url = `${base_url}/custom_field_definitions`
    const url = base_url + `/userCoppers/all`
    return this.http.get(url, this.headersCoopers)

  }
  cargarCompaniesAllC(page: number, cantidad: number, sort: string) {

    let data = {
      "page_number": page,
      "page_size": cantidad,
      "sort_by": sort
    }
    // const url = `${base_url}/custom_field_definitions`
    const url = base_urlC + `/companies/search`
    return this.http.post(url, data, this.headersCoopers)

  }


  cargarCompanyById(id:string){
    const url = `${base_url}/companies/${id}`
    return this.http.get<CargarCompany>(url, this.headers)
  }
  //   cargarCompaniasAll() {
  //     const url = `${base_url}/companias/all`
  //     return this.http.get<CargarCompanias>(url, this.headers).pipe(
  //       map((resp) => {
  //         const companias = resp.companias.map(
  //           (compania) =>
  //             new Compania(
  //               compania.nombre,
  //               compania.clave,
  //               compania.calle,
  //               compania.ciudad,
  //               compania.estado,
  //               compania.pais,
  //               compania.codigoPostal,
  //               compania.activated,
  //               compania.usuarioCreated,
  //               compania.dateCreated,
  //               compania.lastEdited,
  //               compania.uid,

  //             ),
  //         )
  //         return {
  //           total: companias.length,
  //           companias,
  //         }
  //       }),
  //     )
  //   }
  //   cargarCompaniasSalon() {
  //     const url = `${base_url}/companias/all/salon`
  //     return this.http.get<CargarCompanias>(url, this.headers).pipe(
  //       map((resp) => {
  //         const companias = resp.companias.map(
  //           (compania) =>
  //           new Compania(
  //             compania.nombre,
  //             compania.clave,
  //             compania.calle,
  //             compania.ciudad,
  //             compania.estado,
  //             compania.pais,
  //             compania.codigoPostal,
  //             compania.activated,
  //             compania.usuarioCreated,
  //             compania.dateCreated,
  //             compania.lastEdited,
  //             compania.uid,

  //           ),
  //         )
  //         return {
  //           total: companias.length,
  //           companias,
  //         }
  //       }),
  //     )
  //   }
  //   cargarAlumnos(desde: number = 0, cantidad: number = 10) {
  //     const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
  //     return this.http.get<CargarCompanias>(url, this.headers).pipe(
  //       map((resp) => {
  //         const companias = resp.companias.map(
  //           (compania) =>
  //             new Compania(
  //               compania.nombre,
  //               compania.clave,
  //               compania.calle,
  //               compania.ciudad,
  //               compania.estado,
  //               compania.pais,
  //               compania.codigoPostal,
  //               compania.activated,
  //               compania.usuarioCreated,
  //               compania.dateCreated,
  //               compania.lastEdited,
  //               compania.uid,

  //             ),
  //         )
  //         return {
  //           total: companias.length,
  //           companias,
  //         }
  //       }),
  //     )
  //   }



  //   isActivedCompania(compania: Compania) {
  //     const url = `${base_url}/companias/isActive/${compania.uid}`
  //     const data = {
  //       ...compania,
  //       lastEdited: Date.now(),
  //     }
  //     return this.http.put(url, data, this.headers)
  //   }
  //   actualizarCompania(compania: Compania) {
  //     const url = `${base_url}/companias/${compania.uid}`
  //     const data = {
  //       ...compania,
  //       lastEdited: Date.now(),
  //     }
  //     return this.http.put(url, data, this.headers)
  //   }

  //   cargarCompaniaById(id: string) {
  //     const url = `${base_url}/companias/${id}`
  //     return this.http.get<CargarCompania>(url, this.headers)
  //   }
  //   cargarCompaniaByClave(clave: string) {
  //     const url = `${base_url}/companias/clave/${clave}`
  //     return this.http.get<CargarCompania>(url, this.headers)
  //   }

}
