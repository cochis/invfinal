import { Component } from '@angular/core';
import { ModalService } from '@developer-partners/ngx-modal-dialog';

import { CargarPagoProgramados, CargarPagoProgramado, CargarUsuarios, CargarUsuario, CargarProveedorLoops } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { PagoProgramado } from 'src/app/core/models/pagoProgramado.model';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { PagoProgramadoService } from 'src/app/core/services/pagoProgramado.service';
import { ProveedorLoopsService } from 'src/app/core/services/proveedorLoops.service';

import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-pagos-programados',
  templateUrl: './pagos-programados.component.html',
  styleUrls: ['./pagos-programados.component.css']
})
export class PagosProgramadosComponent {
  ADM = environment.ADM
  CTB = environment.CTB
  CTM = environment.CTM
  url = environment.base_url
  loading = false
  pdfSubir: any
  pdfTemp: any
  pagoProgramados: PagoProgramado[]
  pagoProgramado: PagoProgramado
  proveedorLoops: ProveedorLoop[]
  proveedorLoopsTemp: ProveedorLoop[]
  usuario: Usuario
  pagoProgramadosTemp: PagoProgramado[]
  uid = this.functionsService.getLocal('uid')
  rol = this.functionsService.getLocal('role')
  constructor(
    private functionsService: FunctionsService,
    private pagoProgramadoService: PagoProgramadoService,
    private busquedasService: BusquedasService,
    private proveedorLoopsService: ProveedorLoopsService,
    private usuariosService: UsuariosService,
    private readonly modalService: ModalService,
    private fileService: FileService,
  ) {

    this.getPagoProgramados()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.pagoProgramados = this.pagoProgramadosTemp
        return
      }
      this.busquedasService.buscar('pagoProgramados', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.pagoProgramados = resp
        console.log('this.pagoProgramados', this.pagoProgramados)


      })

    }, 500);
  }

  buscarCatalogo(tipo: string, value) {



    if (value == '') {
      this.pagoProgramados = this.pagoProgramadosTemp

    }
    switch (tipo) {
      case 'pagoProgramados':
        this.busquedasService.buscarCatalogo('pagoProgramados', value).subscribe((resp) => {
          this.pagoProgramados = resp
        })
        break;


    }
  }

  getUsuarios() {

    console.log(this.uid);

    this.loading = true



  }
  getPagoProgramados() {

    this.loading = true




    this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {

      this.usuario = resp.usuario
      console.log('this.usuario', this.usuario)
      if (this.rol.includes(this.ADM) || this.rol.includes(this.CTB) || this.rol.includes(this.CTM)) {
        this.pagoProgramadoService.cargarPagoProgramadosAll().subscribe((resp: any) => {
          this.pagoProgramados = resp.pagoProgramados.filter((pago) => {
            return this.usuario.empresa.includes(pago.empresa._id)
          })
          this.pagoProgramadosTemp = this.pagoProgramados
          this.loading = false
        },
          (error) => {
            console.log('error', error)
            this.loading = false
            this.functionsService.alertError(error, 'Pagos programados')
          });
      } else {
        this.pagoProgramadoService.cargarPagoProgramadosByCreated(this.uid).subscribe((resp: any) => {
          console.log('resp', resp)
          this.pagoProgramados = resp.pagoProgramados
          this.pagoProgramadosTemp = resp.pagoProgramados
          this.loading = false
        },
          (error) => {
            console.log('error', error)
            this.loading = false
            this.functionsService.alertError(error, 'Pagos programados')
          });
      }
      this.loading = false

    },
      (error) => {
        this.functionsService.alertError(error, 'PagoProgramado')

      });

    this.proveedorLoopsService.cargarProveedorLoopsAll().subscribe((resp: CargarProveedorLoops) => {
      this.proveedorLoops = resp.proveedorLoops
      console.log('this.proveedorLoops', this.proveedorLoops)
      this.loading = false
    },
      (error) => {
        this.functionsService.alertError(error, 'PagoProgramado')

      });




  }
  editPagoProgramado(id: string) {

    this.functionsService.navigateTo(`/core/pagos-programados/edit-pago-programado/true/${id}`)

  }
  isActived(pagoProgramado: PagoProgramado) {

    this.pagoProgramadoService.isActivedPagoProgramado(pagoProgramado).subscribe((resp: any) => {
      this.getPagoProgramados()


    },
      (error: any) => {

        this.functionsService.alertError(error, 'PagoProgramado')

      })
  }
  viewPagoProgramado(id: string) {
    this.functionsService.navigateTo(`/core/pagos-programados/edit-pago-programado/false/${id}`)

  }

  newUser() {

    this.functionsService.navigateTo('core/new-pago-programado')
  }

  showPdf(pagoProgramado: PagoProgramado) {
    this.modalService.show<PagoProgramado>(ModalComponent, {
      title: 'Ver pdf',
      size: 1,
      model: pagoProgramado,
      mode: 'fullScreen'
    })
  }


  async subirFactura(file, pagoProgramado) {

    this.pagoProgramado = pagoProgramado

    const reader = new FileReader()
    this.pdfSubir = file.target.files[0]
    const url64 = await reader.readAsDataURL(file.target.files[0])
    reader.onloadend = async () => {
      this.pdfTemp = await reader.result

      setTimeout(() => {

        this.fileService
          .actualizarFoto(this.pdfSubir, 'pagoProgramado', this.pagoProgramado.uid)
          .then(
            async (file) => {
              this.pagoProgramado.factura = file

              this.functionsService.navigateTo('core/pagos-programados')
              this.loading = false


            },
            (err) => {
              this.loading = false
              this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
            },
          )
      }, 500);
    }



  }





}
