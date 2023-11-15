"use client";

import Loader from "@/Components/Global/Loader";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  Theme,
  lightDefaultTheme,
  useBlockNote,
} from "@blocknote/react";

const blockTheme = {
  ...lightDefaultTheme,
  componentStyles: (theme) => ({
    Editor: {
      backgroundColor: theme.colors.editor.background,
      borderRadius: theme.borderRadius,
    },
    Menu: {
      ".mantine-Menu-item[data-hovered], .mantine-Menu-item:hover": {
        backgroundColor: "#34d399",
      },
    },
    SideMenu: {
      width: 0,
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
};

function CourseOutlineDisplay({ data }: Props) {
  const editor: BlockNoteEditor = useBlockNote({
    editable: false,
    initialContent: JSON.parse(data),
  });

  if (!data) {
    return <Loader />;
  }

  return (
    <div className=" max-h-[600px] w-full overflow-auto">
      <BlockNoteView editor={editor} theme={blockTheme}>
        <FormattingToolbarPositioner editor={editor} />
        <HyperlinkToolbarPositioner editor={editor} />
      </BlockNoteView>
    </div>
  );
}

export default CourseOutlineDisplay;
