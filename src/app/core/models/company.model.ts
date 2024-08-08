export interface Company {
    id: number
    name: string
    address: Address
    assignee_id: number
    contact_type_id: number
    details: string
    email_domain: string
    phone_numbers: PhoneNumber[]
    socials: Social[]
    tags: any[]
    websites: Website[]
    custom_fields: CustomField[]
    interaction_count: number
    activated:boolean
    usuarioCreated:string
    date_created: number
    date_modified: number
  }
  
  export interface Address {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  
  export interface PhoneNumber {
    number: string
    category: string
  }
  
  export interface Social {
    url: string
    category: string
  }
  
  export interface Website {
    url: string
    category: string
  }
  
  export interface CustomField {
    custom_field_definition_id: number
    value: any
  }
  