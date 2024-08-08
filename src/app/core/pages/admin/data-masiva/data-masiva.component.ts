import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomField } from 'src/app/core/models/customField.model';
import { CopperServices } from 'src/app/core/services/copper.service';
import { OportunitiesService } from 'src/app/core/services/oportunities.service';
import { PipelinesService } from 'src/app/core/services/pipelines.service';
import { ProductoJasusService } from 'src/app/core/services/productoJasu.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
;
import { FunctionsService } from 'src/app/shared/services/functions.service';
import * as XLSX from 'xlsx'
@Component({
    selector: 'app-data-masiva',
    templateUrl: './data-masiva.component.html',
    styleUrls: ['./data-masiva.component.css']
})
export class DataMasivaComponent {
    dt = [
        {
            "id": 199744,
            "name": "Sales Opportunities",
            "stages": [
                {
                    "id": 925597,
                    "name": "1 Solicitud",
                    "win_probability": 10
                },
                {
                    "id": 925598,
                    "name": "2 Supplier/Costo",
                    "win_probability": 25
                },
                {
                    "id": 925599,
                    "name": "3 Solicitud Muestra",
                    "win_probability": 50
                },
                {
                    "id": 925600,
                    "name": "4 Muestra Entregada",
                    "win_probability": 75
                },
                {
                    "id": 4371954,
                    "name": "5 Won / Lost",
                    "win_probability": 100
                }
            ]
        },
        {
            "id": 1012584,
            "name": "Purchasing Opportunities",
            "stages": [
                {
                    "id": 4630285,
                    "name": "Product Available",
                    "win_probability": null
                },
                {
                    "id": 4630286,
                    "name": "Product of interest - Negociation",
                    "win_probability": null
                },
                {
                    "id": 4630287,
                    "name": "Jasu PO Generated",
                    "win_probability": null
                },
                {
                    "id": 4630288,
                    "name": "Sample Recieved",
                    "win_probability": null
                },
                {
                    "id": 4630289,
                    "name": "Sample Sent to clients",
                    "win_probability": null
                },
                {
                    "id": 4636660,
                    "name": "Client PO Generated/Product Accepted",
                    "win_probability": null
                },
                {
                    "id": 4630290,
                    "name": "Product in Transit",
                    "win_probability": null
                },
                {
                    "id": 4630291,
                    "name": "Product Delivered / Closed",
                    "win_probability": null
                },
                {
                    "id": 4630292,
                    "name": "Product Rejected/Lost",
                    "win_probability": null
                }
            ]
        }
    ]

    tableSelected = ''
    constructor(
        private fb: FormBuilder,
        private copperServices: CopperServices,
        private oportunitiesServices: OportunitiesService,
        private productoJasusServices: ProductoJasusService,
        private pipelinesServices: PipelinesService,
        private functionsService: FunctionsService
    ) {


        this.copperServices.cargarCustomFieldAll().subscribe((resp: any) => {
        })
        this.createForm()
        this.dt.forEach(cf => {
            this.pipelinesServices.crearPipeline(cf).subscribe((resp: any) => {
            })
        });

    }

    convertedJson = []
    scannerActive = false
    loading = false
    submited: boolean = false
    cargando: boolean = false
    msnOk: boolean = false
    public form!: FormGroup
    scan() {
        this.scannerActive = true
        setTimeout(() => {
            this.scannerActive = false
        }, 15000);

    }
    createForm() {
        this.form = this.fb.group({
            file: [],
            tabla: ['']
        })
    }

    stop() {
        this.scannerActive = false
    }
    showQr(qr: any) {




    }

    selected(tabla: any) {
        this.tableSelected = tabla
    }

    onSubmit() {
        this.loading = true
        this.submited = true
        if (this.form.valid) {
            setTimeout(() => {
                this.loading = false
            }, 1500);
        } else {
            //Message
            this.loading = false
            return
        }


    }
    upload(event) {
        if (this.tableSelected == undefined) {
            return
        }
        const selectedFile = event.target.files[0]
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(selectedFile)
        fileReader.onload = (event) => {
            let binaryData = event.target.result
            let workbook = XLSX.read(binaryData, { type: 'binary' })
            workbook.SheetNames.forEach(sheet => {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                this.convertedJson.push(data)
            })
            this.convertedJson.forEach((element, i) => {
                element.forEach((ele, j) => {
                    if (typeof (this.convertedJson[i][j].options) == 'string' && this.convertedJson[i][j].options) {
                        this.convertedJson[i][j].options = JSON.parse(this.convertedJson[i][j].options)
                    }
                });
            });
            // this.productoJasusServices.dropProductoJasu().subscribe((resp) => {
            //     console.log('resp', resp)

            //     this.convertedJson[0].forEach(element => {
            //         switch (this.tableSelected) {
            //             case 'productoJasu':

            //                 this.productoJasusServices.crearProductoJasu(element).subscribe((resp) => {
            //                     console.log('resp', resp)

            //                 },
            //                     (error) => {
            //                         console.log('error', error)

            //                     })
            //                 break;

            //             default:
            //                 break;
            //         }
            //         console.log('element', element)

            //     });

            // },
            //     (error) => {
            //         console.log('error', error)

            //     })
            //   this.dt.forEach((cf:any) => {
            //     cf.activated = true
            //     this.copperServices.crearCompany(cf).subscribe((resp:any)=>{
            //       console.log('resp', resp)

            //     })


            //   });
        }

    }
}
