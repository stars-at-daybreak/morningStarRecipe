import { usePageSetup } from '../../hooks/usePageSetup';

function LevelupGuide() {
    usePageSetup({
        title: '모두의 레벨업 가이드',
        pageName: 'levelup-guide',
        showBackButton: true,
    });

    return (
        <section>
            <h1>레벨업 가이드</h1>
            <ul>
                <li>LV.1 초보 집밥러</li>
                <li>LV.2 우리집 요리사</li>
                <li>LV.3 식탁 마법사</li>
                <li>LV.4 집밥의 고수</li>
            </ul>
        </section>
    );
}

export default LevelupGuide;
