import { Component } from '@angular/core';
import { CargarTipoProveedors } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';


import { environment } from 'src/environments/environment';
import { TipoProveedor } from 'src/app/core/models/tipoProveedor.model';
import { TipoProveedorService } from 'src/app/core/services/tipoProveedor.service';


@Component({
  selector: 'app-tipo-proveedor',
  templateUrl: './tipo-proveedor.component.html',
  styleUrls: ['./tipo-proveedor.component.css']
})
export class TipoProveedorComponent {
  data!: any
  tipoProveedors: TipoProveedor[] = [];
  tipoProveedorsTemp: TipoProveedor[] = [];
  loading = false
  url = environment.base_url
constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoProveedorsServices: TipoProveedorService
  ) {
    this.getTipoProveedors()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoProveedors = this.tipoProveedorsTemp
        return
      }
      this.busquedasService.buscar('tipoProveedors', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoProveedors = resp

        this.setTipoProveedors()
      })

    }, 500);
  }




  setTipoProveedors() {
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
  getTipoProveedors() {
    this.loading = true
    this.tipoProveedorsServices.cargarTipoProveedorsAll().subscribe((resp: CargarTipoProveedors) => {
     
 
      this.tipoProveedors = resp.tipoProveedors
this.tipoProveedorsTemp = resp.tipoProveedors
      setTimeout(() => {
this.loading = false
      }, 1500);
    },
      (error) => {
        this.functionsService.alertError(error,'Tipo stock')
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoProveedor(id: string) {
this.functionsService.navigateTo(`/core/catalogos/edit-tipoProveedor/true/${id}`)
}
  isActived(tipoProveedor: TipoProveedor) {

    this.tipoProveedorsServices.isActivedTipoProveedor(tipoProveedor).subscribe((resp: any) => {
      this.getTipoProveedors()


    },
      (error: any) => {
        this.functionsService.alertError(error,'Tipo stock')


      })
  }
  viewTipoProveedor(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipoProveedor/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-tipoProveedor')
  }

}
