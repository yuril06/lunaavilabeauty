import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "20%",
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontStyle: "italic",
            fontSize: 22,
            color: "#faf5ef",
            lineHeight: 1,
            marginTop: -2,
          }}
        >
          L
        </span>
      </div>
    ),
    { ...size }
  );
}
