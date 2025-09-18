import React, { useCallback, useEffect, useState } from 'react';
import { createPost, fetchPostWithUserNickname, updatePost } from '../../services/supabasePosts.ts';
import useUserStore from '../../stores/useUserStore.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResponsiveFileUpload } from '../../components/ImgUpload/ImgUpload.tsx';
import { getPostThumbnails, saveThumbnailImage } from '../../services/supabaseFiles.ts';
import { useModal } from '../../components/modal/ModalContext.ts';
import CustomSelect from '../../components/SelectBox/SelectBox.tsx';
import { fetchCategories } from '../../services/supabaseCategories.ts';
import type { Tables } from '../../types/supabase.ts';
import LexicalEditor from '../../components/LexicalEditor/LexicalEditor.tsx';
import delbtn from '../../assets/delete_btn_icon.svg';
import { $getRoot, createEditor } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import styles from './recipeForm.module.css';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';

const emptyEditorState =
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const RecipeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, recipeId } = location.state || { type: 'create' };
    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
    const [thumbnailURL, setThumbnailURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        post_type: '' as 'recipe',
        title: '',
        category_id: '',
        difficulty: '' as 'top' | 'middle' | 'bottom',
        cooking_time: 0,
        servings: 0,
        ingredients: '',
        content: '',
    });
    const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
    };
    const { user } = useUserStore();
    const { openModal } = useModal();

    usePageSetup({
        title: '레시피 작성',
        pageName: type === 'create' ? 'recipeWrite' : 'recipeUpdate',
        showBackButton: true,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        const recipeData = {
            ...formData,
            post_type: 'recipe' as const,
            user_id: user.id,
        };

        try {
            if (type === 'create') {
                const postId = await createPost(recipeData);

                if (postId && thumbnailURL) {
                    await saveThumbnailImage(thumbnailURL, postId);
                }

                if (postId) {
                    openModal('SUCCESS', undefined, '레시피 저장을 완료하였습니다.');
                } else {
                    openModal('FAIL', undefined, '레시피 저장을 실패했습니다.');
                }
            } else if (type === 'update' && recipeId) {
                const isSuccess = await updatePost({ ...recipeData, id: recipeId });

                if (isSuccess && thumbnailURL) {
                    await saveThumbnailImage(thumbnailURL, recipeId);
                }

                if (isSuccess) {
                    openModal('SUCCESS', undefined, '레시피 수정을 완료하였습니다.');
                } else {
                    openModal('FAIL', undefined, '레시피 수정을 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('레시피 저장 실패:', error);
            openModal('FAIL', undefined, `레시피 ${type === 'create' ? '저장' : '수정'} 중 오류가 발생했습니다.`);
        }
    };

    const handleFileUpload = useCallback((filename: string | null) => {
        if (filename) {
            const newThumbnailURL = `${filename}`;
            setThumbnailURL(newThumbnailURL);
        }
    }, []);

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
        } catch (error) {
            try {
                // 💡 올바른 Lexical API를 사용하는 로직
                const editor = createEditor(); // 임시 에디터 인스턴스 생성
                editor.update(() => {
                    const root = $getRoot(); // 💡 Lexical의 루트 노드를 가져옵니다.
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(content, 'text/html');
                    const nodes = $generateNodesFromDOM(editor, dom);

                    root.clear(); // 💡 Lexical 노드의 clear() 메서드 사용
                    nodes.forEach(node => root.append(node)); // 💡 Lexical 노드의 append() 메서드 사용
                });

                const parsedEditorState = editor.getEditorState();
                console.error(error);
                return JSON.stringify(parsedEditorState.toJSON());
            } catch (error) {
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
                console.error(error);
                return JSON.stringify(newLexicalState);
            }
        }
    }, []);

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (type === 'create') {
                setIsLoading(false);
                return;
            }
            if (!recipeId) {
                navigate('/');
                return;
            }

            try {
                const [detail, thumbnail] = await Promise.all([
                    fetchPostWithUserNickname(recipeId),
                    getPostThumbnails(recipeId),
                ]);

                if (detail) {
                    const parsedContent = getValidatedContent(detail.content);
                    setFormData({
                        post_type: 'recipe' as const,
                        category_id: detail.category_id || '',
                        cooking_time: detail.cooking_time || 0,
                        difficulty: detail.difficulty || 'middle',
                        ingredients: detail.ingredients || '',
                        servings: detail.servings || 0,
                        title: detail.title || '',
                        content: parsedContent,
                    });
                    if (thumbnail?.file_type === 'thumbnail') {
                        setThumbnailURL(thumbnail.filename);
                    }
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [type, recipeId, navigate, getValidatedContent]);

    return (
        <div className={styles.container}>
            <form className={styles.recipeForm} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.recipeForm__title} htmlFor='title'>
                        제목:
                    </label>
                    <input
                        className={styles.recipeForm__title_input}
                        type='text'
                        id='title'
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className={styles.recipe_select_section}>
                    <ul>
                        <li className={styles.recipe_select_group}>
                            <label htmlFor='recipe_category' className={styles.recipe_select_label}>
                                카테고리 :
                            </label>
                            <div className={styles.recipe_select_input}>
                                <CustomSelect
                                    value={formData.category_id}
                                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                    options={categories.map(category => ({ value: category.id, label: category.name }))}
                                />
                            </div>
                        </li>
                        <li className={styles.recipe_select_group}>
                            <label htmlFor='recipe_category' className={styles.recipe_select_label}>
                                난이도 :
                            </label>
                            <div className={styles.recipe_select_input}>
                                <CustomSelect
                                    value={formData.difficulty}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            difficulty: e.target.value as 'top' | 'middle' | 'bottom',
                                        })
                                    }
                                    options={[
                                        { value: 'top', label: '상' },
                                        { value: 'middle', label: '중' },
                                        { value: 'bottom', label: '하' },
                                    ]}
                                />
                            </div>
                        </li>
                        <li className={styles.recipe_select_group}>
                            <label htmlFor='recipe_category' className={styles.recipe_select_label}>
                                요리시간 :
                            </label>
                            <div className={styles.recipe_select_input}>
                                <CustomSelect
                                    value={String(formData.cooking_time)}
                                    onChange={e => setFormData({ ...formData, cooking_time: Number(e.target.value) })}
                                    options={[
                                        { value: '10', label: '10분' },
                                        { value: '20', label: '20분' },
                                        { value: '30', label: '30분' },
                                        { value: '40', label: '40분' },
                                        { value: '50', label: '50분' },
                                        { value: '60', label: '60분' },
                                    ]}
                                />
                            </div>
                        </li>
                        <li className={styles.recipe_select_group}>
                            <label htmlFor='recipe_category' className={styles.recipe_select_label}>
                                인원 :
                            </label>
                            <div className={styles.recipe_select_input}>
                                <CustomSelect
                                    value={String(formData.servings)}
                                    onChange={e => setFormData({ ...formData, servings: Number(e.target.value) })}
                                    options={[
                                        { value: '1', label: '1인분' },
                                        { value: '2', label: '2인분' },
                                        { value: '3', label: '3인분' },
                                        { value: '4', label: '4인분' },
                                    ]}
                                />
                            </div>
                        </li>
                    </ul>
                </div>

                <div>
                    <label htmlFor='ingredients' className={styles.ingredients__title}>
                        재료 :
                    </label>
                    <input
                        className={styles.recipeForm__ingredients}
                        type='text'
                        id='ingredients'
                        value={formData.ingredients}
                        onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                    />
                </div>

                <div className={styles.content_section}>
                    <label className={styles.content_label}>레시피설명 :</label>
                    <div className={styles.editor_wrapper}>
                        {isLoading ? (
                            <div className={styles.loadingMessage}></div>
                        ) : (
                            <LexicalEditor
                                placeholder='게시글 내용을 입력하세요...'
                                className='post-editor'
                                initialValue={formData.content}
                                onChange={editorState => setFormData({ ...formData, content: editorState })}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.thumbnail_container}>
                    <label htmlFor='share_thumbnail' className={styles.recipe_thumbnail_label}>
                        <strong>썸네일 등록</strong>(최대 1장)
                    </label>
                    <div className={styles.thumbnail_wrapper}>
                        <ResponsiveFileUpload postId={recipeId} onFileUpload={handleFileUpload} />
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

                <button type='submit' className={styles.recipeForm__submit}>
                    {type !== 'update' ? '작성' : '수정'} 완료
                </button>
            </form>
        </div>
    );
};

export default RecipeForm;
