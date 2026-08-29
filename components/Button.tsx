import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-magenta text-white hover:bg-magenta-dark shadow-sm",
  secondary:
    "bg-white text-plum border border-blush-light hover:border-magenta hover:text-magenta-dark",
  ghost: "text-plum-soft hover:text-magenta-dark",
};

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsLink extends BaseProps {
  href: string;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

export default function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", className, children } = props;
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors",
    variantStyles[variant],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={styles}>
        {children}
      </Link>
    );
  }

  const { href: _href, variant: _v, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;

  return (
    <button className={styles} {...rest}>
      {children}
    </button>
  );
}
