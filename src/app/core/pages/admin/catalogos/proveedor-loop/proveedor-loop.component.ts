import { Component } from '@angular/core';
import { CargarProveedorLoop, CargarPuestos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { PuestosService } from 'src/app/core/services/puesto.service';
import { Puesto } from 'src/app/core/models/puesto.model';
 

import { environment } from 'src/environments/environment';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';
import { ProveedorLoopsService } from 'src/app/core/services/proveedorLoops.service';
import { CargarProveedorLoops } from '../../../../interfaces/cargar-interfaces.interfaces';
@Component({
  selector: 'app-proveedor-loop',
  templateUrl: './proveedor-loop.component.html',
  styleUrls: ['./proveedor-loop.component.css']
})
export class ProveedorLoopComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  proveedorLoops: ProveedorLoop[] =[]
  proveedorLoopsTemp: ProveedorLoop[]=[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
   private proveedorLoopsService: ProveedorLoopsService
  ) {
    this.getProveedorLoop()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.proveedorLoops = this.proveedorLoopsTemp
        return
      }
      this.busquedasService.buscar('proveedorLoop', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.proveedorLoops = resp

        this.setPuestos()
      })

    }, 500);
  }




  setPuestos() {
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
  getProveedorLoop() {
    this.loading = true
    this.proveedorLoopsService.cargarProveedorLoopsAll().subscribe((resp: CargarProveedorLoops) => {
      console.log('resp', resp)
      this.proveedorLoops = resp.proveedorLoops
      this.proveedorLoopsTemp = resp.proveedorLoops
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editProveedorLoop(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-proveedor-loop/true/${id}`)

  }
  isActived(proveedorLoop : ProveedorLoop) {

    this.proveedorLoopsService.isActivedProveedorLoop(proveedorLoop).subscribe((resp: any) => {
      this.getProveedorLoop()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'ProveedorLoops')

      })
  }
  viewProveedorLoop(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-proveedor-loop/false/${id}`)

  }

  newProveedorLoop() {

    this.functionsService.navigateTo('core/catalogos/new-proveedor-loop')
  }

}
