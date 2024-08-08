import { Component } from '@angular/core';
import {   CargarIncoterms,  CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 import { Incoterm } from 'src/app/core/models/incoterm.model';
 
import { Usuario } from 'src/app/core/models/usuario.model';
import { IncotermsService } from 'src/app/core/services/incoterm.service';
 
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-incoterm',
  templateUrl: './incoterm.component.html',
  styleUrls: ['./incoterm.component.css']
})
export class IncotermComponent {
  ADM = environment.ADM
  url = environment.base_url 
  loading = false
  incoterms: Incoterm[]
  usuarios: Usuario[]
  incotermsTemp: Incoterm[]
 
  rol = this.functionsService.getLocal('role')
    constructor( 
    private functionsService: FunctionsService,
    private incotermsService: IncotermsService,
    private busquedasService: BusquedasService,
    private usuariosService: UsuariosService,
 
    ){
      this.getIncoterms()
      
    }

    buscar(termino) {
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.incoterms = this.incotermsTemp
          return
        }
        this.busquedasService.buscar('incoterms', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.incoterms = resp
          
       
        })
  
      }, 500);
    }
     
    buscarCatalogo(tipo: string, value) {



      if (value == '') {
        this.incoterms = this.incotermsTemp
   
      }
      switch (tipo) {
        // case 'incoterms':
        //   this.busquedasService.buscarCatalogo('incoterms', value).subscribe((resp) => {
        //     this.incoterms = resp
        //   })
        //   break;
        // case 'usuarioAsignados':
        //   this.busquedasService.buscarCatalogo('incoterm-usuarioAsignado', value).subscribe((resp) => {
        //     this.incoterms = resp
        //   })
        //   break;
  
        case 'salon':
          break;
      }
    }
    getIncoterms() {
      this.loading = true
    
        
  
        this.incotermsService.cargarIncotermsAll().subscribe((resp: CargarIncoterms) => {
       
         
       
  
          this.incoterms = resp.incoterms
          setTimeout(() => {
            this.incotermsTemp = resp.incoterms
  
            this.loading = false
          }, 1500);
        },
        (error)=>{
          
          this.functionsService.alertError(error,'Incoterm')
          this.loading = false

        });
       
    }
    
  
    editIncoterm(id: string) {
  
      this.functionsService.navigateTo(`/core/catalogos/edit-incoterm/true/${id}`)
  
    }
    isActived(incoterm: Incoterm) {
  
      this.incotermsService.isActivedIncoterm(incoterm).subscribe((resp: any) => {
        this.getIncoterms()
  
  
      },
        (error: any) => {
       
          this.functionsService.alertError(error,'Incoterm')
  
        })
    }
    viewIncoterm(id: string) {
      this.functionsService.navigateTo(`/core/catalogos/edit-incoterm/false/${id}`)
  
    }
    
    newUser() {
  
      this.functionsService.navigateTo('core/catalogos/new-incoterm')
    }
  }
  