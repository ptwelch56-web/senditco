import { z } from "zod";
import { referralSourceValues } from "./referral-sources";

export const packageIdSchema = z.enum([
  "private",
  "two-riders",
  "small-group",
  "birthday",
  "custom-event",
]);

/** Base fields only — use this for step schemas (.pick). Do not add .superRefine here. */
export const bookingFieldsSchema = z.object({
  packageId: packageIdSchema,
  preferredDate: z.string().min(1, "Pick a preferred date"),
  preferredTime: z.string().min(1, "Pick a time window"),
  locationAddress: z.string().min(5, "Enter the session address"),
  locationCity: z.string().min(2, "Enter city"),
  locationNotes: z.string().optional(),
  contactName: z.string().min(2, "Enter your name"),
  contactPhone: z
    .string()
    .min(1, "Enter a phone number")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Enter at least 10 digits",
    ),
  contactEmail: z.string().email("Enter a valid email"),
  riderCount: z.coerce.number().int().min(1).max(20),
  riderDetails: z.string().min(3, "List rider names and ages"),
  needsBike: z.boolean(),
  needsHelmet: z.boolean(),
  photoOptOut: z.boolean(),
  notes: z.string().optional(),
  referralSource: z.enum(referralSourceValues, {
    error: "Tell us how you heard about us",
  }),
  referralSourceDetail: z.string().optional(),
  participantName: z.string().min(2, "Enter participant legal name"),
  participantAge: z.coerce.number().int().min(8).max(99),
  isMinor: z.boolean(),
  guardianName: z.string().optional(),
  acknowledgments: z.array(z.boolean()).length(3),
  signatureDataUrl: z.string().min(50, "Sign the waiver"),
  signedAt: z.string(),
});

export const detailsStepSchema = bookingFieldsSchema.pick({
  preferredDate: true,
  preferredTime: true,
  locationAddress: true,
  locationCity: true,
  contactName: true,
  contactPhone: true,
  contactEmail: true,
  riderCount: true,
  riderDetails: true,
  referralSource: true,
  referralSourceDetail: true,
});

export const bookingSchema = bookingFieldsSchema.superRefine((data, ctx) => {
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
  if (
    data.referralSource === "other" &&
    (!data.referralSourceDetail || data.referralSourceDetail.trim().length < 2)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please tell us how you heard about us",
      path: ["referralSourceDetail"],
    });
  }
});

export type BookingPayload = z.infer<typeof bookingSchema>;
