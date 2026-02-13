import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Yashraj Nikam — Chessfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const faviconSvg = await readFile(
    join(process.cwd(), "public", "favicon.svg"),
    "utf-8"
  );
  const knightDataUri = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <img
          src={knightDataUri}
          width={120}
          height={120}
          style={{ marginBottom: 32 }}
          alt=""
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#8B7355",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Yashraj Nikam
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: "#B8A090",
            letterSpacing: "0.05em",
            marginBottom: 24,
          }}
        >
          Chessfolio
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#9A8B7A",
            letterSpacing: "0.02em",
          }}
        >
          Systems. Strategy. Execution.
        </div>
      </div>
    ),
    { ...size }
  );
}
