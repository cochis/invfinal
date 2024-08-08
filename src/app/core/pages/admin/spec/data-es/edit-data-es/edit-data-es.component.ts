import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarDataEs, CargarPipeline, CargarRoles, CargarStock, CargarTipoStocks, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { DataEs } from 'src/app/core/models/dataEs.model';
import { Pipeline } from 'src/app/core/models/pipeline.model';
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { DataEsService } from 'src/app/core/services/dataEs.service';
import { FileService } from 'src/app/core/services/file.service';
import { PipelinesService } from 'src/app/core/services/pipelines.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';

import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-data-es',
  templateUrl: './edit-data-es.component.html',
  styleUrls: ['./edit-data-es.component.css']
})
export class EditDataEsComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined

  tipoStocks: TipoStock[]
  dataEs: DataEs
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  imgdataEs = ''

  url = environment.base_url
  ADM = environment.ADM
  usuarios: Usuario[]
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private tipoStockService: TipoStockService,
    private dataEsService: DataEsService,
    private stockService: StocksService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.loading = true
    this.imagenSubir = undefined
    this.imgTemp = undefined
    this.id = this.route.snapshot.params['id']

    this.edit = this.route.snapshot.params['edit']

    this.getId(this.id)
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  getId(id: string) {
    this.dataEsService.cargarDataEsById(id).subscribe((resp: CargarDataEs) => {
      this.dataEs = resp.dataEs
      this.imgdataEs = this.dataEs.img
      setTimeout(() => {

        this.setForm(this.dataEs)
      }, 800);

    },
      (error: any) => {


        this.functionsService.alertError(error, 'Stock')

      })
  }

  selectImg(event) {
    this.imagenSubir = event.target.files[0]
    const reader = new FileReader()
    const url64 = reader.readAsDataURL(this.imagenSubir)
    reader.onloadend = () => {
      this.imgTemp = reader.result
    }
  }


  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      numero: [''],
      producto: [''],
      fruta: [''],
      variedad: [''],
      presentacion: [''],
      tipo: [''],
      paisOrigen: [''],
      duracion: [''],
      descripcion: [''],
      img: [''],
      url: [''],
      jasuSpec: [''],
      jasuMsds: [''],
      msdsUrl: [''],
      ingredientes: [''],
      pc1: [''],
      ppc1: [''],
      pc2: [''],
      ppc2: [''],
      pc3: [''],
      ppc3: [''],
      pc4: [''],
      ppc4: [''],
      pc5: [''],
      ppc5: [''],
      pc6: [''],
      ppc6: [''],
      pc7: [''],
      ppc7: [''],
      activated: [false],
      usuarioCreated: [this.functionsService.getLocal('uid')],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }




  setForm(dataEs: DataEs) {
    this.loading = true
    setTimeout(() => {
      this.form = this.fb.group({
        numero: [dataEs.numero],
        producto: [dataEs.producto],
        fruta: [dataEs.fruta],
        variedad: [dataEs.variedad],
        presentacion: [dataEs.presentacion],
        tipo: [dataEs.tipo],
        paisOrigen: [dataEs.paisOrigen],
        duracion: [dataEs.duracion],
        descripcion: [dataEs.descripcion],
        img: [dataEs.img],
        url: [this.url + "/upload/dataEs/" + dataEs.img],
        jasuSpec: [dataEs.jasuSpec],
        jasuMsds: [dataEs.jasuMsds],
        msdsUrl: [dataEs.msdsUrl],
        ingredientes: [dataEs.ingredientes],
        pc1: [dataEs.pc1],
        ppc1: [dataEs.ppc1],
        pc2: [dataEs.pc2],
        ppc2: [dataEs.ppc2],
        pc3: [dataEs.pc3],
        ppc3: [dataEs.ppc3],
        pc4: [dataEs.pc4],
        ppc4: [dataEs.ppc4],
        pc5: [dataEs.pc5],
        ppc5: [dataEs.ppc5],
        pc6: [dataEs.pc6],
        ppc6: [dataEs.ppc6],
        pc7: [dataEs.pc7],
        ppc7: [dataEs.ppc7],
        activated: [dataEs.activated],
        usuarioCreated: [dataEs.usuarioCreated],
        dateCreated: [dataEs.dateCreated],
        lastEdited: [this.today]
      })




      this.loading = false
    }, 1500);


  }

  onSubmit() {
    this.loading = true
    this.submited = true




    if (this.form.valid) {

      this.dataEs = {
        ...this.dataEs,
        ...this.form.value,


      }


      this.dataEsService.actualizarDataEs(this.dataEs).subscribe((resp: any) => {

        setTimeout(() => {
          this.cambiarImagen(this.imagenSubir)

          this.functionsService.alertUpdate('Data en español ')

          this.functionsService.navigateTo('core/spec/data-es')
        }, 500);

      },
        (error) => {
          this.functionsService.alertError(error, 'Data en español ')
          this.loading = false



        })
    } else {


      this.loading = false

      return
    }



  }


  back() {
    this.functionsService.navigateTo('core/spec/data-es')
  }


  cambiarImagen(img: any) {
    this.loading = true


    if (!img) {
      this.imgTemp = null
      this.functionsService.alert('Data en español', 'No se encontró imagen', 'error')
      this.loading = false

    } else {


      const reader = new FileReader()
      const url64 = reader.readAsDataURL(img)

      reader.onloadend = () => {
        this.imgTemp = reader.result

      }
      this.subirImagen()

    }
  }
  subirImagen() {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'dataEs', this.dataEs.uid)
      .then(
        (img) => {
          this.dataEs.img = img
          this.loading = false
          this.functionsService.alertUpdate('Data img')
          //message
        },
        (err) => {

          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }
}
