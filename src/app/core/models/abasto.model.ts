export class Abasto {
    constructor(
        public origen: string,
        public destino: string,
        public proveedor: string,
        public materiaPrima: string,
        public unidadMedida: string,
        public cantidadTotal: number,
        public cantidadOrigenProceso: number,
        public cantidadDestinoProceso: number,
        public viajes: any,
        public finalizado: boolean,
        public usuarioCreated: string,
        public activated: Boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
        ) { }
    }

    