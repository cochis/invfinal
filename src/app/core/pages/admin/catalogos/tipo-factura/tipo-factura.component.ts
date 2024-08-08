import { Component } from '@angular/core';
import { CargarTipoFactura, CargarTipoFacturas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';


import { environment } from 'src/environments/environment';
 
  
import { TipoFacturaService } from 'src/app/core/services/tipoFactura.service';
import { TipoFactura } from 'src/app/core/models/tipoFactura.model';


@Component({
  selector: 'app-tipo-factura',
  templateUrl: './tipo-factura.component.html',
  styleUrls: ['./tipo-factura.component.css']
})
export class TipoFacturaComponent {
  data!: any
  tipoFacturas: TipoFactura[] = [];
  tipoFacturasTemp: TipoFactura[] = [];
  loading = false
  url = environment.base_url
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoFacturasServices: TipoFacturaService
  ) {
    this.getTipoFacturas()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoFacturas = this.tipoFacturasTemp
        return
      }
      this.busquedasService.buscar('tipoFacturas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoFacturas = resp


        this.setTipoFacturas()
      })

    }, 500);
  }




  setTipoFacturas() {
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
  getTipoFacturas() {
    this.loading = true
    this.tipoFacturasServices.cargarTipoFacturasAll().subscribe((resp: CargarTipoFacturas) => {
      this.tipoFacturas = resp.tipoFacturas
      this.tipoFacturasTemp = resp.tipoFacturas
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


  editTipoFactura(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-factura/true/${id}`)
  }
  isActived(tipoFactura: TipoFactura) {

    this.tipoFacturasServices.isActivedTipoFactura(tipoFactura).subscribe((resp: any) => {
      this.getTipoFacturas()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Gasto')


      })
  }
  viewTipoFactura(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-factura/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-tipo-factura')
  }

}
