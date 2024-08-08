import { Component } from '@angular/core';
import { CargarMateriaPrimas, CargarMonedas, CargarTipoMaterials, CargarUnidadMedidas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
 

import { environment } from 'src/environments/environment';
import { TipoMaterialsService } from 'src/app/core/services/tipoMaterials.service';
import { MonedasService } from 'src/app/core/services/monedas.service';
import { UnidadMedidasService } from 'src/app/core/services/unidadMedida.service';
import { TipoMaterial } from 'src/app/core/models/tipoMaterial.model';
import { Moneda } from 'src/app/core/models/moneda.model';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';


@Component({
  selector: 'app-materia-prima',
  templateUrl: './materia-prima.component.html',
  styleUrls: ['./materia-prima.component.css']
})
export class MateriaPrimaComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  materiaPrimas: MateriaPrima[]
  materiaPrimasTemp: MateriaPrima[]
  
  loading = false
  url = environment.base_url
  tipoMaterials: TipoMaterial[];
  monedas: Moneda[];
  unidadMedidas: UnidadMedida[];



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private materiaPrimaService: MateriaPrimasService,
    private tipoMaterialService: TipoMaterialsService,
    private unidadMedidaService: UnidadMedidasService,
    private monedaService: MonedasService,
  ) {
    this.getCatalogos()
    
      
      this.getMateriaPrimas()
    
  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.materiaPrimas = this.materiaPrimasTemp
        return
      }
      this.busquedasService.buscar('materiaPrimas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.materiaPrimas = resp

        this.setMateriaPrimas()
      })

    }, 500);
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



  setMateriaPrimas() {
    this.loading = true
    setTimeout(() => {

      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false

    }, 500);
  }
  getMateriaPrimas() {
    this.loading = true
    this.materiaPrimaService.cargarMateriaPrimasAll().subscribe((resp: CargarMateriaPrimas) => {
      this.materiaPrimas = resp.materiaPrimas
 

      this.materiaPrimasTemp = resp.materiaPrimas
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editMateriaPrima(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-materiaPrima/true/${id}`)

  }
  isActived(materiaPrima: MateriaPrima) {

    this.materiaPrimaService.isActivedMateriaPrima(materiaPrima).subscribe((resp: any) => {
      this.getMateriaPrimas()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'MateriaPrimas')

      })
  }
  viewMateriaPrima(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-materiaPrima/false/${id}`)

  }

  newMateriaPrima() {

    this.functionsService.navigateTo('core/catalogos/new-materiaPrima')
  }
 getCatalog(tipo: string, id: string) {

    if (id) {

      switch (tipo) {


        case 'tipoMaterial':


          return this.functionsService.getValueCatalog(id, 'nombre', this.tipoMaterials).toString()

          break;
        case 'unidadMedida':

 
          return this.functionsService.getValueCatalog(id, 'nombre', this.unidadMedidas).toString()

          break;
        case 'moneda':


          return this.functionsService.getValueCatalog(id, 'nombre', this.monedas).toString()

          break;

      }
    } else {
      return ''
    }

  }
}
