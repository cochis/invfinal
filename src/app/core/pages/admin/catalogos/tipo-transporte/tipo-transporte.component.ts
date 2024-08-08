import { Component } from '@angular/core';
import { CargarTipoTransportes } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

 
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { CargasService } from 'src/app/core/services/cargas.service';
import { Carga } from 'src/app/core/models/carga.model';
 

import { environment } from 'src/environments/environment';
import { TipoTransportesService } from 'src/app/core/services/tipoTransporte.service';
import { TipoTransporte } from 'src/app/core/models/tipoTransporte.model';


@Component({
  selector: 'app-tipo-transporte',
  templateUrl: './tipo-transporte.component.html',
  styleUrls: ['./tipo-transporte.component.css']
})
export class TipoTransporteComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  tipoTransportes: Carga[]
  tipoTransportesTemp: Carga[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoTransportesService: TipoTransportesService
  ) {
    this.getTipoTransportes()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoTransportes = this.tipoTransportesTemp
        return
      }
      this.busquedasService.buscar('tipoTransportes', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoTransportes = resp

        this.setCargas()
      })

    }, 500);
  }




  setCargas() {
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
  getTipoTransportes() {
    this.loading = true
    this.tipoTransportesService.cargarTipoTransportesAll().subscribe((resp: CargarTipoTransportes) => {
   
      this.tipoTransportes = resp.tipoTransportes

      this.tipoTransportesTemp = resp.tipoTransportes
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoTransporte(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-transporte/true/${id}`)

  }
  isActived(tipoTransporte: TipoTransporte) {

    this.tipoTransportesService.isActivedCarga(tipoTransporte).subscribe((resp: any) => {
      this.getTipoTransportes()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Cargas')

      })
  }
  viewTipoTransporte(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-transporte/false/${id}`)

  }

  newTipoTransporte() {

    this.functionsService.navigateTo('core/catalogos/new-tipo-transporte')
  }

}
