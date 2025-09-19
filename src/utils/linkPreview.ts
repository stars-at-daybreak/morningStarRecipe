export interface LinkMetadata {
    title?: string;
    description?: string;
    image?: string;
    url: string;
    siteName?: string;
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata | null> {
    try {
        // 여러 CORS 프록시 서비스를 순차적으로 시도
        const proxyUrls = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`
        ];

        let response: Response | null = null;
        let lastError: Error | null = null;

        for (const proxyUrl of proxyUrls) {
            try {
                response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/html, */*',
                    },
                    signal: AbortSignal.timeout(3000) // 3초 타임아웃
                });

                if (response.ok) {
                    break;
                }
            } catch (error) {
                lastError = error as Error;
                continue;
            }
        }

        if (!response || !response.ok) {
            throw lastError || new Error('All proxy services failed');
        }

        let html: string;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            try {
                const data = await response.json();
                html = data.contents || data;
            } catch {
                // JSON 파싱 실패시 텍스트로 처리
                html = await response.text();
            }
        } else {
            // JSON이 아닌 경우 직접 HTML로 처리
            html = await response.text();
        }

        // DOM 파서를 사용하여 HTML 분석
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Open Graph 메타 태그 파싱
        const getMetaContent = (property: string): string | undefined => {
            const ogMeta = doc.querySelector(`meta[property="${property}"]`);
            if (ogMeta) return ogMeta.getAttribute('content') || undefined;

            const nameMeta = doc.querySelector(`meta[name="${property}"]`);
            if (nameMeta) return nameMeta.getAttribute('content') || undefined;

            return undefined;
        };

        const title = getMetaContent('og:title') ||
                     getMetaContent('twitter:title') ||
                     doc.querySelector('title')?.textContent ||
                     undefined;

        const description = getMetaContent('og:description') ||
                           getMetaContent('twitter:description') ||
                           getMetaContent('description') ||
                           undefined;

        const image = getMetaContent('og:image') ||
                     getMetaContent('twitter:image') ||
                     undefined;

        const siteName = getMetaContent('og:site_name') ||
                        new URL(url).hostname;

        return {
            title: title?.trim(),
            description: description?.trim(),
            image,
            url,
            siteName
        };

    } catch (error) {
        // AbortError는 정상적인 타임아웃이므로 로그 출력하지 않음
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Error fetching link metadata:', error);
        }
        return {
            url,
            siteName: new URL(url).hostname
        };
    }
}