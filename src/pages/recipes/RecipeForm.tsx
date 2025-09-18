import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import styles from './recipeForm.module.css';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import { setEditorInitialValue } from '../../utils/lexicalUtils';

// 유효성 검사 인터페이스
interface ValidationErrors {
    title?: string;
    ingredients?: string;
    content?: string;
}

const RecipeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, recipeId } = location.state || { type: 'create' };
    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
    const [thumbnailURL, setThumbnailURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 필드 ref들
    const titleRef = useRef<HTMLInputElement>(null);
    const ingredientsRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        post_type: '' as 'recipe',
        title: '',
        category_id: '510d0ed8-281f-4721-bca2-a1be5cecf92b',
        difficulty: 'top' as 'top' | 'middle' | 'bottom',
        cooking_time: 10,
        servings: 1,
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

    // 입력값 변경 시 해당 필드의 에러 제거
    const handleInputChange = (field: keyof ValidationErrors, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        // 유효성 검사 실행
        const validationErrors = validateForm();
        setErrors(validationErrors);

        // 에러가 있으면 제출 중단
        if (Object.keys(validationErrors).length > 0) {
            // 첫 번째 에러 필드에 포커스
            const firstErrorField = Object.keys(validationErrors)[0] as keyof ValidationErrors;

            if (firstErrorField === 'title' && titleRef.current) {
                titleRef.current.focus();
                titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (firstErrorField === 'ingredients' && ingredientsRef.current) {
                ingredientsRef.current.focus();
                ingredientsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (firstErrorField === 'content' && contentRef.current) {
                contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // LexicalEditor의 경우 포커스는 에디터 내부에서 처리
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const recipeData = {
                ...formData,
                post_type: 'recipe' as const,
                user_id: user.id,
            };

            let isSuccess;
            if (type === 'create') {
                isSuccess = await createPost(recipeData);
            } else if (type === 'update' && recipeId) {
                isSuccess = await updatePost({ ...recipeData, id: recipeId });
            }

            if (isSuccess) {
                if (type === 'update' && recipeId) {
                    await saveThumbnailImage(thumbnailURL, recipeId);
                    openModal('SUCCESS', '/recipes/' + recipeId, '레시피 수정을 완료하였습니다.');
                } else if (type === 'create') {
                    await saveThumbnailImage(thumbnailURL, isSuccess.toString());
                    openModal('SUCCESS', '/recipes/' + isSuccess.toString(), '레시피 작성을 완료하였습니다.');
                }
            } else {
                openModal('FAIL', undefined, '레시피 작성을 실패했습니다.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            openModal('FAIL', undefined, '레시피 작성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = useCallback((filename: string | null) => {
        if (filename) {
            const newThumbnailURL = `${filename}`;
            setThumbnailURL(newThumbnailURL);
        }
    }, []);

    // 유효성 검사 함수
    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        // 제목 검사 (필수, 최소 2자)
        if (!formData.title.trim()) {
            newErrors.title = '제목을 입력해주세요.';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = '제목은 최소 2자 이상 입력해주세요.';
        } else if (formData.title.trim().length > 100) {
            newErrors.title = '제목은 최대 100자까지 입력 가능합니다.';
        }

        // 재료 검사 (필수, 최소 2자)
        if (!formData.ingredients.trim()) {
            newErrors.ingredients = '재료를 입력해주세요.';
        } else if (formData.ingredients.trim().length < 2) {
            newErrors.ingredients = '재료는 최소 2자 이상 입력해주세요.';
        }

        // 내용 검사 (필수, 빈 에디터 상태가 아닌지 확인)
        if (!formData.content.trim()) {
            newErrors.content = '레시피 설명을 입력해주세요.';
        } else {
            try {
                const parsed = JSON.parse(formData.content);
                // 빈 에디터 상태인지 확인
                if (parsed.root && parsed.root.children) {
                    const hasContent = parsed.root.children.some((child: any) => {
                        if (child.children && child.children.length > 0) {
                            return child.children.some(
                                (textNode: any) => textNode.text && textNode.text.trim().length > 0
                            );
                        }
                        return false;
                    });

                    if (!hasContent) {
                        newErrors.content = '레시피 설명을 입력해주세요.';
                    }
                }
            } catch {
                // JSON이 아닌 일반 텍스트인 경우
                if (formData.content.trim().length < 5) {
                    newErrors.content = '레시피 설명을 최소 5자 이상 입력해주세요.';
                }
            }
        }

        return newErrors;
    };

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
                    const safeContent = setEditorInitialValue(detail.content);

                    setFormData({
                        post_type: 'recipe' as const,
                        category_id: detail.category_id || '',
                        cooking_time: detail.cooking_time || 0,
                        difficulty: detail.difficulty || 'middle',
                        ingredients: detail.ingredients || '',
                        servings: detail.servings || 0,
                        title: detail.title || '',
                        content: safeContent,
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
    }, [type, recipeId, navigate]);

    return (
        <div className={styles.container}>
            <form className={styles.recipeForm} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.recipeForm__title} htmlFor='title'>
                        제목 : <span className={styles.required}></span>
                    </label>
                    <input
                        ref={titleRef}
                        className={`${styles.recipeForm__title_input} ${errors.title ? styles.error : ''}`}
                        type='text'
                        id='title'
                        value={formData.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                        placeholder='제목을 입력하세요'
                        maxLength={100}
                    />
                    {errors.title && <div className={styles.error_message}>{errors.title}</div>}
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
                        재료 : <span className={styles.required}></span>
                    </label>
                    <input
                        ref={ingredientsRef}
                        className={`${styles.recipeForm__ingredients} ${errors.ingredients ? styles.error : ''}`}
                        type='text'
                        id='ingredients'
                        value={formData.ingredients}
                        onChange={e => handleInputChange('ingredients', e.target.value)}
                        maxLength={50}
                    />
                    {errors.ingredients && <div className={styles.error_message}>{errors.ingredients}</div>}
                </div>

                <div className={styles.content_section}>
                    <label className={styles.content_label}>
                        레시피설명 : <span className={styles.required}></span>
                    </label>
                    <div ref={contentRef} className={`${styles.editor_wrapper} ${errors.content ? styles.error : ''}`}>
                        {isLoading ? (
                            <div className={styles.loadingMessage}>로딩 중...</div>
                        ) : (
                            <LexicalEditor
                                placeholder='게시글 내용을 입력하세요...'
                                className='post-editor'
                                initialValue={formData.content}
                                onChange={editorState => {
                                    handleInputChange('content', editorState);
                                }}
                            />
                        )}
                    </div>
                    {errors.content && <div className={styles.error_message}>{errors.content}</div>}
                </div>

                <div className={styles.thumbnail_container}>
                    <label htmlFor='recipe_thumbnail' className={styles.recipe_thumbnail_label}>
                        <strong>썸네일 등록</strong>(선택사항, 최대 1장)
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

                <button type='submit' className={styles.recipeForm__submit} disabled={isSubmitting}>
                    {isSubmitting ? '처리 중...' : (type !== 'update' ? '작성' : '수정') + ' 완료'}
                </button>
            </form>
        </div>
    );
};

export default RecipeForm;
