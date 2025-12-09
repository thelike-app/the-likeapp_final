import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  clickToOpen: boolean;
};

const TooltipOpenContext = React.createContext<TooltipContextValue | null>(
  null
);

type TooltipProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Root
> & {
  clickToOpen?: boolean;
};

function Tooltip({
  children,
  clickToOpen = true,
  ...props
}: TooltipProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipOpenContext.Provider value={{ open, setOpen, clickToOpen }}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {children}
      </TooltipPrimitive.Root>
    </TooltipOpenContext.Provider>
  );
}

type TriggerProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Trigger
>;

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  TriggerProps
>((props, ref) => {
  const ctx = React.useContext(TooltipOpenContext);
  const { onClick, onPointerDown, onKeyDown, ...rest } = props;
  const handleClick: React.MouseEventHandler<HTMLElement> = (event): void => {
    onClick?.(event);
    if (ctx?.clickToOpen) {
      ctx.setOpen(!ctx.open);
    }
  };
  const handlePointerDown: React.PointerEventHandler<HTMLElement> = (
    event
  ): void => {
    onPointerDown?.(event);
    // On touch devices, toggle open on pointer down for better UX.
    if (ctx?.clickToOpen && event.pointerType === "touch") {
      ctx.setOpen(!ctx.open);
    }
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (
    event
  ): void => {
    onKeyDown?.(event);
    if (!ctx?.clickToOpen) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      ctx.setOpen(!ctx.open);
    }
  };
  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
