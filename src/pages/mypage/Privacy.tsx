import { useMemo } from 'react';
import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './privacy.module.css';

function Privacy() {
    const pageConfig = useMemo(
        () => ({
            title: '개인정보 처리방침',
            pageName: 'privacy',
            showBackButton: true,
        }),
        []
    );

    usePageSetup(pageConfig);

    return (
        <section className={styles.privacy}>
            <div className={styles.privacy__container}>
                <h2 className='sr-only'>개인정보처리방침</h2>
                <div className={styles.privacy__content}>
                    <strong className={styles.privacy__title}>모두의 부엌 개인정보 수집 및 이용 동의서</strong>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>
                            1. 개인정보 수집 목적 모두의 부엌(이하 "회사")은 다음의 목적을 위하여 개인정보를
                            수집·이용합니다:
                        </strong>
                        <p className={styles.privacy__content_title}>필수항목 수집목적</p>
                        <ul className={styles.privacy__content_text}>
                            <li>
                                회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정이용 방지와
                                비인가 사용방지, 가입의사 확인, 연령확인, 만14세 미만 아동 개인정보 수집 시 법정 대리인
                                동의여부 확인, 불만처리 등 민원처리, 고지사항 전달
                            </li>
                            <li>
                                서비스 제공: 요리 레시피 맞춤 추천, 콘텐츠 제공, 구매 및 요금 결제, 물품배송 또는 청구서
                                등 발송, 본인인증, 연령인증, 서비스 이용기록과 접속빈도 분석, 서비스 이용의 유효성 확인,
                                개인화 서비스 제공
                            </li>
                            <li>
                                마케팅 및 광고: 신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달, 인구통계학적
                                특성에 따른 서비스 제공 및 광고 게재, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계
                            </li>
                        </ul>
                    </div>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>2. 수집하는 개인정보 항목</strong>
                        <p className={styles.privacy__content_title}>필수항목</p>
                        <ul className={styles.privacy__content_text}>
                            <li>회원가입: 이메일, 비밀번호, 닉네임, 이름, 생년월일, 성별, 국적</li>
                            <li>서비스 이용: IP주소, 쿠키, 서비스 이용기록, 접속 로그, 접속 기기정보</li>
                        </ul>
                    </div>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>
                            3. 개인정보의 수집 방법 회사는 다음과 같은 방법으로 개인정보를 수집합니다:
                        </strong>
                        <ul className={styles.privacy__content_text}>
                            <li>
                                회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를
                                입력하는 경우
                            </li>
                            <li>툴바/애플리케이션 등 회사가 제공하는 서비스를 통해 수집하는 경우</li>
                            <li>생성정보 수집 툴을 통해 수집하는 경우</li>
                            <li>협력업체로부터 제공받는 경우</li>
                        </ul>
                    </div>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>
                            4. 개인정보의 보유 및 이용기간 회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이
                            해당 정보를 지체없이 파기합니다.
                        </strong>
                        <p className={styles.privacy__content_title}>회원탈퇴 시</p>
                        <ul className={styles.privacy__content_text}>
                            <li>
                                즉시 삭제: 닉네임, 프로필 사진, 자기소개 등 프로필 정보 - 1년 보관 후 삭제: 서비스
                                이용기록 (부정이용 방지를 위해)
                            </li>
                            <li>
                                관련 법령에 의한 보존 전자상거래 등에서의 소비자보호에 관한 법률, 전자금융거래법,
                                통신비밀보호법 등 관련 법령에서 일정기간 정보의 보관을 규정하는 경우에는 해당 기간 동안
                                보관합니다
                                <ul className={styles.privacy__content_text__depth}>
                                    <li>계약 또는 청약철회 등에 관한 기록: 5년 보존</li>
                                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 보존</li>
                                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보존</li>
                                    <li>표시•광고에 관한 기록: 6개월 보존</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>5. 개인정보의 파기절차 및 방법 </strong>
                        <p className={styles.privacy__content_title}>파기절차</p>
                        <ul className={styles.privacy__content_text}>
                            <li>
                                회원님이 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함)
                                내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간
                                저장된 후 파기됩니다.
                            </li>
                        </ul>

                        <p className={styles.privacy__content_title}>파기방법</p>
                        <ul className={styles.privacy__content_text}>
                            <li>전자적 파일형태의 정보: 기록을 재생할 수 없는 기술적 방법을 사용</li>
                            <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
                        </ul>
                    </div>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>
                            6. 개인정보 제공 및 공유 회사는 이용자들의 개인정보를 "개인정보의 수집목적 및 이용목적"에서
                            고지한 범위 내에서 사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나
                            원칙적으로 이용자의 개인정보를 외부에 공개하지 않습니다.{' '}
                        </strong>
                    </div>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>
                            7. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항{' '}
                        </strong>
                        <p className={styles.privacy__content_title}>쿠키의 사용</p>
                        <ul className={styles.privacy__content_text}>
                            <li>사용 목적: 개인화 서비스 제공, 서비스 품질 향상, 웹사이트 방문 및 이용형태 파악</li>
                            <li>
                                설치•운영 및 거부: 웹브라우저 상단의 도구 → 인터넷 옵션 → 개인정보 메뉴의 옵션 설정을
                                통해 쿠키 저장을 거부할 수 있습니다.{' '}
                            </li>
                        </ul>
                    </div>

                    <div className={styles.privacy__content}>
                        <strong className={styles.privacy__sub_title}>8. 개인정보보호책임자 및 담당자의 연락처</strong>
                        <p className={styles.privacy__content_title}>개인정보보호책임자</p>
                        <ul className={styles.privacy__content_text}>
                            <li>직책: 개인정보보호책임자</li>
                            <li>
                                연락처: privacy@ourkitchen.com 개인정보보호 관련 문의사항이 있으시면 위 이메일로
                                연락주시기 바랍니다. 귀하는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련
                                민원을 개인정보보호책임자 혹은 담당부서로 신고하실 수 있습니다. <br />
                                <br />본 개인정보처리방침은 2025년 9월 29일부터 시행됩니다.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Privacy;
