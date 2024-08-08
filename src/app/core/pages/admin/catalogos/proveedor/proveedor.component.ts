import { Component } from '@angular/core';
import {   CargarMateriaPrimas, CargarProveedors,  CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
 import { Proveedor } from 'src/app/core/models/proveedor.model';
 
import { Usuario } from 'src/app/core/models/usuario.model';
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
 
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent {
  ADM = environment.ADM
  url = environment.base_url 
  loading = false
  proveedors: Proveedor[]
  materiaPrimas: MateriaPrima[]
  proveedorsTemp: Proveedor[]
 
  rol = this.functionsService.getLocal('role')
    constructor( 
    private functionsService: FunctionsService,
    private proveedorService: ProveedorsService,
    private busquedasService: BusquedasService,
    private materiaPrimasService: MateriaPrimasService,
 
    ){
      this.getCatalogos()
      this.getProveedors()
      
    }

    buscar(termino) {
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.proveedors = this.proveedorsTemp
          return
        }
        this.busquedasService.buscar('proveedors', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.proveedors = resp
          
          
       
        })
  
      }, 500);
    }
     
    buscarCatalogo(tipo: string, value) {



      if (value == '') {
        this.proveedors = this.proveedorsTemp
   
      }
      switch (tipo) {
        // case 'proveedors':
        //   this.busquedasService.buscarCatalogo('proveedors', value).subscribe((resp) => {
        //     this.proveedors = resp
        //   })
        //   break;
        // case 'usuarioAsignados':
        //   this.busquedasService.buscarCatalogo('proveedor-usuarioAsignado', value).subscribe((resp) => {
        //     this.proveedors = resp
        //   })
        //   break;
  
        case 'salon':
          break;
      }
    }
    getProveedors() {
      this.loading = true
    
        
  
        this.proveedorService.cargarProveedorsAll().subscribe((resp: CargarProveedors) => {
       
  
          this.proveedors = resp.proveedors
         
          setTimeout(() => {
            this.proveedorsTemp = resp.proveedors
  
            this.loading = false
          }, 1500);
        },
        (error)=>{
          
          this.functionsService.alertError(error,'Proveedor')
          this.loading = false

        });
       
    }
    
    getCatalogos() {

      this.loading = true
      this.materiaPrimasService.cargarMateriaPrimasAll().subscribe((resp: CargarMateriaPrimas) => {
        this.materiaPrimas = resp.materiaPrimas
        
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Materias Primas')
          this.loading = false
        })
    }
    editProveedor(id: string) {
  
      this.functionsService.navigateTo(`/core/catalogos/edit-proveedor/true/${id}`)
  
    }
    isActived(proveedor: Proveedor) {
  
      this.proveedorService.isActivedProveedor(proveedor).subscribe((resp: any) => {
        this.getProveedors()
  
  
      },
        (error: any) => {
       
          this.functionsService.alertError(error,'Proveedor')
  
        })
    }
    viewProveedor(id: string) {
      this.functionsService.navigateTo(`/core/catalogos/edit-proveedor/false/${id}`)
  
    }
    
    newUser() {
  
      this.functionsService.navigateTo('core/catalogos/new-proveedor')
    }
    getCatalog(tipo: string, id: string) {
  

      if (id) {
  
        switch (tipo) {
  
  
          case 'materiaPrimas':
  
  
            return this.functionsService.getValueCatalog(id, 'nombre', this.materiaPrimas).toString()
  
            break;
           
  
   
  
        }
      } else {
        return ''
      }
  
    }
  }
  