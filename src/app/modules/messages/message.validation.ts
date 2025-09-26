import { z } from "zod";

export const create = z.object({
    fullName: z.string({ message: "Name is required" }),
    email: z.string({ message: "Email is required" }).email(),
    subject: z.string({ message: "Subject is required" }),
    message: z.string({ message: "Message is required" }),
    isTermAgreed: z.boolean({ message: "Agreement is required" }).default(false),
});

export const message_validation = {
    create
}