import { Component } from '@angular/core';
import {   CargarAsignacions, CargarStocks, CargarTipoStocks, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Asignacion } from 'src/app/core/models/asignacion.model';
 import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { AsignacionsService } from 'src/app/core/services/asignacion.service';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent  {
  ADM = environment.ADM  
  url = environment.base_url 
  loading = false
  asignacions: Asignacion[]
  asignacionsTemp: Asignacion[]
  usuarios: Usuario[]
  usuariosTemp: Usuario[]
  stocks: Stock[]
  stocksTemp: Stock[]
  rol = this.functionsService.getLocal('role')
    constructor( 
    private functionsService: FunctionsService,
    private stockService: StocksService,
    private usuariosService: UsuariosService,
    private asignacionService: AsignacionsService,
    ){
      this.getAsignacions()
      this.getCatalogos()
    }
  
    getAsignacions() {
      this.loading = true
   
        
  
        this.asignacionService.cargarAsignacionsAll().subscribe((resp: CargarAsignacions) => {
       
  
          this.asignacions = resp.asignacions
          setTimeout(() => {
            this.asignacionsTemp = resp.asignacions
  
            this.loading = false
          }, 1500);
        },
        (error)=>{
          this.functionsService.alertError(error,'Asignación')
        });
       
    }
  
    getCatalogos() {
  
      this.loading = true
     
  
      this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
 
  
        this.usuarios = resp.usuarios
        setTimeout(() => {
          this.usuariosTemp = resp.usuarios
  
          this.loading = false
        }, 1500);
      });
      this.stockService.cargarStocksAll().subscribe((resp: CargarStocks) => {
     
  
        this.stocks = resp.stocks
        setTimeout(() => {
          this.stocksTemp = resp.stocks
  
          this.loading = false
        }, 1500);
      });
  
    }
    editStock(id: string) {
  
      this.functionsService.navigateTo(`/core/edit-assignment/true/${id}`)
  
    }
    isActived(asignacion: Asignacion) {
  this.asignacionService.isActivedAsignacion(asignacion).subscribe((resp: any) => {
        this.getAsignacions()
      },
        (error: any) => {
        
          this.functionsService.alertError(error,'Asignación')
  
        })
    }
    viewAsignacion(id: string) {
      this.functionsService.navigateTo(`/core/edit-assignment/false/${id}`)
  
    }
  
    newAsignacion() {
  
      this.functionsService.navigateTo('core/new-assignment')
    }
  }
  