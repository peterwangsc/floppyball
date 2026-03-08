import type { CSSProperties, ElementType, ReactNode } from "react";

type OutlinedTextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function OutlinedText({
  as: Component = "span",
  children,
  className,
  style,
}: OutlinedTextProps) {
  return (
    <Component
      className={["text-outlined", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </Component>
  );
}
