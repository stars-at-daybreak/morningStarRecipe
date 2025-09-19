import React from 'react';

interface YouTubeComponentProps {
    videoId: string;
}

export default function YouTubeComponent({ videoId }: YouTubeComponentProps): JSX.Element {
    return (
        <div style={{ margin: '20px 0' }}>
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
}