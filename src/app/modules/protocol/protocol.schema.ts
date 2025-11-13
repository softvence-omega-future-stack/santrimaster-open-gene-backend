import { model, Schema } from "mongoose";
import { TProtocol } from "./protocol.interface";

const MaterialSchema = new Schema(
    {
        itemName: { type: String, required: [true, "Item name is required"] },
        quantity: { type: String, required: [true, "Quantity is required"] },
        catalog: { type: String, required: false},
        supplier: { type: String, required: false},
    },
    { _id: false, versionKey: false }
);

const EquipmentSchema = new Schema(
    {
        equipmentName: { type: String, required: [true, "Equipment name is required"] },
        note: { type: String, required: [true, "Note is required"] },
        catalog: { type: String, required: false },
        supplier: { type: String, required: false },
    },
    { _id: false, versionKey: false }
);

const ProtocolSchema = new Schema<TProtocol>(
    {
        protocolTitle: { type: String, required: [true, "Protocol title is required"] },
        protocolDescription: { type: String, required: [true, "Protocol description is required"] },
        category: { type: String, required: [true, "Category is required"] },
        tags: { type: [String], required: [true, "Tags are required"], default: [] },
        technique: { type: String, required: [true, "Technique is required"] },
        modality: { type: String, required: [true, "Modality is required"] },
        organism: { type: String, required: [true, "Organism is required"] },
        phase: { type: String, required: [true, "Phase is required"] },
        estimatedTime: { type: String, required: [true, "Estimated time is required"] },
        difficulty: { type: String, required: [true, "Difficulty is required"] },
        bslLevel: { type: String, required: [true, "BSL level is required"] },

        materials: { type: [MaterialSchema], required: false },
        equipment: { type: [EquipmentSchema], required: false },

        doiLink: { type: String },
        additionalReference: { type: String },

        stepProcedure: { type: String, required: [true, "Step procedure is required"] },
        attachment: { type: String },

        license: { type: String, required: [true, "License is required"] },

        authors: { type: Schema.Types.ObjectId, ref: "account", required: [true, "Authors field is required"] },
        coAuthors: [{ type: Schema.Types.ObjectId, ref: "account" }],

        isConfirmed: { type: Boolean, required: [true, "isConfirmed is required"] },
        isAcknowledged: { type: Boolean, required: [true, "isAcknowledged is required"] },
        isConfidential: { type: Boolean, required: [true, "isConfidential is required"] },
        status: { type: String, enum: ["PUBLISHED", "REJECTED", "PENDING", "DRAFT"], default: "PENDING" },
    },
    { timestamps: true, versionKey: false }
);

export const ProtocolModel = model<TProtocol>("protocol", ProtocolSchema);
