import { Component } from '@angular/core';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { ClienteLoop } from 'src/app/core/models/clienteLoop.model';
import { ClienteLoopsService } from 'src/app/core/services/clienteLoops.service';
import { CargarClienteLoops } from '../../../../interfaces/cargar-interfaces.interfaces';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-cliente-loop',
  templateUrl: './cliente-loop.component.html',
  styleUrls: ['./cliente-loop.component.css']
})
export class ClienteLoopComponent {
  uid = this.functionsService.getLocal('uid')
  today = this.functionsService.getToday()
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
      // console.log('resp', resp)
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
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log('clientesLoop', jsonData.clienteLoop)

      this.setClientes(jsonData.clienteLoop)







    }
    reader.readAsBinaryString(file);
  }
  setClientes(clientes: any) {
    this.loading = true

    clientes.forEach(cl => {
      let cliente = {
        ...cl,
        activated:true,
        usuarioCreated: this.uid,
        dateCreated: this.today,
        lastEdited: this.today
      }
      this.clienteLoopsService.crearClienteLoop(cliente).subscribe(resp => {
        console.log('resp', resp)

      },
        (error) => {
          console.log('error', error)

        })
    });


    this.getClienteLoop()
    this.loading= false
  }
}
