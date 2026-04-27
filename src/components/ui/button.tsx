import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding text-base font-normal tracking-[-0.02em] whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/35 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-[1.25rem] border-[1.5px] border-[#141413] bg-[#141413] text-[#F3F0EE] hover:bg-[#141413]/92 [a]:hover:bg-[#141413]/92",
        outline:
          "rounded-[1.25rem] border-[1.5px] border-[#141413] bg-white text-[#141413] hover:bg-[#FCFBFA]",
        secondary:
          "rounded-[1.25rem] border border-transparent bg-[#FCFBFA] text-[#141413] hover:bg-white",
        ghost:
          "rounded-[1.25rem] border-transparent text-[#141413] hover:bg-black/[0.04]",
        destructive:
          "rounded-[1.25rem] border border-transparent bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        /** Cookie / legal confirmations — not for marketing CTAs */
        consent:
          "rounded-[1.5rem] border-0 bg-[#CF4500] px-8 py-1.5 text-[13px] font-normal tracking-[0.01em] text-white hover:bg-[#CF4500]/92",
        link: "rounded-none border-0 border-transparent bg-transparent p-0 text-link-blue underline-offset-4 hover:underline",
      },
      size: {
        default:
          "min-h-10 gap-1.5 px-6 py-1.5 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "min-h-8 gap-1 rounded-[1.25rem] px-4 py-1 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 gap-1 rounded-[1.25rem] px-5 py-1.5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-11 gap-1.5 rounded-[1.25rem] px-8 py-2 has-data-[icon=inline-end]:pr-7 has-data-[icon=inline-start]:pl-7",
        icon: "size-11 rounded-full border border-[#141413]/15 bg-white text-[#141413] hover:bg-[#FCFBFA]",
        "icon-xs": "size-9 rounded-full border border-[#141413]/15 bg-white [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10 rounded-full border border-[#141413]/15 bg-white",
        "icon-lg": "size-12 rounded-full border border-[#141413]/15 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
