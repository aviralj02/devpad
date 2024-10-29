import FullScreenEditor from "@/components/FullScreenEditor";
import React from "react";

type Props = {
  params: Promise<{
    roomId: string;
  }>;
};

const EditorPage = async ({ params }: Props) => {
  const { roomId } = await params;
  return <FullScreenEditor roomId={roomId} />;
};

export default EditorPage;
