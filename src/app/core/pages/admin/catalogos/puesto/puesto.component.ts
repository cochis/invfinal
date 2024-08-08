import { Component } from '@angular/core';
import { CargarPuestos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { PuestosService } from 'src/app/core/services/puesto.service';
import { Puesto } from 'src/app/core/models/puesto.model';
 

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-puesto',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.css']
})
export class PuestoComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  puestos: Puesto[]
  puestosTemp: Puesto[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private puestoService: PuestosService
  ) {
    this.getPuestos()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.puestos = this.puestosTemp
        return
      }
      this.busquedasService.buscar('puestos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.puestos = resp

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
  getPuestos() {
    this.loading = true
    this.puestoService.cargarPuestosAll().subscribe((resp: CargarPuestos) => {
      this.puestos = resp.puestos
      this.puestosTemp = resp.puestos
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editPuesto(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-puesto/true/${id}`)

  }
  isActived(puesto: Puesto) {

    this.puestoService.isActivedPuesto(puesto).subscribe((resp: any) => {
      this.getPuestos()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Puestos')

      })
  }
  viewPuesto(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-puesto/false/${id}`)

  }

  newPuesto() {

    this.functionsService.navigateTo('core/catalogos/new-puesto')
  }

}
