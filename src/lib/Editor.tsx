"use client";

import { useCreateBlockNote } from "@blocknote/react";

import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor } from "@blocknote/core";

// const blockTheme = {
//   ...lightDefaultTheme,
//   componentStyles: (theme) => ({
//     Editor: {
//       backgroundColor: theme.colors.editor.background,
//       borderRadius: theme.borderRadius,
//       // border: `1px solid ${theme.colors.border}`,
//       // boxShadow: `0 2px 4px ${theme.colors.shadow}`,
//     },
//     Menu: {
//       ".mantine-Menu-item[data-hovered], .mantine-Menu-item:hover": {
//         backgroundColor: "#34d399",
//       },
//     },
//     Toolbar: {
//       ".mantine-Menu-dropdown": {
//         ".mantine-Menu-item:hover": {
//           backgroundColor: "blue",
//         },
//       },
//     },
//   }),
// } satisfies Theme;

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
