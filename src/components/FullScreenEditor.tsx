"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { Action } from "@/types/enums";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor";

type Props = {
  roomId: string;
};

const FullScreenEditor = ({ roomId }: Props) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const { userName } = useUser();
  const { toast } = useToast();
  const router = useRouter();

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

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar collaborators={collaborators} />

      <CodeEditor roomId={roomId} />
    </div>
  );
};

export default FullScreenEditor;
