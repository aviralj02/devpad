"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LANGUAGES } from "@/lib/constants";
import { Editor, OnMount } from "@monaco-editor/react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { socket } from "@/socket";
import { Action } from "@/types/enums";

type Props = {
  roomId: string;
  onCodeChange: (code: string) => void;
};

const CodeEditor = ({ roomId, onCodeChange }: Props) => {
  const [language, setLanguage] = useState<LangType>(LANGUAGES[0]);

  const editorRef = useRef<any>(null);
  const initialCodeRef = useRef<string | null>(null);

  // 🧠 Brain Dump #2:
  // Avoids running multiple setValue concurrently resulting in infinite loop,
  // and yes prevents race condition between local and remote code updates.
  const isUpdatingFromRemote = useRef<boolean>(false);

  const handleCodeChange = () => {
    if (isUpdatingFromRemote.current) return;
    const newCode = editorRef.current?.getValue();
    onCodeChange(newCode);

    socket.emit(Action.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    if (initialCodeRef.current) {
      editorRef.current.setValue(initialCodeRef.current);
      initialCodeRef.current = null;
    }

    editorRef.current.onDidChangeModelContent(handleCodeChange);
  };

  useEffect(() => {
    socket.on(Action.CODE_CHANGE, ({ code: syncedCode }) => {
      const currentCode = editorRef.current?.getValue();

      if (currentCode !== syncedCode) {
        isUpdatingFromRemote.current = true;
        editorRef.current?.setValue(syncedCode);
        isUpdatingFromRemote.current = false;
      }
    });

    socket.on(Action.SYNC_CODE, ({ code: initialCode }) => {
      initialCodeRef.current = initialCode;
    });

    return () => {
      socket.off(Action.CODE_CHANGE);
      socket.off(Action.SYNC_CODE);
    };
  }, []);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="bg-muted p-2 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {language?.name}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.id}
                onSelect={() => setLanguage(lang)}
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
          defaultValue={`// Start Writing...`}
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
  );
};

export default CodeEditor;
