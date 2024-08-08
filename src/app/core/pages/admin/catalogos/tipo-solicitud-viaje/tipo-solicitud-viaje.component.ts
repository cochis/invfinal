import { Component } from '@angular/core';

import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { BusquedasService } from 'src/app/shared/services/busquedas.service';

import { TipoSolicitudViajesService } from 'src/app/core/services/tipoSolicitudViaje.service';
import { TipoSolicitudViaje } from 'src/app/core/models/tipoSolicitudViaje.model';


import { environment } from 'src/environments/environment';
import { CargarTipoSolicitudViajes } from 'src/app/core/interfaces/cargar-interfaces.interfaces';




@Component({
  selector: 'app-tipo-solicitud-viaje',
  templateUrl: './tipo-solicitud-viaje.component.html',
  styleUrls: ['./tipo-solicitud-viaje.component.css']
})
export class TipoSolicitudViajeComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  tipoSolicitudViajes: TipoSolicitudViaje[] = []
  tipoSolicitudViajesTemp: TipoSolicitudViaje[]

  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoSolicitudViajesService: TipoSolicitudViajesService
  ) {
    this.getTipoSolicitudViajes()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoSolicitudViajes = this.tipoSolicitudViajesTemp
        return
      }
      this.busquedasService.buscar('tipoSolicitudViajes', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoSolicitudViajes = resp

        this.setTipoSolicitudViajes()
      })

    }, 500);
  }




  setTipoSolicitudViajes() {
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
  getTipoSolicitudViajes() {
    this.loading = true
    this.tipoSolicitudViajesService.cargarTipoSolicitudViajesAll().subscribe((resp: CargarTipoSolicitudViajes) => {

      this.tipoSolicitudViajes = resp.tipoSolicitudViajes
      this.tipoSolicitudViajesTemp = resp.tipoSolicitudViajes
      setTimeout(() => {
        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoSolicitudViaje(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-solicitud-viaje/true/${id}`)

  }
  isActived(tipoSolicitudViaje: TipoSolicitudViaje) {

    this.tipoSolicitudViajesService.isActivedCarga(tipoSolicitudViaje).subscribe((resp: any) => {
      this.getTipoSolicitudViajes()


    },
      (error: any) => {

        this.functionsService.alertError(error, 'TipoSolicitudViajes')

      })
  }
  viewTipoSolicitudViaje(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-solicitud-viaje/false/${id}`)

  }

  newTipoSolicitudViaje() {

    this.functionsService.navigateTo('core/catalogos/new-tipo-solicitud-viaje')
  }

}
