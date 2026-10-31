import { ImageResponse } from "next/og";
import { MARK_PATH, SPARKLE_PATH } from "@/components/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <svg width="120" height="65" viewBox="330 420 630 340">
          <path d={MARK_PATH} fill="#fff" />
          <path d={SPARKLE_PATH} fill="#7dd3fc" />
        </svg>
      </div>
    ),
    size,
  );
}
