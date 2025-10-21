"use client";

import { useSidebar } from "@/store/use-sidebar";
import { Button } from "@/components/ui/button"; 
// Import both icons needed for the collapsed and expanded states
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react"; 
import { Hint } from "@/components/hint";

export const Toggle = () => {
  // Destructure all necessary state and actions
  const {
    collapsed,
    onExpand, // Now used for the expand button
    onCollapse
  } = useSidebar((state) => state);

  const label = collapsed? "Expand" : "Collapse";

  return (
    <div>
      {/* 1. VIEW WHEN SIDEBAR IS NOT COLLAPSED (!collapsed) - Shows the Collapse Button */}
      {!collapsed && (
        <div className="p-3 pl-6 mb-2 flex items-center w-full">
          
          <p className="font-semibold text-primary">
            For you
          </p>

            <Hint label = {label}  side="right" asChild>
                 <Button
            onClick={onCollapse}
            className="h-auto p-2 ml-auto"
            variant="ghost"
          >
            <ArrowLeftFromLine className="h-4 w-4" />
          </Button>
            </Hint>
        </div>
      )}

      {/* 2. VIEW WHEN SIDEBAR IS COLLAPSED (collapsed) - Shows the Expand Button (your new code) */}
      {collapsed && (
        <div className="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
          <Hint label={label} side="right" asChild>
            <Button
            onClick={onExpand}
            variant="ghost"
            className="h-auto p-2"
          >
            <ArrowRightFromLine className="h-4 w-4" />
          </Button>
          </Hint>
        </div>
      )}
    </div>
  );
};