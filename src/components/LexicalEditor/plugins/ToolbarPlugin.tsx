import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $isRootOrShadowRoot,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    CAN_UNDO_COMMAND,
    CAN_REDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    createCommand,
    LexicalEditor,
    DecoratorNode,
} from 'lexical';
import { $isListNode, ListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { $isHeadingNode, $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// ==============================
// Image Node & Command
// ==============================
export const INSERT_IMAGE_COMMAND = createCommand<{ file: File; altText?: string }>();

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;

    static getType() {
        return 'image';
    }

    static clone(node: ImageNode) {
        return new ImageNode(node.__src, node.__altText);
    }

    constructor(src: string, altText = '') {
        super();
        this.__src = src;
        this.__altText = altText;
    }

    createDOM() {
        const img = document.createElement('img');
        img.src = this.__src;
        img.alt = this.__altText;
        img.style.maxWidth = '100%';
        return img;
    }

    updateDOM() {
        return false;
    }

    decorate() {
        return <img src={this.__src} alt={this.__altText} style={{ maxWidth: '100%' }} />;
    }
}

export function $createImageNode(src: string, altText = '') {
    return new ImageNode(src, altText);
}

export function registerImagePlugin(editor: LexicalEditor) {
    return editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        ({ file, altText }) => {
            const reader = new FileReader();
            reader.onload = () => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const src = reader.result as string;
                        const node = $createImageNode(src, altText || '');
                        selection.insertNodes([node]);
                    }
                });
            };
            reader.readAsDataURL(file);
            return true;
        },
        0
    );
}

// ==============================
// ToolbarPlugin
// ==============================
const LowPriority = 1;

interface ToolbarIconProps {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}

const ToolbarIcon: React.FC<ToolbarIconProps> = ({ onClick, className = '', disabled = false, children, title }) => (
    <button
        className={`toolbar-item ${className} ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
        type='button'
    >
        {children}
    </button>
);

const Divider: React.FC = () => <div className='divider' />;

const ToolbarPlugin: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef<HTMLDivElement>(null);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [blockType, setBlockType] = useState('paragraph');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // ==========================
    // Toolbar 업데이트
    // ==========================
    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsCode(selection.hasFormat('code'));

            const anchorNode = selection.anchor.getNode();
            let element = anchorNode.getTopLevelElementOrThrow();

            if ($isListNode(element)) {
                setBlockType(element.getListType());
            } else if ($isHeadingNode(element)) {
                setBlockType(element.getTag());
            } else if ($isRootOrShadowRoot(element)) {
                setBlockType('paragraph');
            } else {
                setBlockType(element.getType());
            }
        }
    }, []);

    useEffect(() => {
        const unregisterImage = registerImagePlugin(editor);

        const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });

        const removeSelectionListener = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar();
                return false;
            },
            LowPriority
        );

        const removeUndoListener = editor.registerCommand(
            CAN_UNDO_COMMAND,
            payload => {
                setCanUndo(payload);
                return false;
            },
            LowPriority
        );

        const removeRedoListener = editor.registerCommand(
            CAN_REDO_COMMAND,
            payload => {
                setCanRedo(payload);
                return false;
            },
            LowPriority
        );

        return () => {
            unregisterImage();
            removeUpdateListener();
            removeSelectionListener();
            removeUndoListener();
            removeRedoListener();
        };
    }, [editor, updateToolbar]);

    // ==========================
    // Paragraph / Heading
    // ==========================
    const formatHeading = (headingSize: HeadingTagType) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertNodes([$createHeadingNode(headingSize)]);
                }
            });
        }
    };

    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertNodes([$createParagraphNode()]);
                }
            });
        }
    };

    // ==========================
    // 이미지 업로드
    // ==========================
    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
            setSelectedFiles(imageFiles);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleInsertImages = () => {
        selectedFiles.forEach(file => {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                file,
                altText: `업로드된 이미지 ${file.name}`,
            });
        });
        setSelectedFiles([]);
    };

    // ==========================
    // 렌더
    // ==========================
    return (
        <div className='toolbar' ref={toolbarRef}>
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                disabled={!canUndo}
                title='실행 취소'
            >
                ↶
            </ToolbarIcon>
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                disabled={!canRedo}
                title='다시 실행'
            >
                ↷
            </ToolbarIcon>
            <Divider />
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={isBold ? 'active' : ''}
                title='굵게'
            >
                <strong>B</strong>
            </ToolbarIcon>
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={isItalic ? 'active' : ''}
                title='기울임'
            >
                <em>I</em>
            </ToolbarIcon>
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={isUnderline ? 'active' : ''}
                title='밑줄'
            >
                <span style={{ textDecoration: 'underline' }}>U</span>
            </ToolbarIcon>
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                className={isStrikethrough ? 'active' : ''}
                title='취소선'
            >
                <span style={{ textDecoration: 'line-through' }}>S</span>
            </ToolbarIcon>
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
                className={isCode ? 'active' : ''}
                title='코드'
            >
                <code>{`{}`}</code>
            </ToolbarIcon>
            <Divider />
            <ToolbarIcon onClick={handleImageUploadClick} title='이미지 업로드'>
                🖼️
            </ToolbarIcon>
            {selectedFiles.length > 0 && (
                <ToolbarIcon onClick={handleInsertImages} className='confirm-button' title='이미지 삽입'>
                    확인
                </ToolbarIcon>
            )}
            <Divider />
            <ToolbarIcon onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} title='왼쪽 정렬'>
                ⫷
            </ToolbarIcon>
            <ToolbarIcon onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} title='가운데 정렬'>
                ⫸
            </ToolbarIcon>
            <ToolbarIcon onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} title='오른쪽 정렬'>
                ⫹
            </ToolbarIcon>
            <ToolbarIcon onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} title='양쪽 정렬'>
                ⫺
            </ToolbarIcon>
            <Divider />
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                title='글머리 기호 목록'
            >
                •
            </ToolbarIcon>
            <ToolbarIcon
                onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                title='번호 매기기 목록'
            >
                1.
            </ToolbarIcon>
            <Divider />
            <select
                className='toolbar-select'
                value={blockType}
                onChange={e => {
                    const value = e.target.value;
                    if (value === 'paragraph') formatParagraph();
                    else formatHeading(value as HeadingTagType);
                }}
            >
                <option value='paragraph'>본문</option>
                <option value='h1'>제목 1</option>
                <option value='h2'>제목 2</option>
                <option value='h3'>제목 3</option>
                <option value='h4'>제목 4</option>
                <option value='h5'>제목 5</option>
            </select>

            <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept='image/*'
                multiple
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ToolbarPlugin;
