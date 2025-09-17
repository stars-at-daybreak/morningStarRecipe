import { DecoratorNode, NodeKey } from 'lexical';
import React from 'react';
import { $applyNodeReplacement } from 'lexical';
import { LexicalNode } from 'lexical';

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;

    constructor(src: string, key?: NodeKey) {
        super(key);
        this.__src = src;
    }

    static getType() {
        return 'image';
    }

    static clone(node: ImageNode) {
        return new ImageNode(node.__src, node.__key);
    }

    static importJSON() {
        return new ImageNode('');
    }

    exportJSON() {
        return {
            type: 'image',
            version: 1,
            src: this.__src,
        };
    }

    createDOM() {
        const img = document.createElement('img');
        img.src = this.__src;
        img.className = 'editor-image';
        return img;
    }

    updateDOM() {
        return false;
    }

    decorate() {
        return <img src={this.__src} alt='uploaded' className='editor-image' />;
    }
}

export function $createImageNode(src: string): ImageNode {
    return $applyNodeReplacement(new ImageNode(src));
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}
