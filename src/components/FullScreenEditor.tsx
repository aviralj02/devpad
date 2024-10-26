"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LANGUAGES } from "@/lib/constants";
import { socket } from "@/socket";
import { Action } from "@/types/enums";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";

type Props = {
  roomId: string;
};

const FullScreenEditor = ({ roomId }: Props) => {
  const [language, setLanguage] = useState<LangType>(LANGUAGES[0]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const { userName } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!userName) {
      throw new Error("User Name is Required!");
    }
  }, []);

  useEffect(() => {
    socket.on("connect_error", (err) => handleErrors(err));
    socket.on("connect_failed", (err) => handleErrors(err));

    socket.emit(Action.JOIN, {
      roomId,
      username: userName,
    });

    socket.on(Action.JOINED, ({ clients, username: newUserName, socketId }) => {
      if (newUserName !== userName) {
        toast({
          title: `${newUserName} has joined.`,
        });
      }

      setCollaborators(clients);
    });

    socket.on(
      Action.DISCONNECTED,
      ({ socketId, username: leavingUserName }) => {
        toast({
          title: `${leavingUserName} left the room.`,
        });

        setCollaborators((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      }
    );

    return () => {
      socket.disconnect();
      socket.off(Action.JOINED);
      socket.off(Action.DISCONNECTED);
    };
  }, []);

  const handleErrors = (error: any) => {
    console.log("socket error", error);
    toast({
      title: "Connection Failed...",
      description: error,
    });
    router.replace("/");
  };

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
      <Sidebar collaborators={collaborators} />

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
              {LANGUAGES.map((lang) => (
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
};

export default FullScreenEditor;
