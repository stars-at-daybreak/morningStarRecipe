import React from 'react';
import { DecoratorNode, NodeKey, SerializedLexicalNode } from 'lexical';
import YouTubeComponent from '../components/YouTubeComponent';

export interface SerializedYouTubeNode extends SerializedLexicalNode {
    videoId: string;
    type: 'youtube';
    version: 1;
}

export class YouTubeNode extends DecoratorNode<JSX.Element> {
    __videoId: string;

    static getType(): string {
        return 'youtube';
    }

    static clone(node: YouTubeNode): YouTubeNode {
        return new YouTubeNode(node.__videoId, node.__key);
    }

    constructor(videoId: string, key?: NodeKey) {
        super(key);
        this.__videoId = videoId;
    }

    createDOM(): HTMLElement {
        const div = document.createElement('div');
        div.style.display = 'contents';
        return div;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): JSX.Element {
        return <YouTubeComponent videoId={this.__videoId} />;
    }

    static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
        const { videoId } = serializedNode;
        return $createYouTubeNode(videoId);
    }

    exportJSON(): SerializedYouTubeNode {
        return {
            type: 'youtube',
            version: 1,
            videoId: this.__videoId,
        };
    }

    isInline(): false {
        return false;
    }
}

export function $createYouTubeNode(videoId: string): YouTubeNode {
    return new YouTubeNode(videoId);
}
