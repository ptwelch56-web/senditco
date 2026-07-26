import { z } from "zod";
import { spotSession } from "./site";

const onsiteFieldsSchema = z.object({
  packageId: z.literal(spotSession.id),
  guardianName: z.string().min(2, "Enter parent/guardian name"),
  guardianPhone: z
    .string()
    .min(1, "Enter a phone number")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Enter at least 10 digits",
    ),
  guardianEmail: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.trim() === "" || z.string().email().safeParse(v.trim()).success,
      "Enter a valid email",
    ),
  participantName: z.string().min(2, "Enter rider legal name"),
  participantAge: z.coerce.number().int().min(8).max(99),
  riderNotes: z.string().optional(),
  eventName: z.string().optional(),
  checkInContext: z.enum(["home", "event"]).optional(),
  acknowledgments: z.array(z.boolean()).length(3),
  signatureDataUrl: z.string().min(50, "Sign the waiver"),
  signedAt: z.string(),
  paymentChoice: z.enum(["venmo", "cashapp", "cash"]).optional(),
  tipAmount: z.coerce.number().min(0).max(500).optional(),
});

export const onsiteInfoStepSchema = onsiteFieldsSchema.pick({
  packageId: true,
  guardianName: true,
  guardianPhone: true,
  guardianEmail: true,
  participantName: true,
  participantAge: true,
  riderNotes: true,
});

export const onsiteWaiverSchema = onsiteFieldsSchema.superRefine((data, ctx) => {
  if (!data.acknowledgments.every(Boolean)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "All waiver checkboxes are required",
      path: ["acknowledgments"],
    });
  }
  if (data.participantAge < 18 && data.guardianName.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Parent/guardian name required",
      path: ["guardianName"],
    });
  }
});

export type OnsiteWaiverPayload = z.infer<typeof onsiteWaiverSchema>;
