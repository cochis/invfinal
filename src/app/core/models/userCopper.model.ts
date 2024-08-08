export class UserCopper {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public usuarioCreated: string,
        public activated: Boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
        ) { }
    }

    