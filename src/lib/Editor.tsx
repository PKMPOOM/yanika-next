"use client"

import { useCreateBlockNote } from "@blocknote/react"

import { BlockNoteView } from "@blocknote/mantine"

import "@blocknote/core/fonts/inter.css"
import "@blocknote/core/style.css"
import "@blocknote/mantine/style.css"
import { BlockNoteEditor } from "@blocknote/core"

type Props = {
    data: string
    editable?: boolean
    editorOveride?: BlockNoteEditor
    activeSubject?: string
}

export default function Editor({
    data,
    editorOveride,
    editable = false,
    activeSubject,
}: Props) {
    const initData = data ? JSON.parse(data) : null
    const localStorageKey = `editorContent-${activeSubject}`

    const editor = useCreateBlockNote({
        initialContent: initData,
        trailingBlock: false,
    })

    const onEditorChange = () => {
        const JSONContent = JSON.stringify(editor.document)
        localStorage.setItem(localStorageKey, JSONContent)
    }

    return (
        <BlockNoteView
            editor={editorOveride ?? editor}
            editable={editable}
            onChange={onEditorChange}
            theme={"light"}
            linkToolbar={false}
            filePanel={false}
            tableHandles={false}
        />
    )
}
