import React, { useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $insertNodes,
    $getSelection,
    $isRangeSelection,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $isTextNode,
} from 'lexical';
import { $createImageNode } from '../nodes/ImageNode';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaYoutube } from 'react-icons/fa';
import { useFileUpload } from '../../../hooks/useImageUpload';
import { INSERT_YOUTUBE_COMMAND } from '../commands/YouTubeCommands';
import { useModal } from '../../modal/ModalContext.ts';
import YoutubeModal from '../../modal/YoutubeModal.tsx';
const LowPriority = 1;

const FONT_SIZE_OPTIONS = [
    { name: '12', value: '12px' },
    { name: '16', value: '16px' },
    { name: '20', value: '20px' },
    { name: '24', value: '24px' },
];

const ToolbarPlugin: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [fontSize, setFontSize] = useState('16px');
    const [fontColor, setFontColor] = useState('#000000');
    const { uploadFile, isUploading } = useFileUpload();
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>();

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar();
                return false;
            },
            LowPriority
        );
    }, [editor, updateToolbar]);

    const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const filename = await uploadFile(file);
        if (filename) {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            const imageUrl = `${apiUrl}/${filename}`;

            editor.update(() => {
                const node = $createImageNode(imageUrl);
                $insertNodes([node]);
            });
        }

        e.target.value = '';
    };

    const handleFormat = (format: 'bold' | 'italic' | 'code' | 'underline' | 'strikethrough') => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    const handleAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    };

    const applyStyleToSelection = (styleName: string, value: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.getNodes().forEach(node => {
                    if ($isTextNode(node)) {
                        node.setStyle(`${styleName}: ${value}`);
                    }
                });
            }
        });
    };

    useEffect(() => {
        if (youtubeUrl) {
            console.log('youtubeUrl', youtubeUrl);
            editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, youtubeUrl);
        }
    }, [youtubeUrl]);

    return (
        <div className='toolbar'>
            <button
                type='button'
                onClick={() => handleFormat('bold')}
                className={`toolbar-item ${isBold ? 'active' : ''}`}
            >
                <b>B</b>
            </button>
            <button
                type='button'
                onClick={() => handleFormat('italic')}
                className={`toolbar-item ${isItalic ? 'active' : ''}`}
            >
                <i>I</i>
            </button>
            <button
                type='button'
                onClick={() => handleFormat('underline')}
                className={`toolbar-item ${isUnderline ? 'active' : ''}`}
            >
                <u>U</u>
            </button>
            <div className='divider' />

            <button type='button' onClick={() => handleAlignment('left')} className='toolbar-item' title='왼쪽 정렬'>
                <FaAlignLeft className='w-5 h-5' />
            </button>

            <button
                type='button'
                onClick={() => handleAlignment('center')}
                className='toolbar-item'
                title='가운데 정렬'
            >
                <FaAlignCenter className='w-5 h-5' />
            </button>

            <button type='button' onClick={() => handleAlignment('right')} className='toolbar-item' title='오른쪽 정렬'>
                <FaAlignRight className='w-5 h-5' />
            </button>
            <div className='divider' />
            <select
                className='toolbar-select'
                value={fontSize}
                onChange={e => {
                    setFontSize(e.target.value);
                    applyStyleToSelection('font-size', e.target.value);
                }}
            >
                {FONT_SIZE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
            <input
                type='color'
                value={fontColor}
                onChange={e => {
                    setFontColor(e.target.value);
                    applyStyleToSelection('color', e.target.value);
                }}
            />
            <div className='divider' />

            <label className={`toolbar-item ${isUploading ? 'uploading' : ''}`}>
                {isUploading ? '⏳' : '📷'}
                <input
                    type='file'
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={onImageUpload}
                    style={{ display: 'none' }}
                    disabled={isUploading}
                />
            </label>

            <button type='button' onClick={() => setIsOpen(true)} className='toolbar-item' title='YouTube 영상 삽입'>
                <FaYoutube className='w-5 h-5' style={{ color: '#FF0000' }} />
            </button>

            {isOpen && (
                <YoutubeModal
                    handleModal={(isOpen: boolean) => setIsOpen(isOpen)}
                    handleYoutubeUrl={youtubeUrl => setYoutubeUrl(youtubeUrl)}
                />
            )}
        </div>
    );
};

export default ToolbarPlugin;
