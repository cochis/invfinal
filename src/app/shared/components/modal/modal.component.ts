import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Factura } from 'src/app/core/models/factura.model';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PagoProgramado } from '../../../core/models/pagoProgramado.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],

})
export class ModalComponent {
  @Input() model: any;
  factura: Factura
  pagoProgramado: any
  loading = false
  url = undefined
  urlCotizacion = undefined
  urlFactura = undefined
  urlComprobante = undefined
  base: any = environment.base_url
  closeResult: string;
  constructor(
    protected sanitizer: DomSanitizer,
    private readonly _modalReference: ModalReference<Factura>
  ) {

    this.getValues()

  }

  getValues() {
    this.loading = true
    if (this._modalReference.config.model.solicitudViaje) {
      this.factura = this._modalReference.config.model
      this.url = this.base + '/upload/facturas/' + this.factura.file;
      // console.log('this.url', this.url)
    }
    else {
      this.pagoProgramado = this._modalReference.config.model
      if (this.pagoProgramado.factura !== '') {
        this.urlFactura = this.base + '/upload/pagoProgramado/' + this.pagoProgramado.factura;
        // console.log('this.urlFactura', this.urlFactura)
      }
      if (this.pagoProgramado.cotizacion !== '') {
        this.urlCotizacion = this.base + '/upload/pagoProgramado/' + this.pagoProgramado.cotizacion;
        // console.log('this.urlCotizacion', this.urlCotizacion)
      }
      if (this.pagoProgramado.comprobante !== '') {
        this.urlComprobante = this.base + '/upload/pagoProgramado/' + this.pagoProgramado.comprobante;
        // console.log('this.urlComprobante', this.urlComprobante)
      }
    }
    setTimeout(() => {

      this.loading = false
    }, 500);
  }
}
