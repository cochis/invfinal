import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarPipeline, CargarPipelines, CargarRol } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Pipeline } from 'src/app/core/models/pipeline.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PipelinesService {

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
  cargarPipelinesAll() {
    const url = `${base_url}/pipelines/all`
    return this.http.get<CargarPipelines>(url, this.headers).pipe(
      map((resp) => {
        const pipelines = resp.pipelines.map(
          (pipeline) =>
            new Pipeline(
              pipeline.id,
              pipeline.name,
              pipeline.stages,
              pipeline.activated,
              pipeline.usuarioCreated,
              pipeline.dateCreated,
              pipeline.lastEdited,
              pipeline.uid,

            ),
        )
        return {
          total: pipelines.length,
          pipelines,
        }
      }),
    )
  }
   
  crearPipeline(formData: any) {
    return this.http.post(`${base_url}/pipelines`, formData, this.headers)
  }


  isActivedPipeline(pipeline: Pipeline) {
    const url = `${base_url}/pipelines/isActive/${pipeline.uid}`
    const data = {
      ...pipeline,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPipeline(pipeline: Pipeline) {
    const url = `${base_url}/pipelines/${pipeline.uid}`
    const data = {
      ...pipeline,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarPipelineById(id: string) {
    const url = `${base_url}/pipelines/${id}`
    return this.http.get<CargarPipeline>(url, this.headers)
  }
  cargarPipelineByClave(clave: string) {
    const url = `${base_url}/pipelines/clave/${clave}`
    return this.http.get<CargarPipeline>(url, this.headers)
  }

}
