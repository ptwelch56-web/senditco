import { z } from "zod";

export const packageIdSchema = z.enum([
  "private",
  "two-riders",
  "small-group",
  "birthday",
  "custom-event",
]);

export const bookingSchema = z.object({
  packageId: packageIdSchema,
  preferredDate: z.string().min(1, "Pick a preferred date"),
  preferredTime: z.string().min(1, "Pick a time window"),
  locationAddress: z.string().min(5, "Enter the session address"),
  locationCity: z.string().min(2, "Enter city"),
  locationNotes: z.string().optional(),
  contactName: z.string().min(2, "Enter your name"),
  contactPhone: z.string().min(10, "Enter a valid phone number"),
  contactEmail: z.string().email("Enter a valid email"),
  riderCount: z.coerce.number().int().min(1).max(20),
  riderDetails: z.string().min(3, "List rider names and ages"),
  needsBike: z.boolean(),
  needsHelmet: z.boolean(),
  photoOptOut: z.boolean(),
  notes: z.string().optional(),
  participantName: z.string().min(2, "Enter participant legal name"),
  participantAge: z.coerce.number().int().min(8).max(99),
  isMinor: z.boolean(),
  guardianName: z.string().optional(),
  acknowledgments: z.array(z.boolean()).length(3),
  signatureDataUrl: z.string().min(100, "Sign the waiver"),
  signedAt: z.string(),
}).superRefine((data, ctx) => {
  if (data.isMinor && (!data.guardianName || data.guardianName.length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Parent/guardian name required for minors",
      path: ["guardianName"],
    });
  }
  if (!data.acknowledgments.every(Boolean)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "All waiver checkboxes are required",
      path: ["acknowledgments"],
    });
  }
});

export type BookingPayload = z.infer<typeof bookingSchema>;
