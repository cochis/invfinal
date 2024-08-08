import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarPipeline, CargarRoles, CargarStock, CargarTipoStocks, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
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
  selector: 'app-new-data-es',
  templateUrl: './new-data-es.component.html',
  styleUrls: ['./new-data-es.component.css']
})
export class NewDataEsComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined


  dataEs: DataEs
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false

  id!: string
  edit!: string
  imgUrl: string = ''
  url = environment.base_url
  ADM = environment.ADM
  usuarios: Usuario[]
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fileService: FileService,
    private dataEsService: DataEsService,

  ) {

    this.loading = true


    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
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




  selectImg(event) {
    this.imagenSubir = event.target.files[0]
    const reader = new FileReader()
    const url64 = reader.readAsDataURL(this.imagenSubir)
    reader.onloadend = () => {
      this.imgTemp = reader.result
    }
  }





  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      this.dataEsService.crearDataEs(this.form.value).subscribe((resp: any) => {
        this.dataEs = resp.dataEs
        this.functionsService.alertUpdate('Data en español')
        if (this.imagenSubir) {
          if (resp.ok) {
            this.loading = true
            setTimeout(() => {
              this.cambiarImagen(this.imagenSubir)

            }, 1500);
          }

        } else {

          this.functionsService.navigateTo('core/spec/data-es')
        }
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Data en español')
          this.loading = false



        })

      setTimeout(() => {
        this.loading = false
      }, 1500);
    } else {


      this.loading = false

      return
    }



  }


  back() {
    this.functionsService.navigateTo('core/copper/pipelines')
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
