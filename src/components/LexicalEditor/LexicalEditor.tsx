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
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
// import { TRANSFORMERS } from '@lexical/markdown'; // 제거
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ImagePlugin from './plugins/ImagePlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import ErrorBoundary from './ErrorBoundary';
import { ImageNode } from './nodes/ImageNode';
import { YouTubeNode } from './nodes/YouTubeNode';
import './LexicalEditor.css';
import { MATCHERS } from '../../utils/lexicalUtils.ts';

// 리스트 제외한 커스텀 transformers 추가
import {
    BOLD_ITALIC_STAR,
    BOLD_ITALIC_UNDERSCORE,
    BOLD_STAR,
    BOLD_UNDERSCORE,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    STRIKETHROUGH,
    INLINE_CODE,
    CODE,
    HEADING,
    QUOTE,
} from '@lexical/markdown';

// 리스트 관련 transformer 제외
const CUSTOM_TRANSFORMERS = [
    BOLD_ITALIC_STAR,
    BOLD_ITALIC_UNDERSCORE,
    BOLD_STAR,
    BOLD_UNDERSCORE,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    STRIKETHROUGH,
    INLINE_CODE,
    CODE,
    HEADING,
    QUOTE,
];

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
        text: {
            bold: 'editor-text-bold',
            italic: 'editor-text-italic',
            underline: 'editor-text-underline',
        },
        link: 'editor-auto-link',
        quote: 'editor-quote',
        code: 'editor-code',
        codeHighlight: {
            atrule: 'editor-tokenAttr',
            attr: 'editor-tokenAttr',
            boolean: 'editor-tokenProperty',
            builtin: 'editor-tokenSelector',
            cdata: 'editor-tokenComment',
            char: 'editor-tokenSelector',
            class: 'editor-tokenFunction',
            'class-name': 'editor-tokenFunction',
            comment: 'editor-tokenComment',
            constant: 'editor-tokenProperty',
            deleted: 'editor-tokenProperty',
            doctype: 'editor-tokenComment',
            entity: 'editor-tokenOperator',
            function: 'editor-tokenFunction',
            important: 'editor-tokenVariable',
            inserted: 'editor-tokenSelector',
            keyword: 'editor-tokenAttr',
            namespace: 'editor-tokenVariable',
            number: 'editor-tokenProperty',
            operator: 'editor-tokenOperator',
            prolog: 'editor-tokenComment',
            property: 'editor-tokenProperty',
            punctuation: 'editor-tokenPunctuation',
            regex: 'editor-tokenVariable',
            selector: 'editor-tokenSelector',
            string: 'editor-tokenSelector',
            symbol: 'editor-tokenProperty',
            tag: 'editor-tokenProperty',
            url: 'editor-tokenOperator',
            variable: 'editor-tokenVariable',
        },
    },
    nodes: [
        HeadingNode,
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
                        <MarkdownShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />
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
