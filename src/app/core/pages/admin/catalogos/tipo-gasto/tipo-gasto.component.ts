import { Component } from '@angular/core';
import { CargarEmpresas, CargarTipoGasto, CargarTipoGastos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';


import { environment } from 'src/environments/environment';


import { TipoGastoService } from 'src/app/core/services/tipoGasto.service';
import { TipoGasto } from 'src/app/core/models/tipoGasto.model';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { Empresa } from 'src/app/core/models/Empresa';


@Component({
  selector: 'app-tipo-gasto',
  templateUrl: './tipo-gasto.component.html',
  styleUrls: ['./tipo-gasto.component.css']
})
export class TipoGastoComponent {
  data!: any
  tipoGastos: TipoGasto[] = [];
  tipoGastosTemp: TipoGasto[] = [];
  loading = false
  url = environment.base_url
  empresas: Empresa[]
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoGastosServices: TipoGastoService,
    private empresasService: EmpresasService,
  ) {
    this.empresasService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = resp.empresas
    
    })
    this.getTipoGastos()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoGastos = this.tipoGastosTemp
        return
      }
      this.busquedasService.buscar('tipoGastos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoGastos = resp


        this.setTipoGastos()
      })

    }, 500);
  }




  setTipoGastos() {
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
  getTipoGastos() {
    this.loading = true
    this.tipoGastosServices.cargarTipoGastosAll().subscribe((resp: CargarTipoGastos) => {
      this.tipoGastos = resp.tipoGastos
      // console.log('this.tipoGastos', this.tipoGastos)
      this.tipoGastosTemp = resp.tipoGastos
      setTimeout(() => {
        this.loading = false
      }, 1500);
    },
      (error) => {
        this.functionsService.alertError(error, 'Tipo Gasto')
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoGasto(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-gasto/true/${id}`)
  }
  isActived(tipoGasto: TipoGasto) {

    this.tipoGastosServices.isActivedTipoGasto(tipoGasto).subscribe((resp: any) => {
      this.getTipoGastos()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Gasto')


      })
  }
  viewTipoGasto(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-gasto/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-tipo-gasto')
  }

}
