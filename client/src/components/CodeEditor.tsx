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
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { socket } from "@/socket";
import { Action } from "@/types/enums";

type Props = {
  roomId: string;
  onCodeChange: (code: string) => void;
  onLangChange: (lang: LangType) => void;
};

const CodeEditor = ({ roomId, onCodeChange, onLangChange }: Props) => {
  const [language, setLanguage] = useState<LangType>(LANGUAGES[0]);

  const editorRef = useRef<any>(null);

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

  const handleLangChange = (lang: LangType) => {
    setLanguage(lang);
    onLangChange(lang);

    socket.emit(Action.LANG_CHANGE, {
      roomId,
      lang: lang.id,
    });
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

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
      editorRef.current?.setValue(initialCode);
    });

    socket.on(Action.LANG_CHANGE, ({ lang: syncedLang }) => {
      const newLang = LANGUAGES.find((pl: LangType) => syncedLang === pl.id)!;
      setLanguage(newLang);
      onLangChange(newLang);
    });

    socket.on(Action.SYNC_LANG, ({ lang: initialLang }) => {
      const newLang = LANGUAGES.find((pl: LangType) => initialLang === pl.id)!;
      setLanguage(newLang);
      onLangChange(newLang);
    });

    return () => {
      socket.off(Action.CODE_CHANGE);
      socket.off(Action.SYNC_CODE);
      socket.off(Action.LANG_CHANGE);
      socket.off(Action.SYNC_LANG);
    };
  }, []);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="bg-muted p-2 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {language ? (
                language?.name
              ) : (
                <span>
                  <Loader2 className="w-4 h-auto animate-spin" />
                </span>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.id}
                onSelect={() => handleLangChange(lang)}
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
          language={language?.id}
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
