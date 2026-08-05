"use client";

import { useEffect, useRef } from "react";
import { getMetaPixelId, trackMetaEvent } from "@/lib/meta-pixel";

/** Fires once on the booking success page so Meta can optimize for leads. */
export function MetaPixelLead() {
  const fired = useRef(false);

  useEffect(() => {
    if (!getMetaPixelId() || fired.current) return;
    fired.current = true;
    trackMetaEvent("Lead", {
      content_name: "Booking request submitted",
      content_category: "booking",
    });
  }, []);

  return null;
}
