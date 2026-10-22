import { cn } from "../../lib/utils";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-paper shadow-[0_1px_2px_rgba(11,11,15,0.04)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("border-b border-line px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("border-t border-line px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}
