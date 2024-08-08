import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEstadoTickets, CargarTipoTickets } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EstadoTicket } from 'src/app/core/models/estadoTicket.model';
import { Ticket } from 'src/app/core/models/ticket.model';
import { TipoTicket } from 'src/app/core/models/tipoTicket.model';
import { EstadoTicketService } from 'src/app/core/services/estadoTicket.service';
import { FileService } from 'src/app/core/services/file.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { TipoTicketService } from 'src/app/core/services/tipoTicket.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.css']
})
export class NewTicketComponent {
  loading = false
  ADM = environment.ADM
  initTicket = environment.init_ticket
  public imagenSubir!: File
  public imgTemp: any = undefined
  estadoTicket: EstadoTicket
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  ticket: Ticket
  tipoTickets: TipoTicket[]
  estadoTickets: EstadoTicket[]
  id!: string
  edit!: string
  estadoInicial!: string
  url = environment.base_url
  addPicture=false
  img='default.jpg'
rol = this.functionsService.getLocal('role')
uid = this.functionsService.getLocal('uid')
  
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private ticketsService: TicketService,
    private tipoTicketsService: TipoTicketService,
    private estadosTicketsService: EstadoTicketService,
    private estadoTicketService: EstadoTicketService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.createForm()
    this.getCatalogos()
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id']
    } else {
      this.id = this.functionsService.getLocal('uid')
    }
    

   
    this.loading = true

    setTimeout(() => {

      this.loading = false
    }, 1500);
  }


  getCatalogos() {
    
    this.loading = true
    this.tipoTicketsService.cargarTipoTicketsAll().subscribe((resp: CargarTipoTickets) => {
      this.tipoTickets = resp.tipoTickets
    
    },
      (error: any) => {
        this.functionsService.alertError(error,'Ticket')
        this.loading = false
      })
    this.loading = true
    this.estadoTicketService.cargarEstadoTicketsAll().subscribe((resp: CargarEstadoTickets) => {
      this.estadoTickets = resp.estadoTickets
        this.estadoInicial =this.functionsService.getValueCatalogCat(this.initTicket,'uid','clave',this.estadoTickets)
        
    },
      (error: any) => {
        this.functionsService.alertError(error,'Ticket')
        this.loading = false
      })

  }

  createForm() {
    this.form = this.fb.group({
      tipoTicket: ['', [Validators.required]],
      usuarioCreated: [''],
      descripcion: ['', [Validators.required]],
      respuesta: ['' ],
      estado: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }

  onSubmit() {
    this.loading = true
    
 
    let obj:Ticket = {
      ...this.form.value,
      estado: this.estadoInicial,
      usuarioCreated:  this.id
     }
 
     this.ticketsService.crearTicket( obj).subscribe(  (resp: any) => {
    
      this.ticket = resp.ticket
    
      Swal.fire({
        title: '¿Quieres agregar una foto?',
 
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
 
      }).then((result) => {
        
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
         this.loading = false
         this.addPicture = true

         
        } else  {
          this.functionsService.alert('Ticket','Ticket creado','success')
          this.loading = false
          this.addPicture = false
          this.back()
        }
      })
  
       
      
    },
      (error) => {

        this.functionsService.alertError(error, 'Tickets')
        this.loading = false

       

      })
    
    if (this.form.valid) {
    } else {

      //Message
      this.loading = false
      return  
    }


  }
  cambiarImagen(file: any) {
    this.loading = true
    this.imagenSubir = file.target.files[0]
    
    if (!file.target.files[0]) {
      this.imgTemp = null
      this.functionsService.alert('Usuarios', 'No se encontró imagen', 'error')
      this.loading = false
       
    } else {
      

      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      
      reader.onloadend = () => {
        this.imgTemp = reader.result
      
      }
      this.subirImagen()

    }
  }
  subirImagen() {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'tickets', this.ticket.uid)
      .then(
        (img) => {
          this.ticket.img = img
          this.loading = false
          this.functionsService.alertUpdate('Ticket')

          this.functionsService.navigateTo('/core')
          //message
        },
        (err) => {

          this.loading = false
          this.functionsService.alert('Ticket', 'Error al subir la imagen', 'error')
        },
      )
  }
  back(){
    if(this.rol === this.ADM){

      this.functionsService.navigateTo('/core/tickets')
    }else {
      this.functionsService.navigateTo('/core/mis-tickets/'+this.uid)

    }
  }
}
