export class Proveedor {
    constructor(


      
        public clave: string,
        public nombreEmpresa: string,
        public nombreRepresentante: string,
 
        public materiaPrimas: [string],
        public actividadEconomica: string,
        public rfc: string,
        public direccionFiscal: string,
        public estado: string,
        public municipio: string,
        public codigoPostal: number,
        public telefono: number,
        public correo: string,
        public incoterm:  string ,
        public img: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}