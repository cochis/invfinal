import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
import { RolesService } from 'src/app/core/services/roles.service';
 
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { TipoMaterialsService } from 'src/app/core/services/tipoMaterials.service';
import { CargarMonedas, CargarTipoMaterials, CargarUnidadMedidas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoMaterial } from 'src/app/core/models/tipoMaterial.model';
import { UnidadMedidasService } from 'src/app/core/services/unidadMedida.service';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';
import { MonedasService } from 'src/app/core/services/monedas.service';
import { Moneda } from 'src/app/core/models/moneda.model';

@Component({
  selector: 'app-new-materia-prima',
  templateUrl: './new-materia-prima.component.html',
  styleUrls: ['./new-materia-prima.component.css']
})
export class NewMateriaPrimaComponent {
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]
  materiaPrima: MateriaPrima
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoMaterials:TipoMaterial[]
  unidadMedidas:UnidadMedida[]
  monedas:Moneda[]


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
   
    private materiaPrimasService: MateriaPrimasService,
    private tipoMaterialService: TipoMaterialsService,
    private unidadMedidaService: UnidadMedidasService,
    private monedaService: MonedasService,
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
    this.tipoMaterialService.cargarTipoMaterialsAll().subscribe((resp: CargarTipoMaterials) => {
      this.tipoMaterials = this.functionsService.getActivos(resp.tipoMaterials)
       
      this.loading = false
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Material')
        this.loading = false
      })
    this.loading = true
    this.monedaService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActivos(resp.monedas)
    
      this.loading = false
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Unidad de medida')
        this.loading = false
      })
    this.loading = true
    this.unidadMedidaService.cargarUnidadMedidasAll().subscribe((resp: CargarUnidadMedidas) => {
      this.unidadMedidas = this.functionsService.getActivos(resp.unidadMedidas)
      
      this.loading = false
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Unidad de medida')
        this.loading = false
      })
    // this.loading = true
    // this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
    //   this.usuarios = this.functionsService.getActivos(resp.usuarios)


    // },
    //   (error: any) => {

    //     this.functionsService.alertError(error, 'Stock')
    //     this.loading = false


    //   })


  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      nombre: [''],
      clave: [''],
      descripcion: [''],
      tipoMaterial: [''],
      unidadMedida: [''],
      precioStd: [''],
      moneda: [''],
      variedad: [''],
      area: [''],
      tipo: [''],
      usuarioCreated: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
 
    if (this.form.valid) {
       
      if (this.form.value.usuarioAsignado != '') {
        this.form.value.asignado = true
      }
      else {
        this.form.value.asignado = false
      }

      this.loading = false

      let obj = {
        ...this.form.value,
        usuarioCreated: this.functionsService.getLocal('uid')
      }
      this.materiaPrimasService.crearMateriaPrima(obj).subscribe((resp: any) => {

        //Message
        this.functionsService.navigateTo('core/catalogos/materiaPrima')
        this.loading = false
      },
        (error) => {
  
          this.loading = false


        })
    } else {

      //Message
      this.loading = false
      return
    }


  }

  back() {
    this.functionsService.navigateTo('core/catalogos/materiaPrima')
  }

}
