import { z } from "zod";

const create = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email format"),
  sponsorshipLevel: z.string().min(1, "Sponsorship level is required"),
  message: z.string().min(1, "Message is required")
});


export const sponsor_validation = {
    create
}