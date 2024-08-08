import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarAbasto, CargarCargas, CargarDestinos, CargarMateriaPrimas, CargarOrigens, CargarProveedorTransportes, CargarProveedors, CargarTipoCargas, CargarUnidadMedidas, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
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
  selector: 'app-edit-abasto',
  templateUrl: './edit-abasto.component.html',
  styleUrls: ['./edit-abasto.component.css']
})
export class EditAbastoComponent {
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]
  cargas: Carga[]
  origens: Origen[]
  unidadMedidas: UnidadMedida[]
  proveedors: Proveedor[]
  proveedorTransportes: ProveedorTransporte[]
  materiaPrimas: MateriaPrima[]
  destinos: Destino[]
  tipoCargas: TipoCarga[]
  createdAbasto: false
  abasto: Abasto
  public imagenSubir!: File
  public fotoTicketOrigenTemp: any = []
  public fotoTicketDestinoTemp: any = []
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  dateToday = this.functionsService.numberToDate(this.today)
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  constructor(
    private fb: FormBuilder,
    public functionsService: FunctionsService,
    private abastoService: AbastosService,
    private origenService: OrigensService,
    private destinoService: DestinosService,
    private unidadMedidaService: UnidadMedidasService,
    private proveedorService: ProveedorsService,
    private materiaPrimasService: MateriaPrimasService,
    private cargasService: CargasService,
    private tipoCargasService: TipoCargasService,
    private proveedorTransportesService: ProveedorTransportesService,
    private fileService: FileService,
    private route: ActivatedRoute,

  ) {
    this.id = this.route.snapshot.params['id']
   

    this.edit = this.route.snapshot.params['edit']
    this.loading = true

    this.getId(this.id)
    this.getCatalogos()
    this.createForm()
    this.loading = true
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
  
    this.tipoCargasService.cargarTipoCargasAll().subscribe((resp: CargarTipoCargas) => {
      this.tipoCargas = this.functionsService.getActivos(resp.tipoCargas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Cargas')
      
      })
 
    this.origenService.cargarOrigensAll().subscribe((resp: CargarOrigens) => {
      this.origens = this.functionsService.getActivos(resp.origens)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Origenes')
        this.loading = false
      })
     
    this.destinoService.cargarDestinosAll().subscribe((resp: CargarDestinos) => {
      this.destinos = this.functionsService.getActivos(resp.destinos)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Destinos')
        this.loading = false
      })
     
    this.proveedorService.cargarProveedorsAll().subscribe((resp: CargarProveedors) => {
      this.proveedors = this.functionsService.getActivos(resp.proveedors)
     
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Origenes')
        this.loading = false
      })
   
    this.materiaPrimasService.cargarMateriaPrimasAll().subscribe((resp: CargarMateriaPrimas) => {
      this.materiaPrimas = this.functionsService.getActivos(resp.materiaPrimas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Destinos')
        this.loading = false
      })
    
    this.unidadMedidaService.cargarUnidadMedidasAll().subscribe((resp: CargarUnidadMedidas) => {
      this.unidadMedidas = this.functionsService.getActivos(resp.unidadMedidas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Destinos')
        this.loading = false
      })
  
      this.proveedorTransportesService.cargarProveedorTransportesAll().subscribe((resp: CargarProveedorTransportes) => {
        this.proveedorTransportes = resp.proveedorTransportes
        
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Proveedores de transportes')
          this.loading = false
        })


  }

  get errorControl() {
    return this.form.controls;
  }
  getId(id: string) {

    this.loading = true
    this.abastoService.cargarAbastoById(id).subscribe((resp: CargarAbasto) => {
      this.abasto = resp.abasto
      setTimeout(() => {
        this.setForm(this.abasto)
      }, 1500);
    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Tipo ticket')
      })
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
      finzalizado: [false],
      usuarioCreated: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
    
  }
  setForm(abasto: Abasto) {
    this.form = this.fb.group({
      origen: [abasto.origen, [Validators.required]],
      destino: [abasto.destino, [Validators.required]],
      proveedor: [abasto.proveedor, [Validators.required]],
      materiaPrima: [abasto.materiaPrima, [Validators.required]],
      unidadMedida: [abasto.unidadMedida, [Validators.required]],
      cantidadTotal: [abasto.cantidadTotal],
      cantidadOrigenProceso: [abasto.cantidadOrigenProceso?abasto.cantidadOrigenProceso.toFixed(6):''],
      cantidadDestinoProceso: [abasto.cantidadDestinoProceso?abasto.cantidadDestinoProceso.toFixed(6):''],
      viajes: this.fb.array([]),
      finalizado: [abasto.finalizado],
      usuarioCreated: [abasto.usuarioCreated],
      activated: [abasto.activated],
      dateCreated: [abasto.dateCreated],
      lastEdited: [this.today],
    })
    if(abasto.viajes.length>0){
      abasto.viajes.forEach(viaje => {
         
        this.fotoTicketOrigenTemp.push(viaje.fotoTicketOrigen)
        this.fotoTicketDestinoTemp.push(viaje.fotoTicketDestino)
        this.setViaje(viaje)
      });

    }
     
    // this.form.get('cantidadOrigenProceso').setValue(abasto.cantidadOrigenProceso.toFixed(6))
    // this.form.get('cantidadDestinoProceso').setValue(abasto.cantidadDestinoProceso.toFixed(6))
    this.loading=false


  }
 

  get viajes(): FormArray {
    return this.form.get("viajes") as FormArray
  }

  newViaje(): FormGroup {
    return this.fb.group({
      viajeFinalizado: [false],
      numeroTicketOrigen: [''],
      numeroTicketDestino: [''],
      proveedorTransporte: ['', [Validators.required]],
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
  viaje(viaje): FormGroup {
    
    return this.fb.group({
      viajeFinalizado: [viaje.viajeFinalizado],
      numeroTicketOrigen: [viaje.numeroTicketOrigen],
      numeroTicketDestino: [viaje.numeroTicketDestino],
      proveedorTransporte: [viaje.proveedorTransporte, [Validators.required]],
      tipoTransporte: [viaje.tipoTransporte, [Validators.required]],
      carga: [viaje.carga, [Validators.required]],
      tipoCarga: [viaje.tipoCarga, [Validators.required]],
      basculaOrigen1: [viaje.basculaOrigen1],
      basculaOrigen2: [viaje.basculaOrigen2],
      fotoTicketOrigen: [viaje.fotoTicketOrigen?viaje.fotoTicketOrigen:''],
      basculaDestino1: [viaje.basculaDestino1],
      basculaDestino2: [viaje.basculaDestino2],
      fotoTicketDestino: [viaje.fotoTicketDestino?viaje.fotoTicketDestino:''],
      fechaProceso: [this.functionsService.numberToDate(viaje.fechaProceso)],
      fechaAbasto: [this.functionsService.numberToDate(viaje.fechaAbasto)],
    })
  }
  
  setViaje(viaje) {
    this.viajes.push(this.viaje(viaje));
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
          ...this.abasto,
          ...this.form.value,
          viajes: viajesA,
          usuarioCreated: this.functionsService.getLocal('uid')
        }
        
       


 

        this.abastoService.actualizarAbasto(obj).subscribe((resp: any) => {
         
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
    
      this.loading = true
        this.imagenSubir = file.target.files[0]
       
        if (!file.target.files[0]) {
          this.fotoTicketOrigenTemp = null
          this.functionsService.alert('Abasto', 'No se encontró imagen', 'error')
          this.loading = false

        } else {


          const reader = new FileReader()
          const url64 = reader.readAsDataURL(this.imagenSubir)
      

          reader.onloadend = () => {
            this.fotoTicketDestinoTemp[id] = reader.result

          }
          this.subirImagen('abastos', tipo, id )
         
        }
      
    

  }
  subirImagen(tipo: string, tipoViaje:string, id: number) {
 
    
 
    this.loading = false
    
    this.imagenSubir
    
    if(!this.imagenSubir.type.includes("image")){
     
      this.functionsService.alert('Subir imagen','Formato no valido, solo imágenes','error')
    return 
      
    }
     
    this.fileService
      .actualizarAbasto(this.imagenSubir, 'abastos', this.abasto.uid, tipoViaje, id)
      .then(
        (img) => {
          this.abasto = img
          this.loading = false
          this.functionsService.alertUpdate('Usuarios')
        
            
            this.createForm()
            this.getId(this.id)
         
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
    var cdp = pdi - pdf - (poi-pdf)
    this.form.get('cantidadOrigenProceso').setValue(cop.toFixed(6))
    this.form.get('cantidadDestinoProceso').setValue(cdp.toFixed(6))
  }
}
