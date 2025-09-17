import React, { useMemo } from 'react';
import { createEditor, EditorState } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { TRANSFORMERS } from '@lexical/markdown';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ImagePlugin from './plugins/ImagePlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ErrorBoundary from './ErrorBoundary';
import { ImageNode } from './nodes/ImageNode';
import { useFileUpload } from '../../hooks/useImageUpload';

interface LexicalEditorProps {
    placeholder?: string;
    initialValue?: string;
    onChange?: (editorState: string) => void;
    className?: string;
    handleInsertImage?: (file: File, editor: any) => Promise<void>;
}

// 💡 리팩토링 1: 컴포넌트 외부에 정적 구성(config) 정의
const editorConfig = {
    namespace: 'MyEditor',
    theme: {
        paragraph: 'editor-paragraph',
        heading: {
            h1: 'editor-heading-h1',
            h2: 'editor-heading-h2',
            h3: 'editor-heading-h3',
        },
        list: {
            ol: 'editor-list-ol',
            ul: 'editor-list-ul',
            listitem: 'editor-listitem',
        },
        text: {
            bold: 'editor-text-bold',
            italic: 'editor-text-italic',
            underline: 'editor-text-underline',
        },
    },
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        ImageNode,
    ],
    onError: (error: Error) => console.error(error),
};

const LexicalEditor: React.FC<LexicalEditorProps> = ({
    placeholder = 'Enter some rich text...',
    initialValue = '',
    onChange,
    className,
    handleInsertImage,
}) => {
    const { uploadFile } = useFileUpload();

    // 💡 리팩토링 2: EditorState 생성 로직을 더 명확하게
    const initialEditorState = useMemo(() => {
        // 기존 코드의 createEditor 호출은 이미 유효한 접근법입니다.
        // 다만, Lexical의 EditorState는 특정 nodes 구성에 따라 생성되어야 하므로,
        // 이 부분은 Lexical의 권장 방식에 따라 유지하는 것이 좋습니다.
        const editor = createEditor(editorConfig);
        let state: EditorState;

        try {
            // initialValue가 있다면 JSON 문자열을 파싱합니다.
            state = initialValue ? editor.parseEditorState(initialValue) : editor.getEditorState(); // 없으면 빈 상태를 가져옵니다.
        } catch (e) {
            console.error('Failed to parse initial JSON, falling back to empty state:', e);
            state = editor.getEditorState(); // 파싱 실패 시에도 빈 상태로 폴백합니다.
        }

        return state;
    }, [initialValue]);

    // 💡 리팩토링 3: initialConfig 객체를 합치기
    const initialConfig = {
        ...editorConfig,
        editorState: initialEditorState,
    };

    return (
        <div className={`lexical-editor ${className}`}>
            <LexicalComposer initialConfig={initialConfig}>
                <div className='editor-container'>
                    <ToolbarPlugin />
                    <div className='editor-inner'>
                        <RichTextPlugin
                            contentEditable={<ContentEditable className='editor-input' />}
                            placeholder={<div className='editor-placeholder'>{placeholder}</div>}
                            ErrorBoundary={ErrorBoundary}
                        />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <ListPlugin />
                        <LinkPlugin />
                        <TabIndentationPlugin />
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                        <CodeHighlightPlugin />
                        <ImagePlugin uploadFile={uploadFile} />
                        {onChange && (
                            <OnChangePlugin
                                onChange={editorState => {
                                    editorState.read(() => {
                                        onChange(JSON.stringify(editorState.toJSON()));
                                    });
                                }}
                            />
                        )}
                    </div>
                </div>
            </LexicalComposer>
        </div>
    );
};

export default LexicalEditor;
