import { Component } from '@angular/core';
import { CargarUnidadMedidas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { UnidadMedidasService } from 'src/app/core/services/unidadMedida.service';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';
 

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent {
  data!: any
   
  unidadMedidas: UnidadMedida[]
  unidadMedidasTemp: UnidadMedida[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private unidadMedidaService: UnidadMedidasService
  ) {
    this.getUnidadMedidas()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.unidadMedidas = this.unidadMedidasTemp
        return
      }
      this.busquedasService.buscar('unidadMedidas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.unidadMedidas = resp

        this.setUnidadMedidas()
      })

    }, 500);
  }




  setUnidadMedidas() {
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
  getUnidadMedidas() {
    this.loading = true
    this.unidadMedidaService.cargarUnidadMedidasAll().subscribe((resp: CargarUnidadMedidas) => {
      this.unidadMedidas = resp.unidadMedidas
    

      this.unidadMedidasTemp = resp.unidadMedidas
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editUnidadMedida(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-unidadMedida/true/${id}`)

  }
  isActived(unidadMedida: UnidadMedida) {

    this.unidadMedidaService.isActivedUnidadMedida(unidadMedida).subscribe((resp: any) => {
      this.getUnidadMedidas()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'UnidadMedidas')

      })
  }
  viewUnidadMedida(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-unidadMedida/false/${id}`)

  }

  newUnidadMedida() {

    this.functionsService.navigateTo('core/catalogos/new-unidadMedida')
  }

}
