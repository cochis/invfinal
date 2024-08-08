import { Component } from '@angular/core';
import { CargarProveedorTransportes } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { ProveedorTransporte } from 'src/app/core/models/proveedorTransporte.model';
 

import { environment } from 'src/environments/environment';
import { ProveedorTransportesService } from 'src/app/core/services/provedorTransportes.service';

@Component({
  selector: 'app-proveedor-transporte',
  templateUrl: './proveedor-transporte.component.html',
  styleUrls: ['./proveedor-transporte.component.css']
})
export class ProveedorTransporteComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  proveedorTransportes: ProveedorTransporte[]
  proveedorTransportesTemp: ProveedorTransporte[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private proveedorTransporteService: ProveedorTransportesService
  ) {
    this.getProveedorTransportes()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.proveedorTransportes = this.proveedorTransportesTemp
        return
      }
      this.busquedasService.buscar('proveedorTransportes', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.proveedorTransportes = resp

        this.setProveedorTransportes()
      })

    }, 500);
  }




  setProveedorTransportes() {
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
  getProveedorTransportes() {
    this.loading = true
    this.proveedorTransporteService.cargarProveedorTransportesAll().subscribe((resp: CargarProveedorTransportes) => {
      this.proveedorTransportes = resp.proveedorTransportes

      this.proveedorTransportesTemp = resp.proveedorTransportes
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editProveedorTransporte(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-proveedorTransporte/true/${id}`)

  }
  isActived(proveedorTransporte: ProveedorTransporte) {

    this.proveedorTransporteService.isActivedProveedorTransporte(proveedorTransporte).subscribe((resp: any) => {
      this.getProveedorTransportes()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'ProveedorTransportes')

      })
  }
  viewProveedorTransporte(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-proveedorTransporte/false/${id}`)

  }

  newProveedorTransporte() {

    this.functionsService.navigateTo('core/catalogos/new-proveedorTransporte')
  }

}
