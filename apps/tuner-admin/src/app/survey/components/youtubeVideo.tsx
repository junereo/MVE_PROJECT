'use client';
import { useSearchParams } from 'next/navigation';

const YoutuveVideo = () => {
    const searchParams = useSearchParams();
    const videoId = searchParams.get('videoId');
    const title = searchParams.get('title');

    return (
        <div className="">
            {videoId && (
                <div>
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                        <iframe
                            className="w-[800px] h-[400px]"
                            // 실행할 비디오 주소
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={title || 'YouTube video'}
                            // 테두리 정의
                            frameBorder="0"
                            // 영상 속성 정의 autoplay	페이지 열리자마자 자동 재생 허용 등등
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            // 전체화면 적용
                            allowFullScreen
                        />
                    </div>
                    <h2 className="text-xl mt-2">{title}</h2>
                </div>
            )}
        </div>
    );
};
export default YoutuveVideo;
