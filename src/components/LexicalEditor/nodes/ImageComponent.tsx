import type { NodeKey } from 'lexical';
import React, { Suspense, useCallback, useRef } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $getSelection, $isNodeSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, KEY_DELETE_COMMAND, KEY_BACKSPACE_COMMAND } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { $isImageNode } from './ImageNode';

interface ImageComponentProps {
  altText: string;
  height: 'inherit' | number;
  maxWidth: number;
  nodeKey: NodeKey;
  src: string;
  width: 'inherit' | number;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected],
  );

  React.useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  return (
    <Suspense fallback={null}>
      <div draggable={false} className={`image-wrapper ${isSelected ? 'focused' : ''}`}>
        <img
          className="image"
          src={src}
          alt={altText}
          ref={imageRef}
          style={{
            height,
            maxWidth,
            width,
          }}
          draggable="false"
        />
        {isSelected && (
          <div className="image-controls">
            <button
              className="image-delete-button"
              onClick={() => {
                editor.update(() => {
                  const node = $getNodeByKey(nodeKey);
                  if ($isImageNode(node)) {
                    node.remove();
                  }
                });
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default ImageComponent;