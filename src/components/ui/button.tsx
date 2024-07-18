import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center font-mono-header uppercase whitespace-nowrap rounded-md text-[13px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                unset: "",
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-secondary/25 hover:bg-muted/60 hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-muted/60 hover:text-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                expandIcon: "group relative text-primary-foreground bg-primary hover:bg-primary/90",
                ringHover:
                    "bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
                shine: "text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] ",
                gooeyRight:
                    "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-200 before:absolute before:inset-0 before:opacity-0 before:-z-10  before:scale-[2.5] before:bg-gradient-to-r from-muted/50 before:transition-opacity before:duration-200  hover:before:translate-x-[0%] hover:before:opacity-100 ",
                gooeyLeft:
                    "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-200 after:absolute after:inset-0 after:opacity-0 after:-z-10 after:scale-[2.5] after:bg-gradient-to-l from-muted/50 after:transition-opacity after:duration-200  hover:after:translate-x-[0%] hover:after:opacity-100 ",
                linkHover1:
                    "relative after:absolute after:bg-accent-blue after:bottom-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
                linkHover2:
                    "relative after:absolute after:bg-accent-blue after:bottom-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
            },
            size: {
                default: "h-8 px-3 py-1.5",
                sm: "h-7 rounded-md px-2 text-xs",
                lg: "h-9 rounded-md px-7",
                icon: "h-8 w-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

interface IconProps {
    Icon: React.ElementType;
    iconPlacement: "left" | "right";
}

interface IconRefProps {
    Icon?: never;
    iconPlacement?: undefined;
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & ButtonIconProps>(
    ({ className, variant, size, asChild = false, Icon, iconPlacement, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
                {Icon && iconPlacement === "left" && (
                    <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <Slottable>{props.children}</Slottable>
                {Icon && iconPlacement === "right" && (
                    <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
