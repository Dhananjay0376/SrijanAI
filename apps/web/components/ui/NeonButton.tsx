import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type NeonButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  as?: "link";
};

type NeonButtonAsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "outline";
  as: "button";
};

export function NeonButton({
  ...props
}: NeonButtonProps | NeonButtonAsButtonProps) {
  const {
    children,
    className = "",
    variant = "solid",
  } = props;
  const variantClass =
    variant === "outline" ? "neon-button neon-button-outline" : "neon-button";

  if (props.as === "button") {
    const { as: _as, children: _children, className: _className, variant: _variant, ...buttonProps } = props;

    return (
      <button
        className={`${variantClass} ${className}`}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  const { as: _as, children: _children, className: _className, href = "/sign-up", variant: _variant, ...linkProps } = props;

  return (
    <Link
      className={`${variantClass} ${className}`}
      href={href}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
