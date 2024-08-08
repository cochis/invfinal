import { Component } from '@angular/core';
import { CargarTipoMaterials } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { TipoMaterialsService } from 'src/app/core/services/tipoMaterials.service';
import { TipoMaterial } from 'src/app/core/models/tipoMaterial.model';
 

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tipo-material',
  templateUrl: './tipo-material.component.html',
  styleUrls: ['./tipo-material.component.css']
})
export class TipoMaterialComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  tipoMaterials: TipoMaterial[]
  tipoMaterialsTemp: TipoMaterial[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoMaterialService: TipoMaterialsService
  ) {
    this.getTipoMaterials()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoMaterials = this.tipoMaterialsTemp
        return
      }
      this.busquedasService.buscar('tipoMaterials', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoMaterials = resp

        this.setTipoMaterials()
      })

    }, 500);
  }




  setTipoMaterials() {
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
  getTipoMaterials() {
    this.loading = true
    this.tipoMaterialService.cargarTipoMaterialsAll().subscribe((resp: CargarTipoMaterials) => {
      this.tipoMaterials = resp.tipoMaterials

      this.tipoMaterialsTemp = resp.tipoMaterials
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoMaterial(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-tipoMaterial/true/${id}`)

  }
  isActived(tipoMaterial: TipoMaterial) {

    this.tipoMaterialService.isActivedTipoMaterial(tipoMaterial).subscribe((resp: any) => {
      this.getTipoMaterials()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'TipoMaterials')

      })
  }
  viewTipoMaterial(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipoMaterial/false/${id}`)

  }

  newTipoMaterial() {

    this.functionsService.navigateTo('core/catalogos/new-tipoMaterial')
  }

}
