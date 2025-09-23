import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './levelupGuide.module.css';
import level1 from '../../assets/level_icon_lv1.svg';
import level2 from '../../assets/level_icon_lv2.svg';
import level3 from '../../assets/level_icon_lv3.svg';
import level4 from '../../assets/level_icon_lv4.svg';

function LevelupGuide() {
    usePageSetup({
        title: '모두의 레벨업 가이드',
        pageName: 'levelup-guide',
        showBackButton: true,
    });

    return (
        <>
            <title>레벨업 가이드 - 모두의 부엌</title>
            <meta name='description' content='요리 고수가 되는 지름길! 모두의 부엌에서 활동하고 레벨을 올려보세요!' />
            <meta property='og:title' content='레벨업 가이드 - 모두의 부엌' />
            <meta
                property='og:description'
                content='요리 고수가 되는 지름길! 모두의 부엌에서 활동하고 레벨을 올려보세요!'
            />
            <meta property='og:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta property='og:type' content='website' />
            <meta property='og:url' content='https://morningstarrecipe.netlify.app/levelup-guide' />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content='레벨업 가이드 - 모두의 부엌' />
            <meta
                name='twitter:description'
                content='요리 고수가 되는 지름길! 모두의 부엌에서 활동하고 레벨을 올려보세요!'
            />
            <meta name='twitter:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta name='robots' content='index, follow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/levelup-guide' />

            <section className={styles['levelup_guide']}>
                <div className={styles['levelup_guide__container']}>
                    <h2 className='sr-only'>레벨업 가이드</h2>
                    <ul className={styles['levelup_guide__group']}>
                        <li>
                            <div className={styles['levelup_guide__info']}>
                                <h3 className={styles['levelup_guide__info-title']}>LV.1 초보 집밥러</h3>
                                <p className={styles['levelup_guide__info-text']}>신규 가입 회원</p>
                            </div>
                            <img src={level1} alt='level1' className={styles['levelup_guide__img']} />
                        </li>

                        <li>
                            <div className={styles['levelup_guide__info']}>
                                <h3 className={styles['levelup_guide__info-title']}>LV.2 우리집 요리사</h3>
                                <p className={styles['levelup_guide__info-text']}>게시물 10개 업로드 시 레벨업</p>
                            </div>
                            <img src={level2} alt='level2' className={styles['levelup_guide__img']} />
                        </li>

                        <li>
                            <div className={styles['levelup_guide__info']}>
                                <h3 className={styles['levelup_guide__info-title']}>LV.3 식탁 해결사</h3>
                                <p className={styles['levelup_guide__info-text']}>게시물 50개 업로드 시 레벨업</p>
                            </div>
                            <img src={level3} alt='level3' className={styles['levelup_guide__img']} />
                        </li>

                        <li>
                            <div className={styles['levelup_guide__info']}>
                                <h3 className={styles['levelup_guide__info-title']}>LV.4 집밥의 고수</h3>
                                <p className={styles['levelup_guide__info-text']}>게시물 100개 업로드 시 레벨업</p>
                            </div>
                            <img src={level4} alt='level4' className={styles['levelup_guide__img']} />
                        </li>
                    </ul>

                    <div className={styles['levelup_guide__downgrade']}>
                        <h3 className={styles['levelup_guide__downgrade-title']}>레벨 강등 사유</h3>
                        <ul className={styles['levelup_guide__downgrade-list']}>
                            <li>
                                <strong className={styles['levelup_guide__downgrade-list__title']}>
                                    허위/부정확한 정보
                                </strong>
                                <ul className={styles['levelup_guide__downgrade-list__text']}>
                                    <li>잘못된 조리법이나 재료 정보 게시</li>
                                    <li>위험한 조리 방법 안내 (식중독 위험 등)</li>
                                    <li>의도적인 가짜 레시피 업로드</li>
                                </ul>
                            </li>

                            <li>
                                <strong className={styles['levelup_guide__downgrade-list__title']}>저작권 침해</strong>
                                <ul className={styles['levelup_guide__downgrade-list__text']}>
                                    <li>다른 사이트/책의 레시피 무단 복사</li>
                                    <li>타인의 사진을 본인 것처럼 도용</li>
                                    <li>출처 표기 없는 콘텐츠 반복 게시</li>
                                </ul>
                            </li>

                            <li>
                                <strong className={styles['levelup_guide__downgrade-list__title']}>
                                    커뮤니티 운영 방해
                                </strong>
                                <ul className={styles['levelup_guide__downgrade-list__text']}>
                                    <li>동일한 레시피 중복 게시</li>
                                    <li>홍보성 글 반복 업로드</li>
                                    <li>의미 없는 글로 게시판 도배</li>
                                </ul>
                            </li>

                            <li>
                                <strong className={styles['levelup_guide__downgrade-list__title']}>
                                    부적절한 상업적 이용
                                </strong>
                                <ul className={styles['levelup_guide__downgrade-list__text']}>
                                    <li>무분별한 제품/업체 광고</li>
                                    <li>개인 사업체 과도한 홍보</li>
                                    <li>판매 목적의 연락처 반복 노출</li>
                                </ul>
                            </li>

                            <li>
                                <strong className={styles['levelup_guide__downgrade-list__title']}>
                                    사용자 경험 저해
                                </strong>
                                <ul className={styles['levelup_guide__downgrade-list__text']}>
                                    <li>낚시성 제목/내용</li>
                                    <li>제목과 전혀 다른 내용의 레시피</li>
                                    <li>과장되거나 자극적인 제목 남발</li>
                                    <li>클릭 유도만을 위한 미끼성 게시물</li>
                                    <li>기본 예의 위반다른 사용자 조리법에 대한 악성 비판</li>
                                    <li>댓글에서의 인신공격이나 비하 발언</li>
                                    <li>건설적이지 않은 부정적 피드백 반복</li>
                                    <li>시스템 악용평점 조작</li>
                                    <li>자신의 레시피에 다중 계정으로 허위 평점</li>
                                    <li>타인 레시피에 의도적 저평점 공격</li>
                                    <li>평점 조작을 위한 댓글 작성</li>
                                    <li>규정 우회 시도</li>
                                    <li>강등 후 유사한 위반 행위 반복</li>
                                    <li>경고 무시하고 문제 행동 지속</li>
                                    <li>제재 회피를 위한 편법 사용</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}

export default LevelupGuide;
