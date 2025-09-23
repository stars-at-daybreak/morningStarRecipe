import { useMemo } from 'react';
import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './terms.module.css';

function Terms() {
    const pageConfig = useMemo(
        () => ({
            title: '서비스 이용약관',
            pageName: 'terms',
            showBackButton: true,
        }),
        []
    );

    usePageSetup(pageConfig);

    return (
        <>
            <title>서비스 이용약관 - 모두의 부엌</title>
            <meta name='description' content='모두의 부엌 서비스 이용약관입니다.' />
            <meta name='robots' content='noindex, nofollow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/mypage/terms' />

            <section className={styles.terms}>
                <div className={styles.terms__container}>
                    <h2 className='sr-only'>서비스 이용약관</h2>
                    <div className={styles.terms__content}>
                        <strong className={styles.terms__title}>모두의 부엌 서비스 이용약관</strong>
                        <strong className={styles.terms__sub_title}>제1조 (목적) </strong>
                        <p className={styles.terms__text}>
                            본 약관은 모두의 부엌(이하 "회사")이 제공하는 요리 레시피 공유 플랫폼 서비스(이하
                            "서비스")의 이용조건 및 절차, 회사와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을
                            규정함을 목적으로 합니다.
                        </p>
                        <strong className={styles.terms__sub_title}>제2조 (정의)</strong>
                        <ol className={styles.terms__text}>
                            <li>
                                <p>
                                    1. "서비스"란 회사가 제공하는 요리 레시피 공유, 검색, 평가 등의 모든 서비스를
                                    의미합니다.
                                </p>
                            </li>
                            <li>
                                <p>
                                    2. "이용자"란 본 약관에 따라 회사와 서비스 이용계약을 체결하고 회사가 제공하는
                                    서비스를 이용하는 자를 의미합니다.
                                </p>
                            </li>
                            <li>
                                <p>
                                    3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를
                                    지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를
                                    의미합니다.
                                </p>
                            </li>
                        </ol>
                        <strong className={styles.terms__sub_title}>제3조 (약관의 효력 및 변경)</strong>
                        <ol className={styles.terms__text}>
                            <li>
                                <p>
                                    1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이
                                    발생합니다.
                                </p>
                            </li>
                            <li>
                                <p>
                                    2. 회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 변경된 약관은 제1항과
                                    같은 방법으로 공지 또는 통지함으로써 효력이 발생합니다.
                                </p>
                            </li>
                        </ol>
                        <strong className={styles.terms__sub_title}>제4조 (서비스의 제공)</strong>
                        <ol className={styles.terms__text}>
                            <li>
                                <p>1. 회사는 다음과 같은 서비스를 제공합니다:</p>
                                <ul className={styles.terms__text_sub}>
                                    <li>요리 레시피 작성 및 공유</li>
                                    <li>레시피 평가 및 댓글</li>
                                    <li>레시피 검색 및 조회</li>
                                    <li>요리 재료 정보 제공</li>
                                    <li>
                                        기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 이용자에게 제공하는
                                        일체의 서비스
                                    </li>
                                </ul>
                            </li>
                        </ol>
                        <p className={styles.terms__text}></p>
                        <strong className={styles.terms__sub_title}>제5조 (서비스 이용계약의 성립)</strong>
                        <ol className={styles.terms__text}>
                            <li>
                                <p>
                                    1. 서비스 이용계약은 이용자가 본 약관에 동의하고 회원가입 신청을 하면 회사가 이를
                                    승낙함으로써 성립됩니다.
                                </p>
                            </li>
                            <li>
                                <p>2. 회사는 다음 각 호에 해당하는 신청에 대해서는 승낙하지 않을 수 있습니다:</p>
                                <ul className={styles.terms__text_sub}>
                                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                                    <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                                    <li>미성년자가 법정대리인의 동의를 얻지 아니한 경우</li>
                                </ul>
                            </li>
                        </ol>
                        <strong className={styles.terms__sub_title}>제6조 (회원정보의 변경)</strong>
                        <ol className={styles.terms__text}>
                            <li>
                                <p>
                                    1. 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수
                                    있습니다.
                                </p>
                            </li>
                            <li>
                                <p>
                                    2. 회원은 회원가입 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나
                                    전자우편 기타 방법으로 회사에 그 변경사항을 알려야 합니다.
                                </p>
                            </li>
                        </ol>
                        <strong className={styles.terms__sub_title}>제7조 (개인정보보호)</strong>
                        <p className={styles.terms__text}>
                            회사는 관련법령이 정하는 바에 따라 회원 등록정보를 포함한 회원의 개인정보를 보호하기 위해
                            노력합니다. 회원 개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보보호정책이
                            적용됩니다.
                        </p>
                        <strong className={styles.terms__sub_title}>제8조 (이용자의 의무)</strong>
                        <ol className={styles.terms__text}>
                            <li>
                                <p>1. 이용자는 다음 행위를 하여서는 안됩니다:</p>
                                <ul className={styles.terms__text_sub}>
                                    <li>신청 또는 변경 시 허위내용의 등록</li>
                                    <li>타인의 정보 도용</li>
                                    <li>회사가 게시한 정보의 변경</li>
                                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                                    <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                                    <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                                    <li>
                                        외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 회사에 공개
                                        또는 게시하는 행위
                                    </li>
                                </ul>
                            </li>
                        </ol>
                        <strong className={styles.terms__sub_title}>제9조 (서비스 이용제한)</strong>
                        <p className={styles.terms__text}>
                            회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고,
                            일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                        </p>
                        <strong className={styles.terms__sub_title}>제10조 (면책조항)</strong>
                        <ol className={styles.terms__text}>
                            <li>
                                <p>
                                    1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는
                                    경우에는 서비스 제공에 관한 책임이 면제됩니다.
                                </p>
                            </li>
                            <li>
                                <p>
                                    2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지
                                    않습니다.
                                </p>
                            </li>
                        </ol>
                        <strong className={styles.terms__sub_title}>제11조 (준거법 및 관할법원)</strong>{' '}
                        <p className={styles.terms__text}>
                            본 약관에 관해서는 대한민국의 법을 적용하며, 서비스 이용으로 발생한 분쟁에 대해 소송이
                            제기되는 경우 민사소송법상의 관할법원에 제기합니다.
                            <br /> <br />본 약관은 2025년 9월 29일부터 시행됩니다.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Terms;
