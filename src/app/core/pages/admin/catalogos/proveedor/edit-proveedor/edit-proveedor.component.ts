import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarProveedor, CargarTipoProveedors, CargarUsuario, CargarUsuarios, CargarMateriaPrimas, CargarIncoterms } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { TipoProveedor } from 'src/app/core/models/tipoProveedor.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { TipoProveedorService } from 'src/app/core/services/tipoProveedor.service';

import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
import { IncotermsService } from 'src/app/core/services/incoterm.service';
import { Incoterm } from 'src/app/core/models/incoterm.model';

@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.css']
})
export class EditProveedorComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined

  materiaPrimas: MateriaPrima[]
  incoterms: Incoterm[]
  proveedor: Proveedor
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  allMaterias:string =''
  edit!: string
  url = environment.base_url
  ADM = environment.ADM
  usuarios: Usuario[]
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private incotemrsService: IncotermsService,
    private materiaPrimasService: MateriaPrimasService,
    private proveedorService: ProveedorsService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.id = this.route.snapshot.params['id']

    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getCatalogos()
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  getId(id: string) {


    this.proveedorService.cargarProveedorById(id).subscribe((resp: CargarProveedor) => {

      this.proveedor = resp.proveedor
 
      this.proveedor.materiaPrimas.forEach((mt,i) => {
        if((i+1)<this.proveedor.materiaPrimas.length){

          this.allMaterias += this.getCatalog('materiaPrimas',mt) + ','
        }else{
          this.allMaterias += this.getCatalog('materiaPrimas',mt) 

        }
      
        
      });
    
      setTimeout(() => {

        this.setForm(this.proveedor)
      }, 500);

    },
      (error: any) => {


        this.functionsService.alertError(error, 'Proveedor')

      })
  }


  getCatalogos() {

    this.loading = true
    this.materiaPrimasService.cargarMateriaPrimasAll().subscribe((resp: CargarMateriaPrimas) => {
      this.materiaPrimas = resp.materiaPrimas

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Materias prima')
        this.loading = false


      })
    this.loading = true
    this.incotemrsService.cargarIncotermsAll().subscribe((resp: CargarIncoterms) => {
      this.incoterms = this.functionsService.getActivos(resp.incoterms)
   


    },
      (error: any) => {

        this.functionsService.alertError(error, 'Incoterms')
        this.loading = false


      })



  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      clave: ['', [Validators.required]],
      nombreEmpresa: ['', [Validators.required]],
      nombreRepresentante: ['', [Validators.required]],
      materiaPrimas: ['', [Validators.required]],
      actividadEconomica: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      direccionFiscal: ['', [Validators.required]],
      estado: [''],
      municipio: [''],
      codigoPostal: [''],
      telefono: [''],
      correo: [''],
      incoterm: [''],
      activated: [false],
      usuarioCreated: [''],
      dateCreated: [''],
      lastEdited: [''],
    })
  }
  setForm(proveedor: Proveedor) {
    
    this.loading = true


    

    setTimeout(() => {

     
      this.form = this.fb.group({
        clave: [proveedor.clave, [Validators.required]],
        nombreEmpresa: [proveedor.nombreEmpresa, [Validators.required]],
        nombreRepresentante: [proveedor.nombreRepresentante, [Validators.required]],
        materiaPrimas: [this.edit=='true'?proveedor.materiaPrimas:this.allMaterias, [Validators.required]],
        actividadEconomica: [proveedor.actividadEconomica, [Validators.required]],
        rfc: [proveedor.rfc, [Validators.required]],
        direccionFiscal: [proveedor.direccionFiscal, [Validators.required]],
        estado: [proveedor.estado],
        municipio: [proveedor.municipio],
        codigoPostal: [proveedor.codigoPostal],
        telefono: [proveedor.telefono],
        correo: [proveedor.correo],
        incoterm: [this.edit=='true'?proveedor.incoterm:this.getCatalog('incoterms',proveedor.incoterm)],
        activated: [proveedor.activated],
        usuarioCreated: [proveedor.usuarioCreated],
        dateCreated: [proveedor.dateCreated],

        lastEdited: [this.today],
      })
      this.loading = false
    }, 1500);


  }

  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      if (this.form.value.usuarioAsignado !== '') {
        this.form.value.asignado = true
      }
      else {
        this.form.value.asignado = false
      }
      this.proveedor = {
        ...this.proveedor,
        ...this.form.value,


      }


      this.proveedorService.actualizarProveedor(this.proveedor).subscribe((resp: any) => {

        this.functionsService.alertUpdate('Proveedor')

        this.functionsService.navigateTo('core/catalogos/proveedor')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Proveedor')
          this.loading = false



        })
    } else {


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
        ;
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
      .actualizarFoto(this.imagenSubir, 'proveedors', this.proveedor.uid)
      .then(
        (img) => {
          this.proveedor.img = img
          this.loading = false
          this.functionsService.alertUpdate('Usuarios')
          //message
        },
        (err) => {

          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }

  back() {
    this.functionsService.navigateTo('core/catalogos/proveedor')
  }
  getCatalog(tipo: string, id: string) {
 

    if (id) {

      switch (tipo) {


        case 'materiaPrimas':


          return this.functionsService.getValueCatalog(id, 'nombre', this.materiaPrimas).toString()

          break;
        case 'incoterms':


          return this.functionsService.getValueCatalog(id, 'descripcion', this.incoterms).toString()

          break;
         

 

      }
    } else {
      return ''
    }

  }
}
