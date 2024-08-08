import { Component } from '@angular/core';
import { CargarTipoStocks } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';


import { environment } from 'src/environments/environment';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';



@Component({
  selector: 'app-tipo-stock',
  templateUrl: './tipo-stock.component.html',
  styleUrls: ['./tipo-stock.component.css']
})
export class TipoStockComponent {
  data!: any
  tipoStocks: TipoStock[] = [];
  tipoStocksTemp: TipoStock[] = [];
  loading = false
  url = environment.base_url
constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoStocksServices: TipoStockService
  ) {
    this.getTipoStocks()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoStocks = this.tipoStocksTemp
        return
      }
      this.busquedasService.buscar('tipoStocks', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoStocks = resp

        this.setTipoStocks()
      })

    }, 500);
  }




  setTipoStocks() {
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
  getTipoStocks() {
    this.loading = true
    this.tipoStocksServices.cargarTipoStocksAll().subscribe((resp: CargarTipoStocks) => {
     
 
      this.tipoStocks = resp.tipoStocks
this.tipoStocksTemp = resp.tipoStocks
      setTimeout(() => {
this.loading = false
      }, 1500);
    },
      (error) => {
        this.functionsService.alertError(error,'Tipo stock')
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoStock(id: string) {
this.functionsService.navigateTo(`/core/catalogos/edit-tipoStock/true/${id}`)
}
  isActived(tipoStock: TipoStock) {

    this.tipoStocksServices.isActivedTipoStock(tipoStock).subscribe((resp: any) => {
      this.getTipoStocks()


    },
      (error: any) => {
        this.functionsService.alertError(error,'Tipo stock')


      })
  }
  viewTipoStock(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipoStock/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-tipoStock')
  }

}
