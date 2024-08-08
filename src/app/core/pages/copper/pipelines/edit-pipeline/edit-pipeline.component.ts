import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarPipeline, CargarRoles, CargarStock, CargarTipoStocks, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Pipeline } from 'src/app/core/models/pipeline.model';
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { PipelinesService } from 'src/app/core/services/pipelines.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';

import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-pipeline',
  templateUrl: './edit-pipeline.component.html',
  styleUrls: ['./edit-pipeline.component.css']
})
export class EditPipelineComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined

  tipoStocks: TipoStock[]
  pipeline: Pipeline
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  ADM = environment.ADM
  usuarios: Usuario[]
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private tipoStockService: TipoStockService,
    private pipelinesServices: PipelinesService,
    private stockService: StocksService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.id = this.route.snapshot.params['id']

    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getCatalogos()
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  getId(id: string) {


    this.pipelinesServices.cargarPipelineById(id).subscribe((resp: CargarPipeline) => {

      this.pipeline = resp.pipeline


      setTimeout(() => {

        this.setForm(this.pipeline)
      }, 500);

    },
      (error: any) => {


        this.functionsService.alertError(error, 'Stock')

      })
  }


  getCatalogos() {

    this.loading = true
    this.tipoStockService.cargarTipoStocksAll().subscribe((resp: CargarTipoStocks) => {
      this.tipoStocks = resp.tipoStocks

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Stock')
        this.loading = false


      })
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = this.functionsService.getActivos(resp.usuarios)


    },
      (error: any) => {

        this.functionsService.alertError(error, 'Stock')
        this.loading = false


      })



  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: [''],
      stages: this.fb.array([]),
      activated: [false],
      usuarioCreated: [''],
      dateCreated: [''],
      lastEdited: [this.today],
    })
  }

  get stages(): FormArray {
    return this.form.get("stages") as FormArray
  }
  newStage(): FormGroup {
    return this.fb.group({
      id: [''],
      name: [''],
      win_probability: [''],
    })
  }
  stage(stage): FormGroup {

    return this.fb.group({
      id: [stage.id],
      name: [stage.name],
      win_probability: [stage.win_probability],
    })
  }

  setStage(stage: any) {
    this.stages.push(this.stage(stage));
  }
  addStage() {
    this.stages.push(this.newStage());
  }
  removeStage(i: number) {
    this.stages.removeAt(i);
  }








  setForm(pipeline: Pipeline) {

    this.loading = true
    setTimeout(() => {

      this.form = this.fb.group({
        id: [pipeline.id],
        name: [pipeline.name],
        stages: this.fb.array([]),
        activated: [pipeline.activated],
        usuarioCreated: [pipeline.usuarioCreated],
        dateCreated: [pipeline.dateCreated],
        lastEdited: [this.today]
      })

      if (pipeline.stages.length > 0) {
        pipeline.stages.forEach(stage => {
          this.setStage(stage)
        });
      }




      this.loading = false
    }, 1500);


  }

  onSubmit() {
    this.loading = true
    this.submited = true




    if (this.form.valid) {

      this.pipeline = {
        ...this.pipeline,
        ...this.form.value,


      }


      this.pipelinesServices.actualizarPipeline(this.pipeline).subscribe((resp: any) => {

        this.functionsService.alertUpdate('Pipelines')

        this.functionsService.navigateTo('core/copper/pipelines')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Pipelines')
          this.loading = false



        })
    } else {


      this.loading = false

      return
    }



  }


  back() {
    this.functionsService.navigateTo('core/copper/pipelines')
  }

}
