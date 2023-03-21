export interface ContractDocument{
    id?: string,
    documentType?: string,
    date?: string,
    shortDocumentName?:string,
    documentName?:string
}

export interface SingleCompanyDocument{
    id?: string,
    documentType?: string,
    date?: string,
    shortDocumentName?:string,
    documentName?:string
}

export interface CompanyDocument{
    pcoId?:string,
    shortName?:string,
    pcoName?:string,
    documents?: SingleCompanyDocument[]
}

export interface ReporDocument{
    id?: string,
    documentType?: string,
    date?: string,
    shortDocumentName?:string,
    documentName?:string,
    typeOfReport?:string
}
