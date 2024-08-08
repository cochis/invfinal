export class MateriaPrima {
    constructor(
        public nombre: string,
        public clave: string,
        public descripcion: string,
        public tipoMaterial: string,
        public unidadMedida: string,
        public precioStd: Number,
        public moneda: string,
        public variedad: string,
        public area: string,
        public tipo: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}