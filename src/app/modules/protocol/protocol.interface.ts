import { Types } from "mongoose"

export type TProtocol = {
    protocolTitle: string,
    protocolDescription: string,
    category: string,
    tags: string[],
    technique: string,
    modality: string,
    organism: string,
    phase: string,
    estimatedTime: string,
    difficulty: string,
    bslLevel: string,
    materials?: {
        itemName: string,
        quantity: number,
        catalog: string,
        supplier: string,
    }[],
    equipment?: {
        equipmentName: string,
        note: string
    }[],
    doiLink?: string,
    additionalReference?: string,
    stepProcedure: string,
    attachment?: string,
    license: string,
    authors: Types.ObjectId,
    coAuthors?: Types.ObjectId[],
    isConfirmed: boolean,
    isAcknowledged: boolean,
    isConfidential: boolean,
}