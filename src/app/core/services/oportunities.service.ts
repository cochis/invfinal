import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarOportunities, CargarOportunity } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Oportunity } from 'src/app/core/models/oportunity.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class OportunitiesService {

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

  cargarOportunitiesAll() {
    const url = `${base_url}/oportunities/all`
    return this.http.get<CargarOportunities>(url, this.headers).pipe(
      map((resp) => {
        const oportunitys = resp.oportunities.map(
          (oportunity) =>
            new Oportunity(

              oportunity.id,
              oportunity.name,
              oportunity.close_date,
              oportunity.pipeline_id,
              oportunity.pipeline_stage_id,
              oportunity.priority,
              oportunity.status,
              oportunity.tags,
              oportunity.interaction_count,
              oportunity.converted_unit,
              oportunity.converted_value,
              oportunity.date_stage_changed,
              oportunity.leads_converted_from,
              oportunity.date_lead_created,
              oportunity.date_created,
              oportunity.date_modified,
              oportunity.custom_fields,
              oportunity.usuarioCreated,
              oportunity.activated,
              oportunity.dateCreated,
              oportunity.lastEdited,
              oportunity.assignee_id,
              oportunity.company_id,
              oportunity.company_name,
              oportunity.customer_source_id,
              oportunity.details,
              oportunity.loss_reason_id,
              oportunity.primary_contact_id,
              oportunity.monetary_unit,
              oportunity.monetary_value,
              oportunity.win_probability,
              oportunity.date_last_contacted,
              oportunity.uid,

            ),
        )
        return {
          total: oportunitys.length,
          oportunitys,
        }
      }),
    )
  }

  crearOportunity(formData: any) {

    return this.http.post(`${base_url}/oportunities`, formData, this.headers)
  }


  isActivedOportunity(oportunity: Oportunity) {
    const url = `${base_url}/oportunities/isActive/${oportunity.uid}`

    const data = {
      ...oportunity,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarOportunity(oportunity: Oportunity) {
    const url = `${base_url}/oportunity/${oportunity.uid}`
    const data = {
      ...oportunity,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(oportunity: Oportunity) {
    const url = `${base_url}/oportunity/pass/${oportunity.uid}`
    const data = {
      ...oportunity,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarOportunityById(id: string) {
    const url = `${base_url}/oportunity/${id}`
    return this.http.get<CargarOportunity>(url, this.headers)
  }
  cargarOportunityByEmail(email: string) {

    const url = `${base_url}/oportunity/email/${email}`

    return this.http.get<CargarOportunities>(url, this.headers)
  }

}
