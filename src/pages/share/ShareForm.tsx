// ShareForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPost, updatePost } from '../../services/supabasePosts';
import useUserStore from '../../stores/useUserStore';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ShareForm.module.css';
import { usePageSetup } from '../../hooks/usePageSetup';
import { fetchPostWithUserNickname } from '../../services/supabasePosts';
import CustomSelect from '../../components/SelectBox/SelectBox';
import { ResponsiveFileUpload } from '../../components/ImgUpload/ImgUpload';
import { getPostThumbnails } from '../../services/supabaseFiles';
import delbtn from '../../assets/delete_btn_icon.svg';
import { saveThumbnailImage } from '../../services/supabaseFiles';
import LexicalEditor from '../../components/LexicalEditor/LexicalEditor';
import '../../components/LexicalEditor/LexicalEditor.css';
import { createEditor, $getRoot } from 'lexical'; // 💡 $getRoot 임포트 추가
import { $generateNodesFromDOM } from '@lexical/html';

// 비어있는 Lexical Editor 상태를 나타내는 유효한 JSON 문자열
const emptyEditorState =
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const ShareForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, shareId } = location.state || { type: 'create' };

    const [formData, setFormData] = useState({
        post_type: 'share' as const,
        title: '',
        share_status: 'available' as 'available' | 'reserved' | 'completed' | 'cancelled',
        pickup_location: '서울',
        content: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useUserStore();
    const [thumbnailURL, setThumbnailURL] = useState('');

    const getValidatedContent = useCallback((content: string | null): string => {
        if (!content) {
            return emptyEditorState;
        }

        try {
            const parsed = JSON.parse(content);
            if (parsed && typeof parsed === 'object' && 'root' in parsed) {
                return content;
            } else {
                throw new Error('Invalid Lexical JSON structure.');
            }
        } catch (e) {
            console.error('Content is not a valid Lexical JSON state. Attempting HTML conversion.', e);

            try {
                // 💡 올바른 Lexical API를 사용하는 로직
                const editor = createEditor(); // 임시 에디터 인스턴스 생성
                let parsedEditorState;
                editor.update(() => {
                    const root = $getRoot(); // 💡 Lexical의 루트 노드를 가져옵니다.
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(content, 'text/html');
                    const nodes = $generateNodesFromDOM(editor, dom);

                    root.clear(); // 💡 Lexical 노드의 clear() 메서드 사용
                    nodes.forEach(node => root.append(node)); // 💡 Lexical 노드의 append() 메서드 사용
                });
                parsedEditorState = editor.getEditorState();
                return JSON.stringify(parsedEditorState.toJSON());
            } catch (htmlError) {
                console.error('HTML conversion failed. Falling back to plain text.', htmlError);
                const textContent = content.replace(/<[^>]*>/g, '').trim();
                const newLexicalState = {
                    root: {
                        children: [
                            {
                                children: [
                                    {
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        text: textContent,
                                        type: 'text',
                                        version: 1,
                                    },
                                ],
                                direction: 'ltr',
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
                };
                return JSON.stringify(newLexicalState);
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (type === 'create') {
                setIsLoading(false);
                return;
            }
            if (!shareId) {
                navigate('/');
                return;
            }

            try {
                const [detail, thumbnail] = await Promise.all([
                    fetchPostWithUserNickname(shareId),
                    getPostThumbnails(shareId),
                ]);

                if (detail) {
                    const parsedContent = getValidatedContent(detail.content);
                    setFormData({
                        post_type: 'share' as const,
                        title: detail.title || '',
                        share_status: detail.share_status || 'available',
                        pickup_location: detail.pickup_location || '서울',
                        content: parsedContent,
                    });
                    if (thumbnail?.file_type === 'thumbnail') {
                        setThumbnailURL(thumbnail.filename);
                    }
                }
            } catch (error) {
                console.error('Failed to load data:', error);
                alert('데이터를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [type, shareId, navigate, getValidatedContent]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }

        const shareData = {
            ...formData,
            post_type: 'share' as const,
            user_id: user.id,
        };

        let isSuccess;
        if (type === 'create') {
            isSuccess = await createPost(shareData);
        } else if (type === 'update' && shareId) {
            isSuccess = await updatePost({ ...shareData, id: shareId });
        }

        if (isSuccess) {
            alert('게시글 저장을 완료하였습니다.');
            if (type === 'update' && shareId) {
                await saveThumbnailImage(thumbnailURL, shareId);
            } else if (type === 'create') {
                await saveThumbnailImage(thumbnailURL, isSuccess.toString());
            }
        }
    };

    const handleFileUpload = useCallback((filename: string | null) => {
        if (filename) {
            const newThumbnailURL = `${filename}`;
            setThumbnailURL(newThumbnailURL);
        }
    }, []);

    usePageSetup({
        title: '모두의 나눔',
        pageName: type === 'create' ? 'shareWrite' : 'shareUpdate',
        showBackButton: true,
    });

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.shareForm}>
                <section>
                    <label htmlFor='title' className={styles.shareForm__title}>
                        제목:
                    </label>
                    <input
                        type='text'
                        id='title'
                        value={formData.title}
                        className={styles.shareForm__title_input}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                </section>
                <section className={styles.share_status_section}>
                    <label htmlFor='share_status' className={styles.share_status_label}>
                        나눔상태 :
                    </label>
                    <div className={styles.share_status_select}>
                        <CustomSelect
                            value={formData.share_status}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    share_status: e.target.value as
                                        | 'available'
                                        | 'reserved'
                                        | 'completed'
                                        | 'cancelled',
                                }))
                            }
                            options={[
                                { value: 'available', label: '나눔중' },
                                { value: 'reserved', label: '예약중' },
                                { value: 'completed', label: '나눔완료' },
                                { value: 'cancelled', label: '나눔취소' },
                            ]}
                        />
                    </div>
                </section>
                <section>
                    <label htmlFor='pickup_location' className={styles.shareLocation__title}>
                        나눔 위치 :
                    </label>
                    <input
                        type='text'
                        id='pickup_location'
                        placeholder='나눔할 장소를 입력하세요'
                        value={formData.pickup_location}
                        className={styles.shareLocation__title_input}
                        onChange={e => setFormData(prev => ({ ...prev, pickup_location: e.target.value }))}
                    />
                </section>

                <div className={styles.content_section}>
                    <label className={styles.content_label}>나눔 설명 :</label>
                    <div className={styles.editor_wrapper}>
                        {isLoading ? (
                            <div className={styles.loadingMessage}></div>
                        ) : (
                            <LexicalEditor
                                placeholder='게시글 내용을 입력하세요...'
                                className='post-editor'
                                initialValue={formData.content}
                                onChange={editorState => setFormData(prev => ({ ...prev, content: editorState }))}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.thumbnail_container}>
                    <label htmlFor='share_thumbnail' className={styles.share_thumbnail_label}>
                        <strong>썸네일 등록</strong>(최대 1장)
                    </label>
                    <div className={styles.thumbnail_wrapper}>
                        <ResponsiveFileUpload postId={shareId} onFileUpload={handleFileUpload} />
                        {thumbnailURL && (
                            <div className={styles.thumbnail_preview}>
                                <button
                                    type='button'
                                    onClick={() => setThumbnailURL('')}
                                    className={styles.thumbnail_delete_button}
                                >
                                    <img src={delbtn} alt='삭제 버튼' className={styles.thumbnail_delete_img} />
                                </button>
                                <img
                                    src={import.meta.env.VITE_API_BASE_URL + '/' + thumbnailURL}
                                    alt='썸네일'
                                    className={styles.thumbnail_img}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <button type='submit' className={styles.shareForm__submit}>
                    {type !== 'update' ? '작성' : '수정'} 완료
                </button>
            </form>
        </div>
    );
};

export default ShareForm;
