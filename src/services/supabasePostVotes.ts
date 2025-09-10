import supabase from './supabaseClient.ts';
import type { VoteType } from '../types/postVotes.type.ts';

export const handlePostVote = async (postId: string, userId: string, voteType: VoteType): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('post_votes')
            .select('vote_type')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            if (data.vote_type === voteType) {
                await cancelVote(postId, userId, voteType);
            } else {
                await changeVote(postId, userId, data.vote_type, voteType);
            }
        } else {
            await createVote(postId, userId, voteType);
        }

        return true;
    } catch (error) {
        console.error('투표 처리 중 오류 발생:', error);
        return false;
    }
};

const createVote = async (postId: string, userId: string, voteType: VoteType) => {
    const { error: createError } = await supabase.from('post_votes').insert({
        post_id: postId,
        user_id: userId,
        vote_type: voteType,
    });

    if (createError) throw createError;

    const countField = voteType === 'like' ? 'like_count' : 'dislike_count';
    const { error: updateError } = await supabase.rpc('increment_post_count', {
        post_id: postId,
        count_type: countField,
        increment_value: 1,
    });

    if (updateError) throw updateError;
};

const cancelVote = async (postId: string, userId: string, voteType: VoteType) => {
    const { error: deleteError } = await supabase
        .from('post_votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

    if (deleteError) throw deleteError;

    const countField = voteType === 'like' ? 'like_count' : 'dislike_count';
    const { error: updateError } = await supabase.rpc('decrement_post_count', {
        post_id: postId,
        count_type: countField,
    });

    if (updateError) throw updateError;
};

const changeVote = async (postId: string, userId: string, oldVoteType: VoteType, newVoteType: VoteType) => {
    const { error: voteError } = await supabase
        .from('post_votes')
        .update({ vote_type: newVoteType })
        .eq('post_id', postId)
        .eq('user_id', userId);

    if (voteError) throw voteError;

    const { error: updateError } = await supabase.rpc('change_vote_counts', {
        post_id_param: postId,
        old_vote_type: oldVoteType,
        new_vote_type: newVoteType,
    });

    if (updateError) throw updateError;
};

export const getUserVoteStatus = async (postId: string, userId: string): Promise<VoteType | null> => {
    try {
        const { data, error } = await supabase
            .from('post_votes')
            .select('vote_type')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;

        return data?.vote_type || null;
    } catch (error) {
        console.error('투표 상태 조회 중 오류 발생:', error);
        return null;
    }
};
