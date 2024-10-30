"use client";

import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  ImageToolbarPositioner,
  SideMenuPositioner,
  SlashMenuPositioner,
  Theme,
  useBlockNote,
} from "@blocknote/react";

import "@blocknote/core/style.css";
import { lightDefaultTheme } from "@blocknote/react";

const blockTheme = {
  ...lightDefaultTheme,
  componentStyles: (theme) => ({
    Editor: {
      backgroundColor: theme.colors.editor.background,
      borderRadius: theme.borderRadius,
      // border: `1px solid ${theme.colors.border}`,
      // boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    },
    Menu: {
      ".mantine-Menu-item[data-hovered], .mantine-Menu-item:hover": {
        backgroundColor: "#34d399",
      },
    },
    Toolbar: {
      ".mantine-Menu-dropdown": {
        ".mantine-Menu-item:hover": {
          backgroundColor: "blue",
        },
      },
    },
  }),
} satisfies Theme;

type Props = {
  data: string;
  editable?: boolean;
  editor?: BlockNoteEditor;
};

export default function Editor({ data, editable = false }: Props) {
  // Creates a new editor instance.
  const initData = data ? JSON.parse(data) : null;
  const editor: BlockNoteEditor | null = useBlockNote({
    editable: editable,
    initialContent: initData,
    onEditorContentChange: async (editor) => {
      localStorage.setItem(
        "editorContent",
        JSON.stringify(editor.topLevelBlocks),
      );
    },
  });

  return (
    <BlockNoteView editor={editor} theme={blockTheme}>
      <FormattingToolbarPositioner editor={editor} />
      <HyperlinkToolbarPositioner editor={editor} />
      {editable ? (
        <>
          <SlashMenuPositioner editor={editor} />
          <SideMenuPositioner editor={editor} />
          <ImageToolbarPositioner editor={editor} />
        </>
      ) : null}
    </BlockNoteView>
  );
}
