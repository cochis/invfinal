import { Component } from '@angular/core';
import { CargarPipelines } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Pipeline } from 'src/app/core/models/pipeline.model';
import { ContacType } from 'src/app/core/models/contacType.model';
import { UserCopper } from 'src/app/core/models/userCopper.model';
import { CopperServices } from 'src/app/core/services/copper.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { PipelinesService } from 'src/app/core/services/pipelines.service';

@Component({
  selector: 'app-pipelines',
  templateUrl: './pipelines.component.html',
  styleUrls: ['./pipelines.component.css']
})
export class PipelinesComponent {

  loading = false
  pipelines: Pipeline[] = []
  pipelinesTemp: Pipeline[]
  userCoppers: UserCopper[]
  contacTypes: ContacType[]

  rol = this.functionsService.getLocal('role')
  constructor(
    private copperServices: CopperServices,
    private pipelinesServices: PipelinesService,
    private functionsService: FunctionsService,
  ) {
    this.getCatalogos()
    this.getPipelines()
  }
  getCatalogos() {
    this.copperServices.cargarUserCoppesAll().subscribe((resp: any) => {

      this.userCoppers = resp.userCoppers
    })
    this.copperServices.cargarContacTypeAll().subscribe((resp: any) => {

      this.contacTypes = resp.contacTypes

    })
  }
  getPipelines() {
    this.loading = true
    this.pipelinesServices.cargarPipelinesAll().subscribe((resp: CargarPipelines) => {


      setTimeout(() => {
        this.pipelines = resp.pipelines

        this.pipelinesTemp = resp.pipelines
        this.loading = false

      }, 1500);


    })
  }

  editPipeline(id: string) {

    this.functionsService.navigateTo(`/core/copper/pipelines/edit-pipeline/true/${id}`)

  }
  isActived(pipeline: Pipeline) {

    this.pipelinesServices.isActivedPipeline(pipeline).subscribe((resp: any) => {
      this.getPipelines()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Pipelines')

      })
  }
  viewPipeline(id: string) {
    this.functionsService.navigateTo(`/core/copper/pipelines/edit-pipeline/false/${id}`)

  }
  asignatedBy(type: String, id: number) {
    if (id !== null) {

      if (type === 'assignee_id') {
        if (this.userCoppers.filter((usC) => usC.id === id)) {

          var user = this.userCoppers.filter((usC) => usC.id === id);
          return user[0].name
        } else {
          return ''
        }
      }
      else if (type === 'contact_type_id') {
        if (this.contacTypes.filter((usC) => usC.id === id)) {

          var contacType = this.contacTypes.filter((usC) => usC.id === id);

          if (contacType.length > 0) {

            return contacType[0].name
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
      else {
        return ''
      }
    } else {
      return ''
    }
  }
  newPipeline() {

    this.functionsService.navigateTo('core/copper/pipelines/new-pipeline')
  }

} 
