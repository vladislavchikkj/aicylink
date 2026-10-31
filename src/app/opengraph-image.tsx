import { ImageResponse } from "next/og";
import { MARK_PATH, SPARKLE_PATH } from "@/components/logo";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.title} ${site.titleAccent}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(6,182,212,0.28), transparent 45%), radial-gradient(circle at 70% 90%, rgba(124,92,255,0.22), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="88" height="48" viewBox="330 420 630 340">
            <path d={MARK_PATH} fill="#0a0a0a" />
            <path d={SPARKLE_PATH} fill="#0ea5e9" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 700, color: "#0a0a0a" }}>{site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 800, color: "#0a0a0a", letterSpacing: -3, lineHeight: 1.05 }}>{site.title}</span>
          <span
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.05,
              backgroundImage: "linear-gradient(90deg, #0ea5e9, #7c5cff)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {site.titleAccent}
          </span>
          <span style={{ marginTop: 28, fontSize: 28, color: "#525252", maxWidth: 900 }}>{site.description}</span>
        </div>
      </div>
    ),
    size,
  );
}
