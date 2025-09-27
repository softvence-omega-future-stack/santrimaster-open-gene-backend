import { z } from "zod";

const create = z.object({
  donationType: z.enum(['ONE_TIME', 'MONTHLY', 'ANNUAL']),
  amount: z.number().min(0, "Amount must be greater than or equal to 0"),
  donarName: z.string().min(1, "Donar name is required"),
  donarEmail: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  tribute: z.string().min(1, "Tribute is required"),
  paymentStatus: z.enum(['PENDING', 'SUCCESS', 'FAILED']).default('PENDING')
});


export const donation_validation = {
    create
}