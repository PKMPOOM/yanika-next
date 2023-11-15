"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loader from "@/Components/Global/Loader";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

export default function ManageUser() {
  const { data: session, status } = useSession();
  const initialContent: string | null = localStorage.getItem("editorContent");

  const editor: BlockNoteEditor = useBlockNote({
    editable: session?.user.role === "admin",
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      localStorage.setItem(
        "editorContent",
        JSON.stringify(editor.topLevelBlocks),
      );
    },
  });

  if (status === "loading" || !session) {
    return <Loader />;
  }

  const isAdmin = session.user.role === "admin";

  if (!isAdmin) {
    redirect("/subjects");
  }

  return (
    <section className=" flex min-h-full items-center justify-center">
      <BlockNoteView
        editor={editor}
        onChange={() => {
          console.log(editor);
        }}
      />
    </section>
  );
}
