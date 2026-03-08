import type { ElementType, ReactNode } from "react";

type OutlinedTextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

const outlinedTextClassName =
  "[text-shadow:2px_2px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000]";

export function OutlinedText({
  as: Component = "span",
  children,
  className,
}: OutlinedTextProps) {
  return (
    <Component
      className={[outlinedTextClassName, className].filter(Boolean).join(" ")}
    >
      {children}
    </Component>
  );
}
