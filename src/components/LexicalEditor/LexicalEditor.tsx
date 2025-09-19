import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
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
import YouTubePlugin from './plugins/YouTubePlugin';
import ErrorBoundary from './ErrorBoundary';
import { ImageNode } from './nodes/ImageNode';
import { YouTubeNode } from './nodes/YouTubeNode';
import './LexicalEditor.css';
import { MATCHERS } from '../../utils/lexicalUtils.ts';

interface LexicalEditorProps {
    placeholder?: string;
    initialValue?: string;
    onChange?: (editorState: string) => void;
    className?: string;
    handleInsertImage?: (file: File, editor: any) => Promise<void>;
}

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
        link: 'editor-auto-link',
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
        YouTubeNode,
    ],
    onError: (error: Error) => console.error(error),
};

const LexicalEditor: React.FC<LexicalEditorProps> = ({
    placeholder = '내용을 입력하세요...',
    initialValue = '',
    onChange,
    className,
}) => {
    const initialConfig = {
        ...editorConfig,
        editorState: initialValue || undefined,
    };

    return (
        <div className={`lexical-editor ${className || ''}`}>
            <LexicalComposer initialConfig={initialConfig}>
                <div className='editor-container'>
                    <ToolbarPlugin />
                    <div className='editor-inner'>
                        <RichTextPlugin
                            contentEditable={<ContentEditable className='editor-input' />}
                            placeholder={<div className='editor-placeholder'>{placeholder}</div>}
                            ErrorBoundary={props => <ErrorBoundary {...props} onError={console.error} />}
                        />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <AutoLinkPlugin matchers={MATCHERS} />
                        <TabIndentationPlugin />
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                        <ImagePlugin />
                        <YouTubePlugin />
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
