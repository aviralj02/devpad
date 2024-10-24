"use client";

import { useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { ChevronDown, Copy, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type LangType = {
  id: string;
  name: string;
};

const collaborators = [
  {
    socketId: 1,
    name: "Alice Johnson",
  },
  { socketId: 2, name: "Bob Smith" },
  {
    socketId: 3,
    name: "Charlie Brown",
  },
  {
    socketId: 4,
    name: "Diana Prince",
  },
  {
    socketId: 5,
    name: "Diana Prince",
  },
  {
    socketId: 6,
    name: "Diana Prince",
  },
  // {
  //   socketId: 7,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 8,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 9,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 10,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 11,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 12,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 13,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 14,
  //   name: "Diana Prince",
  // },
  // {
  //   socketId: 15,
  //   name: "Diana Prince",
  // },
];

const languages: LangType[] = [
  { id: "go", name: "Go" },
  { id: "typescript", name: "TypeScript" },
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "ruby", name: "Ruby" },
  { id: "rust", name: "Rust" },
  { id: "swift", name: "Swift" },
  { id: "css", name: "CSS" },
];

export default function FullScreenEditor() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [language, setLanguage] = useState<LangType>(languages[0]);

  const editorRef = useRef<any>(null);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (lang: LangType) => {
    setLanguage(lang);
    if (editorRef.current) {
      const defaultValue = `// Start coding in ${lang.name}`;

      editorRef.current.setValue(defaultValue);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
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
                    {collaborator.name.slice(0, 2)}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm truncate">
                      {collaborator.name}
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
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="bg-muted p-2 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-between">
                {language.name}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.id}
                  onSelect={() => handleLanguageChange(lang)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language.id}
            defaultValue={`// Start coding in ${language.name}`}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              scrollBeyondLastLine: false,
            }}
            onMount={handleEditorDidMount}
          />
        </div>
      </main>
    </div>
  );
}
