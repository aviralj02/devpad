"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Copy, LogOut } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  collaborators: Collaborator[];
};

const Sidebar = ({ collaborators }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={cn(
        "flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col bg-muted",
          isCollapsed ? "items-center" : ""
        )}
      >
        <div className="flex items-center justify-between p-4">
          <h2
            className={cn(
              "text-lg font-semibold",
              isCollapsed ? "sr-only" : ""
            )}
          >
            Collaborators
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-full">
          <ul className="space-y-3 p-4">
            {collaborators.map((collaborator) => (
              <li
                key={collaborator.socketId}
                className="flex items-center gap-3 w-full"
              >
                <div className="grid place-content-center w-9 h-9 rounded-full bg-primary-foreground">
                  {collaborator.username.slice(0, 2)}
                </div>
                {!isCollapsed && (
                  <span className="text-sm truncate">
                    {collaborator.username}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>

        <div className="p-4 border-t border-gray-700">
          <TooltipProvider>
            <div
              className={cn(
                "flex justify-between",
                isCollapsed ? "flex-col gap-2" : ""
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Room ID</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Leave Room</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
