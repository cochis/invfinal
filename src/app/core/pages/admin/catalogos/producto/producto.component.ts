import { Component } from '@angular/core';
import {   CargarProductos,  CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 import { Producto } from 'src/app/core/models/producto.model';
 
import { Usuario } from 'src/app/core/models/usuario.model';
import { ProductosService } from 'src/app/core/services/producto.service';
 
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  ADM = environment.ADM
  url = environment.base_url 
  loading = false
  productos: Producto[]
  usuarios: Usuario[]
  productosTemp: Producto[]
 
  rol = this.functionsService.getLocal('role')
    constructor( 
    private functionsService: FunctionsService,
    private productoService: ProductosService,
    private busquedasService: BusquedasService,
    private usuariosService: UsuariosService,
 
    ){
      this.getProductos()
      
    }

    buscar(termino) {
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.productos = this.productosTemp
          return
        }
        this.busquedasService.buscar('productos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.productos = resp
          
       
        })
  
      }, 500);
    }
     
    buscarCatalogo(tipo: string, value) {



      if (value == '') {
        this.productos = this.productosTemp
   
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
    getProductos() {
      this.loading = true
    
        
  
        this.productoService.cargarProductosAll().subscribe((resp: CargarProductos) => {
       
  
          this.productos = resp.productos
          setTimeout(() => {
            this.productosTemp = resp.productos
  
            this.loading = false
          }, 1500);
        },
        (error)=>{
          
          this.functionsService.alertError(error,'Producto')
          this.loading = false

        });
       
    }
    
  
    editProducto(id: string) {
  
      this.functionsService.navigateTo(`/core/catalogos/edit-producto/true/${id}`)
  
    }
    isActived(producto: Producto) {
  
      this.productoService.isActivedProducto(producto).subscribe((resp: any) => {
        this.getProductos()
  
  
      },
        (error: any) => {
       
          this.functionsService.alertError(error,'Producto')
  
        })
    }
    viewProducto(id: string) {
      this.functionsService.navigateTo(`/core/catalogos/edit-producto/false/${id}`)
  
    }
    
    newUser() {
  
      this.functionsService.navigateTo('core/catalogos/new-producto')
    }
  }
  