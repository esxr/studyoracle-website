import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const variants = {
  primary:
    "bg-deep-blue text-white hover:bg-deep-blue/90 focus-visible:ring-deep-blue",
  secondary:
    "bg-warm-amber text-slate-900 hover:bg-warm-amber/90 focus-visible:ring-warm-amber",
  outline:
    "border-2 border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white focus-visible:ring-deep-blue",
};

export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
