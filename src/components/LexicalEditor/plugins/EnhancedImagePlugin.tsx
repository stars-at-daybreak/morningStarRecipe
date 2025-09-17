import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createImageNode } from '../nodes/ImageNode';

export interface InsertImagePayload {
    file: File;
    altText?: string;
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');

interface ImagePluginProps {
    uploadFile: (file: File) => Promise<string | null>; // useFileUpload 훅에서 반환되는 함수
}

const ImagePlugin: React.FC<ImagePluginProps> = ({ uploadFile }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            INSERT_IMAGE_COMMAND,
            (payload: InsertImagePayload) => {
                const { file, altText = '' } = payload;

                // 비동기 처리를 별도 함수로 분리
                const handleImageUpload = async () => {
                    try {
                        // 파일 업로드 진행
                        const imageFileName = await uploadFile(file);
                        console.log(file);
                        // 업로드 실패시 처리
                        if (!imageFileName) {
                            console.error('Image upload failed: No URL returned');
                            return;
                        }

                        // 파일명을 전체 URL로 변환
                        const imageUrl = imageFileName.startsWith('http')
                            ? imageFileName
                            : `https://dev.wenivops.co.kr/services/mandarin/${imageFileName}`;

                        // 이미지 노드 생성 및 삽입
                        editor.update(() => {
                            const imageNode = $createImageNode({
                                src: imageUrl,
                                altText,
                                maxWidth: 800,
                            });

                            $insertNodes([imageNode]);
                        });
                    } catch (error) {
                        console.error('Image upload failed:', error);
                    }
                };

                // 비동기 함수 실행
                handleImageUpload();

                // 즉시 true 반환
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor, uploadFile]);

    // 드래그 앤 드롭 및 붙여넣기 처리
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return;

            const items = Array.from(clipboardData.items);
            const imageItem = items.find(item => item.type.startsWith('image/'));

            if (imageItem) {
                event.preventDefault();
                const file = imageItem.getAsFile();
                if (file) {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { file });
                }
            }
        };

        const handleDrop = (event: DragEvent) => {
            event.preventDefault();
            const files = event.dataTransfer?.files;
            if (!files) return;

            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

            imageFiles.forEach(file => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, { file });
            });
        };

        const handleDragOver = (event: DragEvent) => {
            event.preventDefault();
        };

        // 에디터 컨테이너에 이벤트 리스너 추가
        const editorElement = editor.getRootElement();
        if (editorElement) {
            editorElement.addEventListener('paste', handlePaste);
            editorElement.addEventListener('drop', handleDrop);
            editorElement.addEventListener('dragover', handleDragOver);
        }

        return () => {
            if (editorElement) {
                editorElement.removeEventListener('paste', handlePaste);
                editorElement.removeEventListener('drop', handleDrop);
                editorElement.removeEventListener('dragover', handleDragOver);
            }
        };
    }, [editor]);

    return null;
};

export default ImagePlugin;
