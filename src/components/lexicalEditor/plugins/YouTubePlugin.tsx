import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, $createParagraphNode } from 'lexical';
import { $createYouTubeNode, YouTubeNode } from '../nodes/YouTubeNode';
import { extractYouTubeVideoId } from '../utils/youtubeUtils';
import { INSERT_YOUTUBE_COMMAND } from '../commands/YouTubeCommands';

export default function YouTubePlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([YouTubeNode])) {
            throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
        }

        return editor.registerCommand(
            INSERT_YOUTUBE_COMMAND,
            (payload: string) => {
                const videoId = extractYouTubeVideoId(payload);
                if (videoId) {
                    const youtubeNode = $createYouTubeNode(videoId);
                    const paragraphNode = $createParagraphNode();

                    // YouTube 노드와 새로운 문단을 삽입
                    $insertNodes([youtubeNode, paragraphNode]);

                    // 새로운 문단으로 포커스 이동
                    paragraphNode.select();

                    return true;
                }
                return false;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}
