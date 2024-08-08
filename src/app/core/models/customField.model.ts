 

export class CustomField {
  constructor(
    public id: number,
    public name: string,
    public data_type: string,
    public available_on: string[],
    public is_filterable: boolean,
    public activated: boolean,
    public usuarioCreated: any,
    public dateCreated: number,
    public lastEdited: number,
    public uid: string,
    public options?: Option[],
    public currency?: string,
 
  ) { }
}

export interface Option {
  id: number
  name: string
  rank: number
}
