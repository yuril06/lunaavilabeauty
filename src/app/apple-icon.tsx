import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a211c",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "2px solid #ad8a5e",
          }}
        >
          <span
            style={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 90,
              color: "#faf5ef",
              lineHeight: 1,
              marginTop: -8,
            }}
          >
            L
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
