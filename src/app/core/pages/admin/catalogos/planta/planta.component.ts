import { Component } from '@angular/core';
import { CargarPlantas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { PlantasService } from 'src/app/core/services/plantas.service';
import { Planta } from 'src/app/core/models/planta.model';
 

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-planta',
  templateUrl: './planta.component.html',
  styleUrls: ['./planta.component.css']
})
export class PlantaComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  plantas: Planta[]
  plantasTemp: Planta[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private plantaService: PlantasService
  ) {
    this.getPlantas()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.plantas = this.plantasTemp
        return
      }
      this.busquedasService.buscar('plantas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.plantas = resp

        this.setPlantas()
      })

    }, 500);
  }




  setPlantas() {
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
  getPlantas() {
    this.loading = true
    this.plantaService.cargarPlantasAll().subscribe((resp: CargarPlantas) => {
      this.plantas = resp.plantas

      this.plantasTemp = resp.plantas
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editPlanta(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-planta/true/${id}`)

  }
  isActived(planta: Planta) {

    this.plantaService.isActivedPlanta(planta).subscribe((resp: any) => {
      this.getPlantas()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Plantas')

      })
  }
  viewPlanta(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-planta/false/${id}`)

  }

  newPlanta() {

    this.functionsService.navigateTo('core/catalogos/new-planta')
  }

}

