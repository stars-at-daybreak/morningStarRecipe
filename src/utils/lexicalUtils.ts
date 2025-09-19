import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

// 일반 텍스트를 Lexical JSON으로 변환하는 함수
export const convertPlainTextToLexicalJSON = (text: string): string => {
    if (!text || !text.trim()) {
        return JSON.stringify({
            root: {
                children: [
                    {
                        children: [],
                        direction: null,
                        format: '',
                        indent: 0,
                        type: 'paragraph',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1,
            },
        });
    }

    // 줄바꿈을 기준으로 단락 분리
    const paragraphs = text.split('\n').filter(line => line.trim());

    const children = paragraphs.map(paragraph => ({
        children: [
            {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: paragraph,
                type: 'text',
                version: 1,
            },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
    }));

    // 빈 단락이 없으면 기본 빈 단락 추가
    if (children.length === 0) {
        children.push({
            children: [],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
        });
    }

    return JSON.stringify({
        root: {
            children,
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
        },
    });
};

// Lexical JSON이 유효한지 검사하는 함수
export const isValidLexicalJSON = (jsonString: string): boolean => {
    try {
        const parsed = JSON.parse(jsonString);
        return parsed && parsed.root && Array.isArray(parsed.root.children);
    } catch {
        return false;
    }
};

// 에디터에 안전하게 초기값을 설정하는 함수
export const setEditorInitialValue = (content: string | undefined | null): string => {
    // 빈 값이거나 null인 경우 기본 빈 에디터 상태 반환
    if (!content || !content.trim()) {
        return convertPlainTextToLexicalJSON('');
    }

    const trimmedContent = content.trim();

    // JSON 형태인지 확인
    if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
        if (isValidLexicalJSON(trimmedContent)) {
            return trimmedContent;
        } else {
            console.warn('Invalid Lexical JSON detected, converting to plain text');
            return convertPlainTextToLexicalJSON(content);
        }
    } else {
        // 일반 텍스트인 경우 Lexical JSON으로 변환
        return convertPlainTextToLexicalJSON(content);
    }
};

// 에디터에서 일반 텍스트를 안전하게 설정하는 함수 (editor.update 내부에서 사용)
export const insertPlainTextSafely = (text: string) => {
    const root = $getRoot();
    root.clear(); // 기존 내용 제거

    if (!text || !text.trim()) {
        // 빈 텍스트인 경우 빈 단락 생성
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        return;
    }

    // 줄바꿈을 기준으로 단락 분리해서 추가
    const lines = text.split('\n');

    lines.forEach((line, index) => {
        const paragraph = $createParagraphNode();
        if (line.trim()) {
            const textNode = $createTextNode(line);
            paragraph.append(textNode);
        }
        root.append(paragraph);
    });

    // 마지막에 빈 단락이 없으면 추가 (커서 위치를 위해)
    if (lines[lines.length - 1].trim()) {
        const emptyParagraph = $createParagraphNode();
        root.append(emptyParagraph);
    }
};

// AutoLink 매처 함수들
export const MATCHERS = [
    (text: string) => {
        // URL 패턴 매칭 함수들
        const URL_REGEX =
            /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

        const match = URL_REGEX.exec(text);
        if (match === null) {
            return null;
        }
        const fullMatch = match[0];
        return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
            attributes: { rel: 'noopener', target: '_blank' },
        };
    },
    (text: string) => {
        const EMAIL_REGEX =
            /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

        const match = EMAIL_REGEX.exec(text);
        if (match === null) {
            return null;
        }
        const fullMatch = match[0];
        return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: `mailto:${fullMatch}`,
        };
    },
];
