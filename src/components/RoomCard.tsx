"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import Image from "next/image";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { toKebabCase } from "@/lib/utils";

type Props = {};

const RoomCard = (props: Props) => {
  const [roomId, setRoomId] = useState<string>("");
  const { userName, setUserName } = useUser();

  const { toast } = useToast();
  const router = useRouter();

  const generateRoomId = () => {
    const id = v4();
    setRoomId(id);
  };

  const handleSubmit = () => {
    if (!roomId || !userName) {
      toast({
        title: "Fields are required!",
        description:
          !roomId && !userName
            ? "Room ID and User Name are empty."
            : !roomId
            ? "Room ID is empty."
            : !userName
            ? "User Name is empty."
            : "",
      });
      return;
    }

    router.push(`/editor/${toKebabCase(roomId)}`);
  };

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <div className="flex items-center gap-5">
          <div>
            <Image
              src="/devpad-icon.svg"
              alt="devpad-image"
              width="55"
              height="55"
            />
          </div>
          <div className="flex flex-col space-y-1 ">
            <CardTitle className="sm:text-2xl text-lg">Devpad</CardTitle>
            <CardDescription className="sm:text-sm text-xs">
              Where Developers Collaborate.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            name="roomId"
            placeholder="Room ID"
            value={roomId}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRoomId(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <Input
            type="text"
            name="userName"
            placeholder="User Name"
            value={userName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild onClick={generateRoomId}>
              <Button variant="link" className="p-0">
                new room?
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You can either write a room ID or generate one</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="secondary" onClick={handleSubmit}>
          Join
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
