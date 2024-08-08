import { Component } from '@angular/core';
import { CargarClienteLoop, CargarPuestos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { PuestosService } from 'src/app/core/services/puesto.service';
import { Puesto } from 'src/app/core/models/puesto.model';
 

import { environment } from 'src/environments/environment';
import { ClienteLoop } from 'src/app/core/models/clienteLoop.model';
import { ClienteLoopsService } from 'src/app/core/services/clienteLoops.service';
import { CargarClienteLoops } from '../../../../interfaces/cargar-interfaces.interfaces';
@Component({
  selector: 'app-cliente-loop',
  templateUrl: './cliente-loop.component.html',
  styleUrls: ['./cliente-loop.component.css']
})
export class ClienteLoopComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  clienteLoops: ClienteLoop[] =[]
  clienteLoopsTemp: ClienteLoop[]=[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
   private clienteLoopsService: ClienteLoopsService
  ) {
    this.getClienteLoop()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.clienteLoops = this.clienteLoopsTemp
        return
      }
      this.busquedasService.buscar('clienteLoop', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.clienteLoops = resp

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
  getClienteLoop() {
    this.loading = true
    this.clienteLoopsService.cargarClienteLoopsAll().subscribe((resp: CargarClienteLoops) => {
      console.log('resp', resp)
      this.clienteLoops = resp.clienteLoops
      this.clienteLoopsTemp = resp.clienteLoops
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editClienteLoop(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-cliente-loop/true/${id}`)

  }
  isActived(clienteLoop : ClienteLoop) {

    this.clienteLoopsService.isActivedClienteLoop(clienteLoop).subscribe((resp: any) => {
      this.getClienteLoop()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'ClienteLoops')

      })
  }
  viewClienteLoop(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-cliente-loop/false/${id}`)

  }

  newClienteLoop() {

    this.functionsService.navigateTo('core/catalogos/new-cliente-loop')
  }

}
