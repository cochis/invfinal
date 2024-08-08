import { Component } from '@angular/core';
import { CargarDataEss, CargarProductos, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { DataEs } from 'src/app/core/models/dataEs.model';
import { Producto } from 'src/app/core/models/producto.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { DataEsService } from 'src/app/core/services/dataEs.service';
import { ProductosService } from 'src/app/core/services/producto.service';

import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-data-es',
  templateUrl: './data-es.component.html',
  styleUrls: ['./data-es.component.css']
})
export class DataEsComponent {
  ADM = environment.ADM
  url = environment.base_url
  loading = false

  dataEss!: DataEs[]
  dataEssTemp!: DataEs[]


  rol = this.functionsService.getLocal('role')
  constructor(
    private functionsService: FunctionsService,
    private dataEsService: DataEsService,
    private busquedasService: BusquedasService,
    private usuariosService: UsuariosService,

  ) {
    this.getDataEsS()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.dataEss = this.dataEssTemp
        return
      }
      this.busquedasService.buscar('productos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.dataEss = resp


      })

    }, 500);
  }

  buscarCatalogo(tipo: string, value) {



    if (value == '') {
      this.dataEss = this.dataEssTemp

    }
    switch (tipo) {
      // case 'productos':
      //   this.busquedasService.buscarCatalogo('productos', value).subscribe((resp) => {
      //     this.productos = resp
      //   })
      //   break;
      // case 'usuarioAsignados':
      //   this.busquedasService.buscarCatalogo('producto-usuarioAsignado', value).subscribe((resp) => {
      //     this.productos = resp
      //   })
      //   break;

      case 'salon':
        break;
    }
  }
  getDataEsS() {
    this.loading = true



    this.dataEsService.cargarDataEssAll().subscribe((resp: CargarDataEss) => {
      this.dataEss = resp.dataEss
      setTimeout(() => {
        this.dataEssTemp = resp.dataEss

        this.loading = false
      }, 500);
    },
      (error) => {

        this.functionsService.alertError(error, 'Producto')
        this.loading = false

      });

  }


  editProducto(id: string) {

    this.functionsService.navigateTo(`/core/spec/data-es/edit-data-es/true/${id}`)

  }
  isActived(dataEs: DataEs) {

    this.dataEsService.isActivedDataEs(dataEs).subscribe((resp: any) => {
      this.getDataEsS()


    },
      (error: any) => {

        this.functionsService.alertError(error, 'Producto')

      })
  }
  viewProducto(id: string) {
    this.functionsService.navigateTo(`/core/spec/data-es/edit-data-es/false/${id}`)

  }

  newUser() {

    this.functionsService.navigateTo('core/spec/new-data-es')
  }
}
