import { Types } from "mongoose";
import { z } from "zod";

const materialSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    quantity: z.number({ error: "Quantity is required" }),
    catalog: z.string().min(1, "Catalog is required"),
    supplier: z.string().min(1, "Supplier is required"),
});

const equipmentSchema = z.object({
    equipmentName: z.string().min(1, "Equipment name is required"),
    note: z.string().min(1, "Note is required"),
});

const create = z.object({
    protocolTitle: z.string().min(1, "Protocol title is required"),
    protocolDescription: z.string().min(1, "Protocol description is required"),
    category: z.string().min(1, "Category is required"),
    tags: z.array(z.string().min(1, "Tag is required")).nonempty("At least one tag is required"),
    technique: z.string().min(1, "Technique is required"),
    modality: z.string().min(1, "Modality is required"),
    organism: z.string().min(1, "Organism is required"),
    phase: z.string().min(1, "Phase is required"),
    estimatedTime: z.string().min(1, "Estimated time is required"),
    difficulty: z.string().min(1, "Difficulty is required"),
    bslLevel: z.string().min(1, "BSL level is required"),
    materials: z.array(materialSchema).optional(),
    equipment: z.array(equipmentSchema).optional(),
    doiLink: z.string().url("DOI link must be a valid URL").optional(),
    additionalReference: z.string().optional(),
    stepProcedure: z.string().min(1, "Step procedure is required"),
    attachment: z.string().optional(),
    license: z.string().min(1, "License is required"),
    coAuthors: z.array(z.instanceof(Types.ObjectId)).optional(),
    isConfirmed: z.boolean({ error: "isConfirmed is required" }),
    isAcknowledged: z.boolean({ error: "isAcknowledged is required" }),
    isConfidential: z.boolean({ error: "isConfidential is required" }),
});
const update = z.object({
    protocolTitle: z.string().min(1, "Protocol title is required").optional(),
    protocolDescription: z.string().min(1, "Protocol description is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    tags: z.array(z.string().min(1, "Tag is required")).nonempty("At least one tag is required").optional(),
    technique: z.string().min(1, "Technique is required").optional(),
    modality: z.string().min(1, "Modality is required").optional(),
    organism: z.string().min(1, "Organism is required").optional(),
    phase: z.string().min(1, "Phase is required").optional(),
    estimatedTime: z.string().min(1, "Estimated time is required").optional(),
    difficulty: z.string().min(1, "Difficulty is required").optional(),
    bslLevel: z.string().min(1, "BSL level is required").optional(),
    materials: z.array(materialSchema).optional(),
    equipment: z.array(equipmentSchema).optional(),
    doiLink: z.string().url("DOI link must be a valid URL").optional(),
    additionalReference: z.string().optional(),
    stepProcedure: z.string().min(1, "Step procedure is required").optional(),
    attachment: z.string().optional(),
    license: z.string().min(1, "License is required").optional(),
    coAuthors: z.array(z.instanceof(Types.ObjectId)).optional(),
    isConfirmed: z.boolean().optional(),
    isAcknowledged: z.boolean().optional(),
    isConfidential: z.boolean().optional(),
    status: z.string().optional()
});


export const protocol_validation = {
    create,
    update
}
