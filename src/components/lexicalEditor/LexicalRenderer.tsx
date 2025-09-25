import React from 'react';
import LinkPreview from './components/LinkPreview';
import styles from './lexicalRenderer.module.css';

// Lexical 출력용 노드 타입 정의 (라이브러리 타입과 구분하기 위해 Render prefix 사용)
interface BaseRenderNode {
    type: string;
    version?: number;
    children?: RenderNode[];
}

interface RenderTextNode extends BaseRenderNode {
    type: 'text';
    text: string;
    style?: string;
    format?: number | string; // format은 숫자 또는 문자열 가능
    mode?: string;
    detail?: number;
}

interface RenderLinkNode extends BaseRenderNode {
    type: 'link';
    url: string;
    target?: string | null;
    rel?: string;
    title?: string | null;
    children: RenderNode[];
}

interface RenderImageNode extends BaseRenderNode {
    type: 'image';
    src: string;
    altText?: string;
}

interface RenderYouTubeNode extends BaseRenderNode {
    type: 'youtube';
    videoId: string;
}

interface RenderAutoLinkNode extends BaseRenderNode {
    type: 'autolink';
    url: string;
    children: RenderNode[];
}

interface RenderListNode extends BaseRenderNode {
    type: 'list';
    listType: 'number' | 'bullet';
    start?: number;
    children: RenderListItemNode[];
}

interface RenderListItemNode extends BaseRenderNode {
    type: 'listitem';
    value: number;
    children: RenderNode[];
}

interface RenderParagraphNode extends BaseRenderNode {
    type: 'paragraph';
    format?: string | number; // format은 숫자 또는 문자열 가능
    textStyle?: string;
    children: RenderNode[];
}

interface RenderRootNode extends BaseRenderNode {
    type: 'root';
    children: RenderNode[];
}

// 모든 가능한 노드 타입의 유니온
type RenderNode =
    | RenderTextNode
    | RenderLinkNode
    | RenderImageNode
    | RenderYouTubeNode
    | RenderAutoLinkNode
    | RenderListNode
    | RenderListItemNode
    | RenderParagraphNode
    | RenderRootNode
    | BaseRenderNode;

// 전체 Lexical 데이터 구조
interface LexicalRenderData {
    root: RenderRootNode;
}

interface LexicalRendererProps {
    content: string | object | LexicalRenderData;
    className?: string;
}

const LexicalRenderer: React.FC<LexicalRendererProps> = ({ content, className = '' }) => {
    // 타입 가드 함수들
    const isTextNode = (node: RenderNode): node is RenderTextNode => {
        return node.type === 'text';
    };

    const isParagraphNode = (node: RenderNode): node is RenderParagraphNode => {
        return node.type === 'paragraph';
    };

    // 빈 문단인지 확인하는 함수
    const isEmptyParagraph = (node: RenderNode): boolean => {
        if (!isParagraphNode(node)) return false;

        if (!node.children || node.children.length === 0) return true;

        // 모든 자식이 빈 텍스트 노드인지 확인
        return node.children.every(child => isTextNode(child) && (!child.text || child.text.trim() === ''));
    };

    // Lexical JSON을 HTML로 변환하는 재귀 함수
    const renderNode = (node: RenderNode | any, index: number = 0): React.ReactNode => {
        if (!node || typeof node !== 'object') return null;

        const { type } = node;

        // 각 노드 타입에 따라 안전하게 속성 접근
        const children = node.children || [];
        const text = isTextNode(node) ? node.text : '';
        const style = 'style' in node ? node.style : undefined;
        const url = 'url' in node ? node.url : '';
        const src = 'src' in node ? node.src : '';
        const videoId = 'videoId' in node ? node.videoId : '';
        const format = 'format' in node ? node.format : undefined;
        const textStyle = 'textStyle' in node ? node.textStyle : undefined;

        // format에서 정렬 정보 추출 (문자열인 경우만 처리)
        const getAlignmentClass = (format: string | number | undefined) => {
            if (!format || typeof format !== 'string') return '';
            if (format.includes('left')) return styles['text-left'];
            if (format.includes('right')) return styles['text-right'];
            if (format.includes('center')) return styles['text-center'];
            if (format.includes('justify')) return styles['text-justify'];
            return '';
        };

        // textStyle과 style을 합쳐서 인라인 스타일 객체 생성
        const getInlineStyles = (style?: string, textStyle?: string, format?: number) => {
            const inlineStyles: { [key: string]: string } = {};

            // 기존 style 처리 (color: #b62525 형태)
            if (style) {
                const styleEntries = style.split(';').filter(Boolean);
                styleEntries.forEach(entry => {
                    const [property, value] = entry.split(':').map(s => s.trim());
                    if (property && value) {
                        const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                        inlineStyles[camelCaseProperty] = value;
                    }
                });
            }

            // textStyle 처리 (font-size: 12px 형태)
            if (textStyle) {
                const styleEntries = textStyle.split(';').filter(Boolean);
                styleEntries.forEach(entry => {
                    const [property, value] = entry.split(':').map(s => s.trim());
                    if (property && value) {
                        const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                        inlineStyles[camelCaseProperty] = value;
                    }
                });
            }

            // format 비트마스크 처리 (Lexical 텍스트 스타일)
            if (typeof format === 'number' && format > 0) {
                // 1 = bold, 2 = italic, 4 = underline, 8 = strikethrough, 16 = code
                if (format & 1) inlineStyles.fontWeight = 'bold';
                if (format & 2) inlineStyles.fontStyle = 'italic';
                if (format & 4) inlineStyles.textDecoration = 'underline';
                if (format & 8)
                    inlineStyles.textDecoration = inlineStyles.textDecoration
                        ? `${inlineStyles.textDecoration} line-through`
                        : 'line-through';
                if (format & 16) {
                    inlineStyles.fontFamily = 'monospace';
                    inlineStyles.backgroundColor = '#f1f1f1';
                    inlineStyles.padding = '2px 4px';
                    inlineStyles.borderRadius = '3px';
                }
            }

            return Object.keys(inlineStyles).length > 0 ? (inlineStyles as React.CSSProperties) : undefined;
        };

        const alignmentClass = getAlignmentClass(format);
        const inlineStyles = getInlineStyles(style, textStyle, typeof format === 'number' ? format : undefined);

        switch (type) {
            case 'root':
                return (
                    <div key={index} className={styles['lexical-root']} style={inlineStyles}>
                        {children.map((child: RenderNode, i: number) => renderNode(child, i))}
                    </div>
                );

            case 'listitem':
                return (
                    <li
                        key={index}
                        className={`${styles['content-list-item']} ${alignmentClass}`.trim()}
                        style={inlineStyles}
                    >
                        {children.map((child: RenderNode, i: number) => renderNode(child, i))}
                    </li>
                );

            case 'text':
                return (
                    <span key={index} style={inlineStyles} className={alignmentClass}>
                        {text}
                    </span>
                );

            case 'paragraph':
                // 빈 문단도 공간을 차지하도록 처리
                const isEmpty = isEmptyParagraph(node);

                return (
                    <p
                        key={index}
                        className={`${styles['content-paragraph']} ${alignmentClass}`.trim()}
                        style={{
                            ...inlineStyles,
                            // 빈 문단에도 최소 높이 제공
                            minHeight: isEmpty ? '1.2em' : undefined,
                        }}
                    >
                        {isEmpty ? (
                            // 빈 문단의 경우 &nbsp; 또는 빈 공간 추가
                            <span>&nbsp;</span>
                        ) : (
                            children.map((child: RenderNode, i: number) => renderNode(child, i))
                        )}
                    </p>
                );

            case 'link':
                return (
                    <a
                        key={index}
                        href={url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={`${styles['content-link']} ${alignmentClass}`.trim()}
                        style={inlineStyles}
                    >
                        {children.map((child: RenderNode, i: number) => renderNode(child, i))}
                    </a>
                );

            case 'autolink':
                return (
                    <React.Fragment key={index}>
                        <a
                            href={url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={`${styles['content-link']} ${alignmentClass}`.trim()}
                            style={inlineStyles}
                        >
                            {children.map((child: RenderNode, i: number) => renderNode(child, i))}
                        </a>
                        <br />
                        <LinkPreview url={url} />
                    </React.Fragment>
                );

            case 'image':
                return (
                    <img
                        key={index}
                        src={src}
                        alt=''
                        className={`${styles['content-image']} ${alignmentClass}`.trim()}
                        style={inlineStyles}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                );

            case 'youtube':
                return (
                    <div key={index} style={{ margin: '20px 0', ...inlineStyles }} className={alignmentClass}>
                        <iframe
                            width='100%'
                            height='315'
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title='YouTube video player'
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                            style={{
                                maxWidth: '560px',
                                borderRadius: '8px',
                            }}
                        />
                    </div>
                );

            default:
                return children.length > 0
                    ? children.map((child: RenderNode, i: number) => renderNode(child, i))
                    : null;
        }
    };

    // content가 문자열인지 객체인지 확인하고 적절히 렌더링
    const renderContent = () => {
        if (!content) return null;

        // content가 이미 객체라면 바로 렌더링
        if (typeof content === 'object') {
            const nodeToRender = 'root' in content ? content.root : content;
            return renderNode(nodeToRender);
        }

        // content가 문자열이라면 JSON 파싱 시도
        if (typeof content === 'string') {
            // 빈 문자열이나 공백만 있는 경우
            if (!content.trim()) return null;

            // JSON 형태인지 확인 ('{' 또는 '[' 로 시작하는지 체크)
            const trimmedContent = content.trim();
            if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
                try {
                    const parsedContent = JSON.parse(content);
                    const nodeToRender = parsedContent.root || parsedContent;
                    return renderNode(nodeToRender);
                } catch (error) {
                    console.error('Failed to parse Lexical JSON:', error);
                    console.error('Content:', content);
                    return (
                        <div className={styles['plain-text']}>
                            <span>콘텐츠를 불러올 수 없습니다.</span>
                        </div>
                    );
                }
            } else {
                // JSON이 아닌 일반 텍스트인 경우 그대로 표시
                return (
                    <div className={styles['plain-text']}>
                        <span>{content}</span>
                    </div>
                );
            }
        }

        return null;
    };

    return <div className={`${styles['lexical-renderer']} ${className}`.trim()}>{renderContent()}</div>;
};

export default LexicalRenderer;
