import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarDataEss, CargarDataEs } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { DataEs } from '../models/dataEs.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class DataEsService {

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



  cargarDataEssAll() {


    const url = `${base_url}/specDataEss/all`
    return this.http.get<CargarDataEss>(url, this.headers).pipe(
      map((resp) => {

        const dataEss = resp.dataEss.map(
          (dataEs) =>
            new DataEs(
              dataEs.numero,
              dataEs.producto,
              dataEs.fruta,
              dataEs.variedad,
              dataEs.presentacion,
              dataEs.tipo,
              dataEs.paisOrigen,
              dataEs.duracion,
              dataEs.descripcion,
              dataEs.img,
              dataEs.url,
              dataEs.jasuSpec,
              dataEs.jasuMsds,
              dataEs.msdsUrl,
              dataEs.ingredientes,
              dataEs.pc1,
              dataEs.ppc1,
              dataEs.pc2,
              dataEs.ppc2,
              dataEs.pc3,
              dataEs.ppc3,
              dataEs.pc4,
              dataEs.ppc4,
              dataEs.pc5,
              dataEs.ppc5,
              dataEs.pc6,
              dataEs.ppc6,
              dataEs.pc7,
              dataEs.ppc7,
              dataEs.usuarioCreated,
              dataEs.activated,
              dataEs.dateCreated,
              dataEs.lastEdited,
              dataEs.uid,


            ),
        )
        return {
          total: dataEss.length,
          dataEss,
        }
      }),
    )
  }


  crearDataEs(formData: DataEs) {
    return this.http.post(`${base_url}/specDataEss`, formData, this.headers)
  }


  isActivedDataEs(dataEs: DataEs) {
    const url = `${base_url}/specDataEss/isActive/${dataEs.uid}`
    const data = {
      ...dataEs,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarDataEs(dataEs: DataEs) {

    const url = `${base_url}/specDataEss/${dataEs.uid}`
    const data = {
      ...dataEs,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarDataEsById(id: string) {
    const url = `${base_url}/specDataEss/${id}`
    return this.http.get<CargarDataEs>(url, this.headers)
  }
  cargarDataEsByClave(clave: string) {
    const url = `${base_url}/specDataEss/clave/${clave}`
    return this.http.get<CargarDataEs>(url, this.headers)
  }

}
