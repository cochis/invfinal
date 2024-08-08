import { Component } from '@angular/core';
import { ModalService } from 'src/app/_modal';

import { CargarCompanys } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Company, CustomField } from 'src/app/core/models/company.model';
import { ContacType } from 'src/app/core/models/contacType.model';
import { UserCopper } from 'src/app/core/models/userCopper.model';
import { CopperServices } from 'src/app/core/services/copper.service';
import { CustomFieldsService } from 'src/app/core/services/customFields.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],

})
export class CompaniesComponent {

  loading = false
  companies: Company[] = []
  companiesTemp: Company[]
  userCoppers: UserCopper[]
  contacTypes: ContacType[]
  customFields: CustomField[]
  customSelected: any
  bodyText: string;
  rol = this.functionsService.getLocal('role')
  closeResult = '';
  public visible = false;
  arrays = []

  constructor(
    private copperServices: CopperServices,
    private customFieldsService: CustomFieldsService,
    private functionsService: FunctionsService,
    private modalService: ModalService

  ) {
    this.getCatalogos()
    this.getCompanies()
  }
  openModal(id: string, array: any, a: any) {
    this.customSelected = array
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.customSelected = null
    this.modalService.close(id);
  }

  getCatalogos() {
    this.copperServices.cargarUserCoppesAll().subscribe((resp: any) => {
      this.userCoppers = resp.userCoppers
    })
    this.copperServices.cargarContacTypeAll().subscribe((resp: any) => {
      this.contacTypes = resp.contacTypes
    })
    this.customFieldsService.cargarCustomFieldsAll().subscribe((resp: any) => {
      this.customFields = resp.customFields
    })
  }
  getCompanies() {
    this.loading = true
    this.copperServices.cargarCompaniesAll().subscribe((resp: CargarCompanys) => {
      setTimeout(() => {
        this.companies = resp.companys
        this.companiesTemp = resp.companys
        this.loading = false

      }, 1500);

    })
  }

  editUsuario(id: string) {

    this.functionsService.navigateTo(`/core/copper/companies/edit-company/true/${id}`)

  }
  // isActived(usuario: Usuario) {

  //   this.usuariosService.isActivedUsuario(usuario).subscribe((resp: any) => {
  //     this.getUsuarios()


  //   },
  //     (error: any) => {
  //       this.functionsService.alertError(error,'Usuarios')

  //     })
  // }
  viewUsuario(id: string) {
    this.functionsService.navigateTo(`/core/copper/companies/edit-company/false/${id}`)

  }
  asignatedBy(type: String, id: number) {
    if (id !== null) {

      if (type === 'assignee_id') {
        if (this.userCoppers.filter((usC) => usC.id === id)) {

          var user = this.userCoppers.filter((usC) => usC.id === id);
          return user[0].name
        } else {
          return ''
        }
      }
      else if (type === 'contact_type_id') {
        if (this.contacTypes.filter((usC) => usC.id === id)) {

          var contacType = this.contacTypes.filter((usC) => usC.id === id);

          if (contacType.length > 0) {

            return contacType[0].name
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
      else {
        return ''
      }
    } else {
      return ''
    }
  }
  newCompany() {

    this.functionsService.navigateTo('core/copper/companies/new-company')
  }

  getCustom(id: number, value: any, idCom: any) {
    var r: any = []
    let array: any = []
    array.idCom = idCom
    let ret: any = this.customFields.filter((cat: any) => {
      return cat.id === id
    })
    array.name = ret[0].name
    if (value !== null) {
      if (typeof (value) == 'object') {
        value.forEach(v => {
          ret[0].options.forEach((c: any) => {
            if (c !== undefined && c.id === v) {
              if (r) {
                r.push(c)
              }
            }
          })
        });

        array.options = r
      } else {

        let r = ret[0].options.filter((cat: any) => {
          return cat.id === value
        })


        array.options = r

      }

    }


    this.arrays.push(array)
    return array
  }

} 
