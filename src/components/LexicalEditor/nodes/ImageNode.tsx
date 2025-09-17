import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import React from 'react';

export type SerializedImageNode = SerializedLexicalNode & {
    type: 'image';
    src: string;
    altText: string;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;

    static getType() {
        return 'image';
    }

    static clone(node: ImageNode) {
        return new ImageNode(node.__src, node.__altText, node.__key);
    }

    // ⭐ 반드시 필요
    static importJSON(serializedNode: SerializedImageNode) {
        const { src = '', altText = '' } = serializedNode;
        return $createImageNode(src, altText);
    }

    exportJSON(): SerializedImageNode {
        return {
            type: 'image',
            src: this.__src,
            altText: this.__altText,
            version: 1,
        };
    }

    constructor(src = '', altText = '', key?: NodeKey) {
        super(key);
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

export function $createImageNode(src = '', altText = '') {
    return new ImageNode(src, altText);
}

export function $isImageNode(node: LexicalNode): node is ImageNode {
    return node.getType() === 'image';
}
