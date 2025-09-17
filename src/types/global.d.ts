// src/types/global.d.ts
declare namespace JSX {
    type Element = any; // React 없이 Lexical만 사용 시
    interface IntrinsicElements {
        div: any;
        span: any;
        img: any;
        button: any;
    }
}
