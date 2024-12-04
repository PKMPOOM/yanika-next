"use client";

import { useCreateBlockNote } from "@blocknote/react";

import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor } from "@blocknote/core";

type Props = {
  data: string;
  editable?: boolean;
  onchange?: () => void;
  editorOveride?: BlockNoteEditor;
};

export default function Editor({
  data,
  editorOveride,
  onchange = undefined,
  editable = false,
}: Props) {
  const initData = data ? JSON.parse(data) : null;

  const editor = useCreateBlockNote({
    initialContent: initData,
    trailingBlock: false,
  });

  return (
    <BlockNoteView
      editor={editorOveride ?? editor}
      editable={editable}
      onChange={onchange}
      theme={"light"}
      linkToolbar={false}
      filePanel={false}
      tableHandles={false}
    />
  );
}
