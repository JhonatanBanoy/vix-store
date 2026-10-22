import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink",
        "placeholder:text-muted/70",
        "transition-colors duration-200",
        "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
        "disabled:cursor-not-allowed disabled:bg-bone disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});

export default Input;
