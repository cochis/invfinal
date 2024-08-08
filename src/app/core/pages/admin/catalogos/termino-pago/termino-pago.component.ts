import { Component } from '@angular/core';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';


import { environment } from 'src/environments/environment';
 
 
 
import { TerminoPagoService } from 'src/app/core/services/terminoPago.service';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { CargarTerminoPagos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-termino-pago',
  templateUrl: './termino-pago.component.html',
  styleUrls: ['./termino-pago.component.css']
})
export class TerminoPagoComponent {
  data!: any
  terminoPagos: TerminoPago[] = [];
  terminoPagosTemp: TerminoPago[] = [];
  loading = false
  url = environment.base_url
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private terminoPagosServices: TerminoPagoService
  ) {
    this.getTerminoPagos()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.terminoPagos = this.terminoPagosTemp
        return
      }
      this.busquedasService.buscar('terminoPagos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.terminoPagos = resp


        this.setTerminoPagos()
      })

    }, 500);
  }




  setTerminoPagos() {
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
  getTerminoPagos() {
    this.loading = true
    this.terminoPagosServices.cargarTerminoPagosAll().subscribe((resp: CargarTerminoPagos) => {
      this.terminoPagos = resp.terminoPagos
      this.terminoPagosTemp = resp.terminoPagos
      setTimeout(() => {
        this.loading = false
      }, 1500);
    },
      (error) => {
        this.functionsService.alertError(error, 'Tipo stock')
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTerminoPago(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-termino-pago/true/${id}`)
  }
  isActived(terminoPago: TerminoPago) {

    this.terminoPagosServices.isActivedTerminoPago(terminoPago).subscribe((resp: any) => {
      this.getTerminoPagos()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo stock')


      })
  }
  viewTerminoPago(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-termino-pago/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-termino-pago')
  }

}
