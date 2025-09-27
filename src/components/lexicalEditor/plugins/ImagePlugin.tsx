import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { ImageNode } from '../nodes/ImageNode';

const ImagePlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImageNode not registered on editor');
        }
    }, [editor]);

    return null;
};

export default ImagePlugin;
