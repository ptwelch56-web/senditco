"use client";

import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

type Props = {
  onChange: (dataUrl: string) => void;
  error?: string;
};

export function SignatureField({ onChange, error }: Props) {
  const ref = useRef<SignatureCanvas>(null);

  const sync = () => {
    const pad = ref.current;
    if (!pad || pad.isEmpty()) {
      onChange("");
      return;
    }
    onChange(pad.toDataURL("image/png"));
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-white/15 bg-white">
        <SignatureCanvas
          ref={ref}
          penColor="#111"
          canvasProps={{
            className: "h-40 w-full touch-none",
          }}
          onEnd={sync}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-xs text-zinc-500">Sign with finger or mouse</p>
        <button
          type="button"
          className="text-xs font-medium text-red-400 hover:text-red-300"
          onClick={() => {
            ref.current?.clear();
            onChange("");
          }}
        >
          Clear signature
        </button>
      </div>
      {error ? <p className="mt-1 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
