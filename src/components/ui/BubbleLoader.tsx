import React from "react";
import { Stack, useTheme } from "@fluentui/react";

const bubbleStyle = (color: string, delay: string): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: color,
  animation: `bubbleAnimation 1.2s infinite`,
  animationDelay: delay,
});

export const BubbleLoader: React.FC = () => {
  const theme = useTheme();
  const primary = theme.palette.themePrimary;

  return (
    <>
      <style>
        {`
        @keyframes bubbleAnimation {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}
      </style>
      <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 8 }}>
        <div style={bubbleStyle(primary, "0s")} />
        <div style={bubbleStyle(primary, "0.2s")} />
        <div style={bubbleStyle(primary, "0.4s")} />
      </Stack>
    </>
  );
};
