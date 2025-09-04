// Enum 타입들
export type PostTypeEnum = 'recipe' | 'share';
export type DifficultyEnum = 'top' | 'middle' | 'bottom';
export type ItemConditionEnum = 'new' | 'like_new' | 'good' | 'fair' | 'poor';
export type ShareStatusEnum = 'available' | 'reserved' | 'completed' | 'cancelled';
export type ImageTypeEnum = 'share' | 'recipe' | 'profile' | 'etc';
export type VoteTypeEnum = 'like' | 'dislike';

// 댓글 관련 인터페이스
export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    is_comment_active: boolean;
    like_count: number;
    created_at: string;
    updated_at: string;
}

// 이미지 관련 인터페이스
export interface Image {
    id: number;
    post_id?: number;
    post_type: ImageTypeEnum;
    image_url: string;
    alt_text?: string;
    file_size?: number;
    mime_type?: string;
    original_filename?: string;
    created_at: string;
}

// 게시글 공통 필드
interface BasePost {
    id: number;
    category_id: number;
    user_id: number;
    title: string;
    content: string;
    is_user_active: boolean;
    is_post_active: boolean;
    created_at: string;
    updated_at: string;
}

// Recipe 타입 게시글 (나눔 게시글)
export interface RecipePost extends BasePost {
    post_type: 'recipe';
    item_condition: ItemConditionEnum;
    pickup_location: string;
    share_status: ShareStatusEnum;
    // recipe 타입에서는 이 필드들을 사용하지 않음
    difficulty?: never;
    cooking_time?: never;
    ingredients?: never;
    servings?: never;
    view_count?: never;
    like_count?: never;
    dislike_count?: never;
}

// Share 타입 게시글 (레시피 게시글)
export interface SharePost extends BasePost {
    post_type: 'share';
    difficulty: DifficultyEnum;
    cooking_time: number;
    ingredients: string;
    servings: number;
    view_count: number;
    like_count: number;
    dislike_count: number;
    // share 타입에서는 이 필드들을 사용하지 않음
    item_condition?: never;
    pickup_location?: never;
    share_status?: never;
}

// 모든 게시글 타입의 유니온
export type Post = RecipePost | SharePost;

// 카테고리 관련 인터페이스
export interface Category {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// 댓글 좋아요 관련 인터페이스
export interface CommentLike {
    id: number;
    comment_id: number;
    user_id: number;
    created_at: string;
}

// 게시글 북마크 관련 인터페이스
export interface PostBookmark {
    id: number;
    post_id: number;
    user_id: number;
    created_at: string;
}

// 게시글 투표 관련 인터페이스
export interface PostVote {
    id: number;
    post_id: number;
    user_id: number;
    vote_type: VoteTypeEnum;
    created_at: string;
}

// 테이블 이름 타입
export type TableName =
    | 'comments'
    | 'images'
    | 'posts'
    | 'categories'
    | 'comment_likes'
    | 'post_bookmarks'
    | 'post_votes';

// 모든 데이터 타입의 유니온
export type DatabaseRecord = Comment | Image | Post | Category | CommentLike | PostBookmark | PostVote;

// 조회용 타입들
export type SelectComment = Pick<Comment, 'id' | 'post_id' | 'user_id' | 'content' | 'like_count' | 'created_at'>;
export type SelectImage = Pick<Image, 'id' | 'post_id' | 'image_url' | 'alt_text' | 'created_at'>;
export type SelectCategory = Pick<Category, 'id' | 'name' | 'description' | 'is_active'>;
export type SelectCommentLike = Pick<CommentLike, 'id' | 'comment_id' | 'user_id' | 'created_at'>;
export type SelectPostBookmark = Pick<PostBookmark, 'id' | 'post_id' | 'user_id' | 'created_at'>;
export type SelectPostVote = Pick<PostVote, 'id' | 'post_id' | 'user_id' | 'vote_type' | 'created_at'>;

// Recipe 게시글 조회용 (나눔 게시글)
export type SelectRecipePost = Pick<
    RecipePost,
    | 'id'
    | 'category_id'
    | 'user_id'
    | 'post_type'
    | 'title'
    | 'content'
    | 'item_condition'
    | 'pickup_location'
    | 'share_status'
    | 'is_user_active'
    | 'is_post_active'
    | 'created_at'
    | 'updated_at'
>;

// Share 게시글 조회용 (레시피 게시글)
export type SelectSharePost = Pick<
    SharePost,
    | 'id'
    | 'category_id'
    | 'user_id'
    | 'post_type'
    | 'title'
    | 'content'
    | 'difficulty'
    | 'cooking_time'
    | 'ingredients'
    | 'servings'
    | 'view_count'
    | 'like_count'
    | 'dislike_count'
    | 'is_user_active'
    | 'is_post_active'
    | 'created_at'
    | 'updated_at'
>;

// post_type에 따른 조회 타입 유니온
export type SelectPost = SelectRecipePost | SelectSharePost;

// 리스트 조회용 (간단한 정보만)
export type SelectRecipePostList = Pick<RecipePost, 'id' | 'title' | 'item_condition' | 'share_status' | 'created_at'>;

export type SelectSharePostList = Pick<
    SharePost,
    'id' | 'title' | 'difficulty' | 'cooking_time' | 'like_count' | 'view_count' | 'created_at'
>;

export type SelectPostList = SelectRecipePostList | SelectSharePostList;
