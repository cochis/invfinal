export class ClienteLoop {
    constructor(


      
        public taxId: string,
        public name: string,
        public pais: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}