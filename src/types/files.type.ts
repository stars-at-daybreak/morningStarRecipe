export type FileType = 'profile' | 'thumbnail';

export interface FileRecord {
    id: string;
    filename: string;
    file_type: FileType;
    post_id?: string;
    user_id: string;
    created_at: string;
}

export interface SaveFileParams {
    filename: string;
    fileType: FileType;
    postId?: string;
}
