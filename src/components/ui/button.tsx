import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'secondary' | 'success' | 'outline';
    size?: 'sm' | 'default' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";

        const variantClasses = {
            default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
            destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
            secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500",
            success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
            outline: "border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-blue-500",
        };

        const sizeClasses = {
            sm: "h-8 px-3 text-sm",
            default: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
        };

        return (
            <button
                className={cn(
                    baseClasses,
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };