import z from "zod";

export const subscriber_validation = z.object({
    email: z.string({ message: "Email is required" }),
    interest: z.string({ message: "Interest is required" })
})