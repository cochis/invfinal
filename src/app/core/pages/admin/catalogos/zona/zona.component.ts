import { Component } from '@angular/core';
import {   CargarZonas,  CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 import { Zona } from 'src/app/core/models/zona.model';
 
import { Usuario } from 'src/app/core/models/usuario.model';
import { ZonasService } from 'src/app/core/services/zona.service';
 
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent {
  ADM = environment.ADM
  url = environment.base_url 
  loading = false
  zonas: Zona[]
  usuarios: Usuario[]
  zonasTemp: Zona[]
 
  rol = this.functionsService.getLocal('role')
    constructor( 
    private functionsService: FunctionsService,
    private zonaService: ZonasService,
    private busquedasService: BusquedasService,
    private usuariosService: UsuariosService,
 
    ){
      this.getZonas()
      
    }

    buscar(termino) {
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.zonas = this.zonasTemp
          return
        }
        this.busquedasService.buscar('zonas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.zonas = resp
          
       
        })
  
      }, 500);
    }
     
    buscarCatalogo(tipo: string, value) {



      if (value == '') {
        this.zonas = this.zonasTemp
   
      }
      switch (tipo) {
        // case 'zonas':
        //   this.busquedasService.buscarCatalogo('zonas', value).subscribe((resp) => {
        //     this.zonas = resp
        //   })
        //   break;
        // case 'usuarioAsignados':
        //   this.busquedasService.buscarCatalogo('zona-usuarioAsignado', value).subscribe((resp) => {
        //     this.zonas = resp
        //   })
        //   break;
  
        case 'salon':
          break;
      }
    }
    getZonas() {
      this.loading = true
    
        
  
        this.zonaService.cargarZonasAll().subscribe((resp: CargarZonas) => {
       
  
          this.zonas = resp.zonas
          setTimeout(() => {
            this.zonasTemp = resp.zonas
  
            this.loading = false
          }, 1500);
        },
        (error)=>{
          
          this.functionsService.alertError(error,'Zona')
          this.loading = false

        });
       
    }
    
  
    editZona(id: string) {
  
      this.functionsService.navigateTo(`/core/catalogos/edit-zona/true/${id}`)
  
    }
    isActived(zona: Zona) {
  
      this.zonaService.isActivedZona(zona).subscribe((resp: any) => {
        this.getZonas()
  
  
      },
        (error: any) => {
       
          this.functionsService.alertError(error,'Zona')
  
        })
    }
    viewZona(id: string) {
      this.functionsService.navigateTo(`/core/catalogos/edit-zona/false/${id}`)
  
    }
    
    newUser() {
  
      this.functionsService.navigateTo('core/catalogos/new-zona')
    }
  }
  