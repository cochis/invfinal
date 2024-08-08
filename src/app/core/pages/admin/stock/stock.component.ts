import { Component } from '@angular/core';
import {   CargarStocks, CargarTipoStocks, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
 import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  ADM = environment.ADM
  url = environment.base_url 
  loading = false
  stocks: Stock[]
  usuarios: Usuario[]
  stocksTemp: Stock[]
  tipoStocks: TipoStock[]
  tipoStocksTemp: TipoStock[]
  rol = this.functionsService.getLocal('role')
    constructor( 
    private functionsService: FunctionsService,
    private stockService: StocksService,
    private busquedasService: BusquedasService,
    private usuariosService: UsuariosService,
    private tipoStockService: TipoStockService,
    ){
      this.getStocks()
      this.getTipoStocks()
      this.getUsuarios()
    }

    buscar(termino) {
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.stocks = this.stocksTemp
          return
        }
        this.busquedasService.buscar('stocks', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.stocks = resp
          
       
        })
  
      }, 500);
    }
     
    buscarCatalogo(tipo: string, value) {



      if (value == '') {
        this.stocks = this.stocksTemp
   
      }
      switch (tipo) {
        case 'stocks':
          this.busquedasService.buscarCatalogo('stocks', value).subscribe((resp) => {
            this.stocks = resp
          })
          break;
        case 'usuarioAsignados':
          this.busquedasService.buscarCatalogo('stock-usuarioAsignado', value).subscribe((resp) => {
            this.stocks = resp
          })
          break;
  
        case 'salon':
          break;
      }
    }
    getStocks() {
      this.loading = true
    
        
  
        this.stockService.cargarStocksAll().subscribe((resp: CargarStocks) => {
       
  
          this.stocks = resp.stocks
          setTimeout(() => {
            this.stocksTemp = resp.stocks
  
            this.loading = false
          }, 1500);
        },
        (error)=>{
         
          this.functionsService.alertError(error,'Stock')

        });
       
    }
    getUsuarios(){
      this.loading = true
     
        
  
        this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
         
  
          this.usuarios = this.functionsService.getActives( resp.usuarios)
          setTimeout(() => {
            this.usuarios = this.functionsService.getActives(resp.usuarios)
  
            this.loading = false
          }, 1500);
        },
        (error)=>{
          this.functionsService.alertError(error,'Stock') 

        });
    }
    getTipoStocks() {
  
      this.loading = true
     
  
      this.tipoStockService.cargarTipoStocksAll().subscribe((resp: CargarTipoStocks) => {
      
  
        this.tipoStocks = resp.tipoStocks
        setTimeout(() => {
          this.tipoStocksTemp = resp.tipoStocks
  
          this.loading = false
        }, 1500);
      });
  
    }
    editStock(id: string) {
  
      this.functionsService.navigateTo(`/core/edit-stock/true/${id}`)
  
    }
    isActived(stock: Stock) {
  
      this.stockService.isActivedStock(stock).subscribe((resp: any) => {
        this.getStocks()
  
  
      },
        (error: any) => {
       
          this.functionsService.alertError(error,'Stock')
  
        })
    }
    viewStock(id: string) {
      this.functionsService.navigateTo(`/core/edit-stock/false/${id}`)
  
    }
    
    newUser() {
  
      this.functionsService.navigateTo('core/new-stock')
    }
  }
  