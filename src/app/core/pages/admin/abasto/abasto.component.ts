import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CargarAbastos, CargarDestinos, CargarMateriaPrimas, CargarOrigens, CargarProveedorTransporte, CargarProveedorTransportes, CargarProveedors, CargarUnidadMedidas} from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Abasto } from 'src/app/core/models/abasto.model';
import { Destino } from 'src/app/core/models/destino.model';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
import { Origen } from 'src/app/core/models/origen.model';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { ProveedorTransporte } from 'src/app/core/models/proveedorTransporte.model';
import { Role } from 'src/app/core/models/role.model';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';
import { AbastosService } from 'src/app/core/services/abastos.service';
import { DestinosService } from 'src/app/core/services/destinos.service';
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { OrigensService } from 'src/app/core/services/origens.service';
import { ProveedorTransportesService } from 'src/app/core/services/provedorTransportes.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { UnidadMedidasService } from 'src/app/core/services/unidadMedida.service';
 
 
 
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-abasto',
  templateUrl: './abasto.component.html',
  styleUrls: ['./abasto.component.css']
})
export class AbastoComponent {
  ADM =environment.ADM  
  url = environment.base_url 
  loading = false
  abastos: Abasto[]
  public form : FormGroup =new FormGroup({
    origen: new FormControl(),
    destino: new FormControl(),
    materiaPrima: new FormControl(),
    proveedor: new FormControl(),
    
});
  abastosTemp: Abasto[]
  origens : Origen[]
  unidadMedidas : UnidadMedida[]
  destinos : Destino[]
  proveedors: Proveedor[]
  proveedorTransportes: ProveedorTransporte[]
  materiaPrimas: MateriaPrima[]
 
  rol = this.functionsService.getLocal('role')
    constructor( 
    public functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private abastosService: AbastosService ,
    private origensService: OrigensService ,
    private unidadMedidasService: UnidadMedidasService ,
    private destinosService: DestinosService ,
    private proveedorsService: ProveedorsService ,
    private proveedorTransportesService: ProveedorTransportesService ,
    private materiaPrimasService: MateriaPrimasService ,
    private fb: FormBuilder,
    ){
      this.createForm()
      this.getCatalogos()
      this.getAbastos()
     
    }
    getCatalogos() {

      this.loading = true
      this.origensService.cargarOrigensAll().subscribe((resp: CargarOrigens) => {
        this.origens = resp.origens
       
        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Origenes')
          this.loading = false
        })
      this.loading = true
      this.destinosService.cargarDestinosAll().subscribe((resp: CargarDestinos) => {
        this.destinos = resp.destinos
        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Destinos')
          this.loading = false
        })
  
      this.loading = true
      this.proveedorsService.cargarProveedorsAll().subscribe((resp: CargarProveedors) => {
        this.proveedors = resp.proveedors
       
       
        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Proovedores')
          this.loading = false
        })
  
      this.loading = true
      this.materiaPrimasService.cargarMateriaPrimasAll().subscribe((resp: CargarMateriaPrimas) => {
        this.materiaPrimas = resp.materiaPrimas
      
        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Materias primas')
          this.loading = false
        })
      this.loading = true
      this.unidadMedidasService.cargarUnidadMedidasAll().subscribe((resp: CargarUnidadMedidas) => {
        this.unidadMedidas = resp.unidadMedidas
      
        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Unidad medidas')
          this.loading = false
        })
  
      this.loading = true
      this.proveedorTransportesService.cargarProveedorTransportesAll().subscribe((resp: CargarProveedorTransportes) => {
        this.proveedorTransportes = resp.proveedorTransportes
        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Proveedores de transportes')
          this.loading = false
        })
  
  
  
    }
    getAbastos() {
      this.loading = true
        this.abastosService.cargarAbastosAll().subscribe((resp: CargarAbastos) => {
          this.abastos = resp.abastos
          setTimeout(() => {
            this.abastosTemp = resp.abastos
            this.loading = false
          }, 1500);
        });
       
    }
    get errorControl() {
      return this.form.controls;
    }
    createForm() {
      this.form = this.fb.group({
        origen: [''],
        destino: [''],
        materiaPrima: [''],
        proveedor: [''],
        dateInit: [''],
        dateEnd: [''],
        
      })
    }
    editAbasto(id: string) {
  
      this.functionsService.navigateTo(`/core/edit-abasto/true/${id}`)
  
    }
    isActived(abasto: Abasto) {
  
      this.abastosService.isActivedAbasto(abasto).subscribe((resp: any) => {
        this.getAbastos()
  
  
      },
        (error: any) => {
          this.functionsService.alertError(error,'Abastos')
  
        })
    }
    viewAbasto(id: string) {
      this.functionsService.navigateTo(`/core/edit-abasto/false/${id}`)
  
    }
  
    newUser() {
  
      this.functionsService.navigateTo('core/new-abasto')
    }
  
  
    buscar(termino) {
      
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.abastos = this.abastosTemp
          return
        }
        this.busquedasService.buscar('abastos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.abastos = this.functionsService.getActives(resp)
          
       
        })
  
      }, 500);
    }
     
    buscarCatalogo(tipo: string, value) {
     this.createForm()
  
      switch (tipo) {
        case 'origens-abasto':
          if (value == '') {
            this.abastos = this.abastosTemp
       
          }
          this.busquedasService.buscarCatalogo('origens-abasto', value).subscribe((resp) => {
            this.abastos = resp
          })
          break;
       
        case 'proveedors-abasto':
          if (value == '') {
            this.abastos = this.abastosTemp
       
          }
          this.busquedasService.buscarCatalogo('proveedors-abasto', value).subscribe((resp) => {
            this.abastos = resp
          })
          break;
       
        case 'destinos-abasto':
         
          if (value == '') {
            this.abastos = this.abastosTemp
       
          }
          this.busquedasService.buscarCatalogo('destinos-abasto', value).subscribe((resp) => {
            this.abastos = resp
          
          })
          break;
       
        case 'materiaPrimas-abasto':
          if (value == '') {
            this.abastos = this.abastosTemp
       
          }
          this.busquedasService.buscarCatalogo('materiaPrimas-abasto', value).subscribe((resp) => {
            this.abastos = resp
          })
          break;
       
         
  
      
      }
    }
    getCatalog(tipo: string, id: string) {

      if (id) {
  
        switch (tipo) {
  
  
          case 'origens':
  
  
            return this.functionsService.getValueCatalog(id, 'nombre', this.origens).toString()
  
            break;
          case 'destinos':
   
            return this.functionsService.getValueCatalog(id, 'nombre', this.destinos).toString()
  
            break;
          case 'proveedors':
  
  
            return this.functionsService.getValueCatalog(id, 'nombreEmpresa', this.proveedors).toString()
  
            break;
          case 'materiaPrimas':
   
            return this.functionsService.getValueCatalog(id[0], 'nombre', this.materiaPrimas ).toString()
  
            break;
          case 'unidadMedidas':
    
            return this.functionsService.getValueCatalog(id, 'nombre', this.unidadMedidas ).toString()
  
            break;
  
        }
      } else {
        return ''
      }
  
    }
    getByDate(init:any,end:any){
      
      this.abastos = this.abastosTemp
      if(init !== undefined && !end){
        
    
        let ab = this.abastos.filter(abasto => {
         
          
          return abasto.dateCreated > new Date(init).getTime()
          
        });
        this.abastos = ab
 
        
      } else if (init !== undefined && end!==undefined){
      

        let ab = this.abastos.filter(abasto => {
            
          return (abasto.dateCreated > new Date(init).getTime() &&  abasto.dateCreated < new Date(end).getTime())
          
        });
        this.abastos = ab
     
        
      }



    }
  }
  