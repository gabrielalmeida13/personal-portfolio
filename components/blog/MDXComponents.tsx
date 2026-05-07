import type { HTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type HProps = HTMLAttributes<HTMLHeadingElement>;
type PProps = HTMLAttributes<HTMLParagraphElement>;
type AProps = AnchorHTMLAttributes<HTMLAnchorElement>;
type BlockquoteProps = HTMLAttributes<HTMLQuoteElement>;
type CodeProps = HTMLAttributes<HTMLElement>;
type HrProps = HTMLAttributes<HTMLHRElement>;
type ListProps = HTMLAttributes<HTMLUListElement | HTMLOListElement>;
type ListItemProps = HTMLAttributes<HTMLLIElement>;
type StrongProps = HTMLAttributes<HTMLElement>;

export const MDXComponents = {
  h1: ({ className, ...props }: HProps) => (
    <h1
      className={cn(
        "mb-4 mt-10 font-sans text-3xl font-bold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HProps) => (
    <h2
      className={cn(
        "mb-3 mt-8 font-sans text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HProps) => (
    <h3
      className={cn(
        "mb-2 mt-6 font-sans text-xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: PProps) => (
    <p
      className={cn(
        "mb-4 text-base leading-relaxed text-foreground-muted",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: AProps) => (
    <a
      className={cn(
        "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors",
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: ({ className, ...props }: ListProps) => (
    <ul
      className={cn(
        "mb-4 list-disc pl-6 text-base leading-relaxed text-foreground-muted",
        className
      )}
      {...(props as HTMLAttributes<HTMLUListElement>)}
    />
  ),
  ol: ({ className, ...props }: ListProps) => (
    <ol
      className={cn(
        "mb-4 list-decimal pl-6 text-base leading-relaxed text-foreground-muted",
        className
      )}
      {...(props as HTMLAttributes<HTMLOListElement>)}
    />
  ),
  li: ({ className, ...props }: ListItemProps) => (
    <li className={cn("mb-1", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: BlockquoteProps) => (
    <blockquote
      className={cn(
        "my-6 border-l-2 border-primary pl-4 italic text-foreground-muted",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: CodeProps) => (
    <code
      className={cn(
        "rounded bg-background-secondary px-1.5 py-0.5 font-mono text-sm text-foreground",
        className
      )}
      {...props}
    />
  ),
  hr: ({ ...props }: HrProps) => (
    <hr className="my-8 border-border" {...props} />
  ),
  strong: ({ className, ...props }: StrongProps) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  ),
};
