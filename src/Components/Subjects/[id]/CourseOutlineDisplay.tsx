"use client";

import Loader from "@/Components/Global/Loader";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

type Props = {
  data: string;
};

function CourseOutlineDisplay({ data }: Props) {
  const editor = useCreateBlockNote({
    initialContent: JSON.parse(data),
  });

  if (!data) {
    return <Loader />;
  }

  return (
    <div className="max-h-[600px] w-full overflow-auto">
      <BlockNoteView editor={editor}></BlockNoteView>
    </div>
  );
}

export default CourseOutlineDisplay;
