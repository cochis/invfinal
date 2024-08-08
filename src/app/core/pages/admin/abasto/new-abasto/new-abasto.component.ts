import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarCargas, CargarDestinos, CargarMateriaPrimas, CargarOrigens, CargarProveedorTransportes, CargarProveedors, CargarTipoCargas, CargarUnidadMedidas, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Abasto } from 'src/app/core/models/abasto.model';
import { Carga } from 'src/app/core/models/carga.model';
import { Destino } from 'src/app/core/models/destino.model';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
import { Origen } from 'src/app/core/models/origen.model';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { ProveedorTransporte } from 'src/app/core/models/proveedorTransporte.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoCarga } from 'src/app/core/models/tipoCarga.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { AbastosService } from 'src/app/core/services/abastos.service';
import { CargasService } from 'src/app/core/services/cargas.service';
import { DestinosService } from 'src/app/core/services/destinos.service';
import { FileService } from 'src/app/core/services/file.service';
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { OrigensService } from 'src/app/core/services/origens.service';
import { ProveedorTransportesService } from 'src/app/core/services/provedorTransportes.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoCargasService } from 'src/app/core/services/tipoCargas.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { UnidadMedidasService } from 'src/app/core/services/unidadMedida.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-abasto',
  templateUrl: './new-abasto.component.html',
  styleUrls: ['./new-abasto.component.css']
})
export class NewAbastoComponent {
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]
  cargas: Carga[]
  origens: Origen[]
  unidadMedidas: UnidadMedida[]
  proveedors: Proveedor[]
  materiaPrimas: MateriaPrima[]
  destinos: Destino[]
  tipoCargas: TipoCarga[]
  proveedorTransportes: ProveedorTransporte[]
  createdAbasto: false
  abasto: Abasto
  public imagenSubir!: File
  public fotoTicketOrigenTemp: any = undefined
  public fotoTicketDestinoTemp: any = undefined
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  dateToday = this.functionsService.numberToDate(this.today)
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  url = environment.base_url
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private abastoService: AbastosService,
    private origenService: OrigensService,
    private destinoService: DestinosService,
    private unidadMedidaService: UnidadMedidasService,
    private proveedorService: ProveedorsService,
    private materiaPrimasService: MateriaPrimasService,
    private cargasService: CargasService,
    private tipoCargasService: TipoCargasService,
    private fileService: FileService,
    private proveedorTransportesService: ProveedorTransportesService ,

  ) {
    this.loading = true


    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }



  getCatalogos() {

    this.loading = true
    this.cargasService.cargarCargasAll().subscribe((resp: CargarCargas) => {
      this.cargas = this.functionsService.getActivos(resp.cargas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Cargas')
        this.loading = false
      })
    this.loading = true
    this.tipoCargasService.cargarTipoCargasAll().subscribe((resp: CargarTipoCargas) => {
      this.tipoCargas = this.functionsService.getActivos(resp.tipoCargas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Cargas')
        this.loading = false
      })
    this.loading = true
    this.origenService.cargarOrigensAll().subscribe((resp: CargarOrigens) => {
      this.origens = this.functionsService.getActivos(resp.origens)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Origenes')
        this.loading = false
      })
    this.loading = true
    this.destinoService.cargarDestinosAll().subscribe((resp: CargarDestinos) => {
      this.destinos = this.functionsService.getActivos(resp.destinos)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Destinos')
        this.loading = false
      })
    this.loading = true
    this.proveedorService.cargarProveedorsAll().subscribe((resp: CargarProveedors) => {
      this.proveedors = this.functionsService.getActivos(resp.proveedors)
      
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Origenes')
        this.loading = false
      })
    this.loading = true
    this.materiaPrimasService.cargarMateriaPrimasAll().subscribe((resp: CargarMateriaPrimas) => {
      this.materiaPrimas = this.functionsService.getActivos(resp.materiaPrimas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Destinos')
        this.loading = false
      })
    this.loading = true
    this.unidadMedidaService.cargarUnidadMedidasAll().subscribe((resp: CargarUnidadMedidas) => {
      this.unidadMedidas = this.functionsService.getActivos(resp.unidadMedidas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Destinos')
        this.loading = false
      })
      this.loading = true
      this.proveedorTransportesService.cargarProveedorTransportesAll().subscribe((resp: CargarProveedorTransportes) => {
        this.proveedorTransportes = resp.proveedorTransportes
        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Proveedores de transportes')
          this.loading = false
        })

  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      origen: ['', [Validators.required]],
      destino: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      materiaPrima: ['', [Validators.required]],
      unidadMedida: ['', [Validators.required]],
      cantidadTotal: [],
      cantidadOrigenProceso: [],
      cantidadDestinoProceso: [],
      viajes: this.fb.array([]),
      usuarioCreated: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }

  get viajes(): FormArray {
    return this.form.get("viajes") as FormArray
  }

  newViaje(): FormGroup {
    return this.fb.group({
      viajeFinalizado: [false],
      numeroTicketOrigen: [''],
      numeroTicketDestino: [''],
      proveedorTransporte: [''],
      tipoTransporte: ['', [Validators.required]],
      carga: ['', [Validators.required]],
      tipoCarga: ['', [Validators.required]],
      basculaOrigen1: [],
      basculaOrigen2: [],
      fotoTicketOrigen: [''],
      basculaDestino1: [],
      basculaDestino2: [],
      fotoTicketDestino: [''],
      fechaProceso: [''],
      fechaAbasto: [''],
    })
  }
  addViaje() {
    this.viajes.push(this.newViaje());
  }
  removeViaje(i: number) {
    this.viajes.removeAt(i);
  }

  onSubmit() {
    this.loading = true
    this.submited = true
    if (!this.createdAbasto) {

    
      if (this.form.valid) {


        this.loading = false


        if (this.form.value.viajes.length > 0) {
          var viajesA = []
          this.form.value.viajes.forEach(viaje => {
            let via = {
              ...viaje,
              fechaAbasto: new Date(viaje.fechaAbasto).getTime(),
              fechaProceso: new Date(viaje.fechaProceso).getTime(),
            }

            viajesA.push(via)
          });
       

        }




        let obj = {
          ...this.form.value,
          viajes: viajesA,
          usuarioCreated: this.functionsService.getLocal('uid')
        }
        
        this.abastoService.crearAbasto(obj).subscribe((resp: any) => {

          //Message
          this.functionsService.navigateTo('core/abasto')
          this.loading = false
        },
          (error) => {
            //Message
            this.loading = false


          })
      } else {

        //Message
        this.loading = false
        return
      }
    } else {
    
      if (this.form.valid) {


        this.loading = false


        if (this.form.value.viajes.length > 0) {
          var viajesA = []
          this.form.value.viajes.forEach(viaje => {
            let via = {
              ...viaje,
              fechaAbasto: new Date(viaje.fechaAbasto).getTime(),
              fechaProceso: new Date(viaje.fechaProceso).getTime(),
            }

            viajesA.push(via)
          });
        

        }




        let obj = {
          ...this.form.value,
          viajes: viajesA,
          usuarioCreated: this.functionsService.getLocal('uid')
        }
        
        this.abastoService.crearAbasto(obj).subscribe((resp: any) => {

          //Message
          this.functionsService.navigateTo('core/abasto')
          this.loading = false
        },
          (error) => {
            //Message
            this.loading = false


          })
      } else {

        //Message
        this.loading = false
        return
      }

    }


  }

  back() {
    this.functionsService.navigateTo('core/abasto')
  }

  cambiarImagen(file: any, tipo: string, id: number) {
    if (!this.createdAbasto) {
       
    } else {

      this.loading = true
      if (tipo === 'fotoTicketOrigenTemp') {
        this.imagenSubir = file.target.files[0]

        if (!file.target.files[0]) {
          this.fotoTicketOrigenTemp = null
          this.functionsService.alert('Abasto', 'No se encontró imagen', 'error')
          this.loading = false

        } else {


          const reader = new FileReader()
          const url64 = reader.readAsDataURL(file.target.files[0])

          reader.onloadend = () => {
            this.fotoTicketDestinoTemp = reader.result

          }
          this.subirImagen('fotoTicketOrigenTemp', id)

        }
      } else {
        this.imagenSubir = file.target.files[0]

        if (!file.target.files[0]) {
          this.fotoTicketDestinoTemp = null
          this.functionsService.alert('Abasto', 'No se encontró imagen', 'error')
          this.loading = false

        } else {


          const reader = new FileReader()
          const url64 = reader.readAsDataURL(file.target.files[0])

          reader.onloadend = () => {
            this.fotoTicketDestinoTemp = reader.result

          }
          this.subirImagen('fotoTicketDestinoTemp', id)


        }
      }
    }

  }
  subirImagen(tipo: string, id: number) {
    this.fileService
      .actualizarAbasto(this.imagenSubir, 'abastos', this.abasto.uid, tipo, id)
      .then(
        (img) => {
          this.abasto = img
          this.loading = false
          this.functionsService.alertUpdate('Usuarios')
          //message
        },
        (err) => {

          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }

  getPesaje() {
     
    var poi = 0
    var pof = 0
    var pdi = 0
    var pdf = 0
    this.form.value.viajes.forEach(viaje => {
      poi += viaje.basculaOrigen1
      pof += viaje.basculaOrigen2
      pdi += viaje.basculaDestino1
      pdf += viaje.basculaDestino2
         
    });
 

    var cop = pof - poi 
    
    var cdp = pdi - pdf 
   


    this.form.get('cantidadOrigenProceso').setValue(cop)
    this.form.get('cantidadDestinoProceso').setValue(cdp)
  }
}
