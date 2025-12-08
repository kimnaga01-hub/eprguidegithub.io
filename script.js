// EPR 법령·제도 요약(참고용) - 챗봇이 참고할 기본 베이스
const EPR_KNOWLEDGE_SUMMARY = [
    "1) 법적 근거: 「자원의 절약과 재활용촉진에 관한 법률」 및 같은 법 시행령·고시.",
    "2) 재활용 의무대상 제품: 1차 전지(일회용 전지), 타이어, 윤활유, 형광등 등.",
    "3) 재활용 의무대상 포장재: 종이팩, 금속캔, 유리병, 합성수지(플라스틱) 재질 포장재 등.",
    "4) 기본 구조: 의무대상 품목을 취급하는 제조·수입업자는 매년 출고·수입 실적을 신고하고, 법에서 정한 재활용 의무를 이행하거나 분담금을 납부해야 함.",
    "5) 세부 기준(톤수, 매출액, 수입액, 면제 요건 등)은 자주 개정될 수 있으므로, 항상 최신 법령과 한국환경공단·환경부 안내를 확인해야 함."
].join('\\n');

// 의무대상 제품·포장재 검색 데이터베이스
const EPR_TARGET_DATABASE = {
    // 제품 (Product)
    products: {
        battery: {
            name: "1차 전지",
            keywords: ["1차전지", "1차 전지", "건전지", "알카라인전지", "망간전지", "리튬1차전지", "일회용전지"],
            isTarget: true,
            category: "제품",
            description: "1차 전지(일회용 전지)만 EPR 의무대상입니다. 충전지(2차 전지)는 의무대상이 아닙니다."
        },
        tire: {
            name: "타이어",
            keywords: ["타이어", "타어", "자동차타이어", "오토바이타이어", "자전거타이어"],
            isTarget: true,
            category: "제품",
            description: "자동차, 오토바이, 자전거 등 모든 타이어는 EPR 의무대상입니다."
        },
        lubricant: {
            name: "윤활유",
            keywords: ["윤활유", "엔진오일", "기어오일", "모터오일", "오일"],
            isTarget: true,
            category: "제품",
            description: "자동차 및 기계용 윤활유는 EPR 의무대상입니다."
        },
        fluorescent: {
            name: "형광등",
            keywords: ["형광등", "형광램프", "램프", "전구"],
            isTarget: true,
            category: "제품",
            description: "형광등은 EPR 의무대상입니다."
        }
    },
    // 포장재 (Packaging)
    packaging: {
        pet: {
            name: "PET병",
            keywords: ["페트병", "pet병", "PET병", "페트", "pet", "PET", "무색페트", "유색페트", "플라스틱병"],
            isTarget: true,
            category: "포장재",
            description: "PET 재질의 병 및 용기는 EPR 의무대상 포장재입니다."
        },
        plastic: {
            name: "플라스틱 포장재",
            keywords: ["플라스틱", "합성수지", "비닐", "PE", "PP", "PS", "PVC", "포장재", "랩", "비닐봉지", "봉지", "플라스틱박스"],
            isTarget: true,
            category: "포장재",
            description: "합성수지(플라스틱) 재질의 모든 포장재는 EPR 의무대상입니다."
        },
        paper: {
            name: "종이팩",
            keywords: ["종이팩", "우유팩", "음료팩"],
            isTarget: true,
            category: "포장재",
            description: "종이팩은 EPR 의무대상 포장재입니다."
        },
        metal: {
            name: "금속캔 포장재",
            keywords: ["캔", "알루미늄캔", "철캔", "금속캔", "음료캔", "통조림캔", "알루미늄"],
            isTarget: true,
            category: "포장재",
            description: "금속재질의 캔 및 용기는 EPR 의무대상 포장재입니다."
        },
        glass: {
            name: "유리병 포장재",
            keywords: ["유리병", "유리", "병", "유리용기", "유리병류"],
            isTarget: true,
            category: "포장재",
            description: "유리 재질의 병 및 용기는 EPR 의무대상 포장재입니다."
        },
        foam: {
            name: "발포합성수지 포장재",
            keywords: ["스티로폼", "발포", "에어캡", "완충재", "포장완충제", "스펀지포장"],
            isTarget: true,
            category: "포장재",
            description: "발포합성수지 재질의 포장재는 EPR 의무대상입니다."
        }
    },
    // 비의무대상 예시
    nonTarget: {
        paperBox: {
            name: "종이박스 사용",
            keywords: ["종이박스", "종이상자", "카톤박스", "카톤", "종이포장", "박스", "종이박스사용"],
            isTarget: false,
            category: "포장재",
            description: "종이박스는 EPR 의무대상이 아닙니다. (종이팩만 의무대상)",
            requiresReasonDocument: true
        },
        paperBag: {
            name: "종이봉투",
            keywords: ["종이봉투", "종이용기"],
            isTarget: false,
            category: "포장재",
            description: "종이봉투는 현재 EPR 의무대상이 아닙니다. (종이팩만 의무대상)"
        },
        fullExport: {
            name: "전량 수출",
            keywords: ["전량수출", "전량 수출", "100%수출", "100% 수출", "모두수출", "모두 수출"],
            isTarget: false,
            category: "기타",
            description: "전량 수출하는 경우 EPR 의무대상이 아닙니다.",
            requiresReasonDocument: true
        },
        export: {
            name: "수출",
            keywords: ["수출", "해외수출", "해외 수출", "수출품", "수출제품"],
            isTarget: false,
            category: "기타",
            description: "수출하는 제품·포장재는 EPR 의무대상이 아닙니다.",
            requiresReasonDocument: true
        },
        selfUse: {
            name: "자체 사용",
            keywords: ["자체사용", "자체 사용", "내부사용", "내부 사용", "자사사용", "자사 사용"],
            isTarget: false,
            category: "기타",
            description: "자체 사용하는 제품·포장재는 EPR 의무대상이 아닙니다.",
            requiresReasonDocument: true
        }
    }
};

// 제품·포장재 검색 함수
function searchEPRTarget(keyword) {
    if (!keyword || keyword.trim().length === 0) {
        return null;
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    
    // 나무, 목재, 천, 직물 등 비의무대상 키워드 필터링 (검색 결과에서 제외)
    const excludedKeywords = ["나무", "목재", "나무상자", "나무박스", "나무포장", "천", "직물", "천포장"];
    const isExcluded = excludedKeywords.some(excluded => 
        normalizedKeyword.includes(excluded) || excluded.includes(normalizedKeyword)
    );
    
    if (isExcluded) {
        return null; // 검색 결과에서 제외 (나무, 천 관련은 결과 표시 안 함)
    }

    const results = [];

    // 모든 카테고리 검색
    for (const category of ['products', 'packaging', 'nonTarget']) {
        for (const item of Object.values(EPR_TARGET_DATABASE[category])) {
            // 키워드 매칭 확인
            const matchedKeyword = item.keywords.find(k => 
                normalizedKeyword.includes(k.toLowerCase()) || 
                k.toLowerCase().includes(normalizedKeyword)
            );

            if (matchedKeyword || item.name.toLowerCase().includes(normalizedKeyword)) {
                results.push({
                    ...item,
                    matchedKeyword: matchedKeyword || item.name
                });
            }
        }
    }

    // 매칭 정확도에 따라 정렬 (정확히 일치하는 것 우선)
    results.sort((a, b) => {
        const aExact = a.matchedKeyword.toLowerCase() === normalizedKeyword;
        const bExact = b.matchedKeyword.toLowerCase() === normalizedKeyword;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
    });

    return results.length > 0 ? results[0] : null;
}

// 제품·포장재 재활용의무 면제대상 업종 및 규모 (시행령 제19조, 별표 기준 요약)
// 안내문 표를 그대로 반영한 정적 데이터 (참고용)
const EPR_SIZE_TABLE = {
    packaging: {
        paperPack: {
            label: "종이팩 포장재",
            manufacturer: { sales: "연 매출액 10억 원 미만", output: "연 출고량 4톤 미만" },
            importer: { importValue: "연 수입액 3억 원 미만", importWeight: "연 수입량 1톤 미만" }
        },
        metalCan: {
            label: "금속캔 포장재",
            manufacturer: { sales: "연 매출액 10억 원 미만", output: "연 출고량 4톤 미만" },
            importer: { importValue: "연 수입액 3억 원 미만", importWeight: "연 수입량 1톤 미만" }
        },
        plastic: {
            label: "합성수지(플라스틱) 포장재",
            manufacturer: { sales: "연 매출액 10억 원 미만", output: "연 출고량 4톤 미만" },
            importer: { importValue: "연 수입액 3억 원 미만", importWeight: "연 수입량 1톤 미만" }
        },
        foam: {
            label: "발포합성수지 포장재",
            manufacturer: { sales: "연 매출액 10억 원 미만", output: "연 출고량 0.8톤 미만" },
            importer: { importValue: "연 수입액 3억 원 미만", importWeight: "연 수입량 0.3톤 미만" }
        },
        glass: {
            label: "유리병 포장재",
            manufacturer: { sales: "연 매출액 10억 원 미만", output: "연 출고량 10톤 미만" },
            importer: { importValue: "연 수입액 3억 원 미만", importWeight: "연 수입량 3톤 미만" }
        }
    },
    product: {
        generic: {
            label: "EPR 대상 제품(1차 전지, 타이어, 윤활유, 형광등 등)",
            manufacturer: { sales: "연 매출액 10억 원 미만", output: "연 출고량 10톤 미만" },
            importer: { importValue: "연 수입액 3억 원 미만", importWeight: "연 수입량 3톤 미만" }
        }
    }
};

// 규모미만/면제 기준 질문을 로컬 표로 처리하는 헬퍼
function handleLocalSizeQuery(text) {
    // 공백 제거 + 소문자 변환으로 키워드 인식률 향상
    const normalized = text.replace(/\s+/g, "").toLowerCase();
    const askSize =
        /규모미만|규모기준|면제기준|면제대상|의무이행면제/.test(normalized);

    if (!askSize) return null;

    let target = null;

    if (normalized.includes("유리병")) {
        target = EPR_SIZE_TABLE.packaging.glass;
    } else if (normalized.includes("종이팩") || normalized.includes("종이팩포장재") || normalized.includes("우유팩")) {
        target = EPR_SIZE_TABLE.packaging.paperPack;
    } else if (normalized.includes("금속캔") || normalized.includes("캔포장재")) {
        target = EPR_SIZE_TABLE.packaging.metalCan;
    } else if (normalized.includes("발포합성수지") || normalized.includes("psp") || normalized.includes("발포포장재")) {
        target = EPR_SIZE_TABLE.packaging.foam;
    } else if (normalized.includes("합성수지") || normalized.includes("플라스틱") || normalized.includes("필름")) {
        target = EPR_SIZE_TABLE.packaging.plastic;
    } else if (normalized.includes("제품") || normalized.includes("전지") || normalized.includes("타이어") || normalized.includes("윤활유") || normalized.includes("형광등")) {
        target = EPR_SIZE_TABLE.product.generic;
    }

    if (!target) {
        return null;
    }

    const m = target.manufacturer;
    const i = target.importer;

    const isPackaging = Object.values(EPR_SIZE_TABLE.packaging).includes(target);

    let intro = isPackaging
        ? `「자원의 절약과 재활용촉진에 관한 법률 시행령」 제19조 및 별표에 따른 ${target.label}의 '규모 미만' 재활용의무 면제 기준은 다음과 같습니다.`
        : `「자원의 절약과 재활용촉진에 관한 법률 시행령」 제19조 및 별표에 따른 ${target.label}의 '규모 미만' 재활용의무 면제 기준은 다음과 같습니다.`;

    let answer =
        `${intro}\n\n` +
        `1) 제조업자 기준 (전년도 기준)\n` +
        `- 매출액: ${m.sales}\n` +
        `- 출고량: ${m.output}\n\n` +
        `2) 수입업자 기준 (전년도 기준)\n` +
        `- 수입액: ${i.importValue}\n` +
        `- 수입량: ${i.importWeight}\n`;

    // 사용자가 구체적인 매출액/출고량/수입액/수입량을 함께 입력한 경우, 간단 판정 추가
    const raw = text;
    const lower = raw.toLowerCase();

    // 숫자 파싱용 헬퍼 (억, 톤 단위)
    const parseHundredMillion = (s) => {
        const m = s && s.match(/([\d\.]+)\s*억/);
        return m ? parseFloat(m[1]) : null;
    };
    const parseTon = (s) => {
        const m = s && s.match(/([\d\.]+)\s*톤/);
        return m ? parseFloat(m[1]) : null;
    };

    const inputSales = (() => {
        const m = raw.match(/매출(?:액)?\s*([\d\.]+)\s*억/);
        return m ? parseFloat(m[1]) : null;
    })();
    const inputOutput = (() => {
        const m = raw.match(/출고(?:량)?\s*([\d\.]+)\s*톤/);
        return m ? parseFloat(m[1]) : null;
    })();
    const inputImportValue = (() => {
        const m = raw.match(/수입(?:액)?\s*([\d\.]+)\s*억/);
        return m ? parseFloat(m[1]) : null;
    })();
    const inputImportWeight = (() => {
        const m = raw.match(/수입(?:량)?\s*([\d\.]+)\s*톤/);
        return m ? parseFloat(m[1]) : null;
    })();

    // 기준값 파싱
    const thSalesM = parseHundredMillion(m.sales);
    const thOutputM = parseTon(m.output);
    const thImportValue = parseHundredMillion(i.importValue);
    const thImportWeight = parseTon(i.importWeight);

    const judge = (val, threshold) =>
        val != null && threshold != null ? (val < threshold ? "규모미만" : "의무대상") : null;

    const manuSalesJudge = judge(inputSales, thSalesM);
    const manuOutputJudge = judge(inputOutput, thOutputM);
    const importValueJudge = judge(inputImportValue, thImportValue);
    const importWeightJudge = judge(inputImportWeight, thImportWeight);

    if (manuSalesJudge || manuOutputJudge || importValueJudge || importWeightJudge) {
        answer += `\n3) 입력하신 값 기준 간단 판정\n`;
        if (manuSalesJudge || manuOutputJudge) {
            const both =
                manuSalesJudge && manuOutputJudge
                    ? manuSalesJudge === "규모미만" && manuOutputJudge === "규모미만"
                        ? "규모미만입니다."
                        : "의무대상입니다."
                    : manuSalesJudge || manuOutputJudge;
            answer += `- 제조업자 관점: ${both}\n`;
        }
        if (importValueJudge || importWeightJudge) {
            const both =
                importValueJudge && importWeightJudge
                    ? importValueJudge === "규모미만" && importWeightJudge === "규모미만"
                        ? "규모미만입니다."
                        : "의무대상입니다."
                    : importValueJudge || importWeightJudge;
            answer += `- 수입업자 관점: ${both}\n`;
        }
    }

    return answer;
}

document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentStep = 0;
    const answers = {
        role: null,     // 'manufacturer' | 'importer'
        item: null,     // 'packaging' | 'product'
        revenue: null,  // 'high' | 'low'
        volume: null    // 'high' | 'low' (Optional for detail)
    };

    // --- DOM Elements ---
    const heroSection = document.getElementById('hero');
    const wizardSection = document.getElementById('wizard');
    const resultSection = document.getElementById('result');
    const startBtn = document.getElementById('start-btn');

    const progressBar = document.getElementById('progress-fill');
    const currentStepEl = document.getElementById('current-step');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const prevBtn = document.getElementById('prev-btn');

    // --- Data ---
    const steps = [
        {
            id: 'role',
            question: "귀사의 사업 형태는 무엇입니까?",
            options: [
                { value: 'manufacturer', text: '제조업자', icon: '🏭' },
                { value: 'importer', text: '수입업자', icon: '🚢' }
            ]
        },
        {
            id: 'item',
            question: "주로 취급하는 품목은 무엇입니까?",
            options: [
                { value: 'packaging', text: '포장재 (종이, 비닐, 병 등)', icon: '📦' },
                { value: 'product', text: '제품 (1차 전지, 타이어, 형광등 등)', icon: '🔋' }
            ]
        },
        {
            id: 'revenue',
            question: "작년 연간 매출액 규모는?",
            options: [
                { value: 'low', text: '10억 원 미만', icon: '📉' },
                { value: 'high', text: '10억 원 이상', icon: '📈' }
            ]
        }
    ];

    // --- Event Listeners ---
    startBtn.addEventListener('click', startWizard);
    prevBtn.addEventListener('click', goPrev);
    document.getElementById('share-btn').addEventListener('click', shareResult);

    // --- Functions ---

    function startWizard() {
        heroSection.classList.add('hidden');
        wizardSection.classList.remove('hidden');
        renderStep();
    }

    function renderStep() {
        const stepData = steps[currentStep];

        // Update UI
        currentStepEl.textContent = currentStep + 1;
        progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
        questionText.textContent = stepData.question;

        // Clear & Render Options
        optionsContainer.innerHTML = '';
        stepData.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <span class="option-icon">${opt.icon}</span>
                <span class="option-text">${opt.text}</span>
            `;
            card.onclick = () => handleAnswer(stepData.id, opt.value);
            optionsContainer.appendChild(card);
        });

        // Prev Button
        if (currentStep > 0) {
            prevBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.add('hidden');
        }
    }

    function handleAnswer(key, value) {
        answers[key] = value;

        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep();
        } else {
            showResult();
        }
    }

    function goPrev() {
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    }

    function showResult() {
        wizardSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        const result = calculateResult();
        renderResultCard(result);
    }

    // --- Logic Engine (Simplified for MVP) ---
    function calculateResult() {
        const { role, item, revenue } = answers;

        // 1. Small Scale Exemption Logic
        if (revenue === 'low') {
            return {
                isTarget: true,
                title: "분담금은 면제, 실적 신고는 필수!",
                desc: "매출액 10억 원 미만(또는 수입액 3억 원 미만)인 경우 재활용 분담금 납부는 면제되지만, 출고·수입 실적서는 반드시 제출해야 합니다.",
                color: "#ffc107", // Warning Yellow
                icon: "⚠️"
            };
        }

        // 2. Product Specific Logic
        if (item === 'product') {
            return {
                isTarget: true,
                title: "EPR 대상(의무생산자)입니다.",
                desc: "1차 전지, 타이어, 형광등 등 '시행령 제18조 제품'을 제조/수입하는 경우, 매출액 규모와 관계없이 대상이 될 수 있습니다.",
                color: "#dc3545",
                icon: "⚠️"
            };
        }

        // 3. Packaging Specific Logic
        if (item === 'packaging') {
            return {
                isTarget: true,
                title: "EPR 대상(포장재 의무생산자)입니다.",
                desc: "제품의 포장재(종이, 비닐, 병, 캔 등)를 사용하거나 수입하는 경우, 재활용 분담금 납부 의무가 있습니다.",
                color: "#0056b3",
                icon: "📦"
            };
        }

        // Default Fallback
        return {
            isTarget: true,
            title: "EPR 대상 가능성이 있습니다.",
            desc: "정확한 판단을 위해 공단 콜센터로 문의하시기 바랍니다.",
            color: "#ffc107",
            icon: "❓"
        };
    }

    function renderResultCard(result) {
        const resultCard = document.getElementById('result-card');
        const iconEl = document.getElementById('result-icon');
        const titleEl = document.getElementById('result-title');
        const descEl = document.getElementById('result-desc');

        iconEl.textContent = result.icon;
        titleEl.textContent = result.title;
        descEl.textContent = result.desc;

        // Dynamic Style
        titleEl.style.color = result.color;
    }

    function shareResult() {
        const { role, item, revenue } = answers;
        const result = calculateResult();

        const text = `[EPR 자가진단 결과]\n\n판정: ${result.title}\n사유: ${item === 'packaging' ? '포장재' : '제품'} 취급, 매출 ${revenue === 'high' ? '10억 이상' : '10억 미만'}\n\n이 결과는 간이 진단용입니다.`;

        navigator.clipboard.writeText(text).then(() => {
            alert("결과 요약본이 복사되었습니다!\n메신저나 메일에 붙여넣기 하세요.");
        });
    }
});

// Calculator Logic
document.addEventListener('DOMContentLoaded', function () {
    const calcCategory = document.getElementById('calc-category');
    const calcInputs = document.getElementById('calc-inputs');
    const resultGrade = document.getElementById('result-grade');
    const resultMsg = document.getElementById('result-msg');
    const calcResult = document.getElementById('calc-result');

    // Data for dynamic inputs
    const categoryData = {
        pet: {
            inputs: [
                {
                    id: 'body', label: '몸체 (Body)', options: [
                        { val: 3, text: '투명 페트병 (Clear PET)' },
                        { val: 0, text: '유색 페트병 (Colored PET)' },
                        { val: 1, text: '복합 재질 (Composite Material)' },
                        { val: 0, text: 'PVC' }
                    ]
                },
                {
                    id: 'label', label: '라벨 (Label)', options: [
                        { val: 3, text: '절취선 있음 / 비접착 / 라벨 없음' },
                        { val: 2, text: '물에 뜨는 접착제 (수분리)' },
                        { val: 1, text: '일반 접착제' },
                        { val: 0, text: 'PVC / 잘 안 떨어짐' }
                    ]
                },
                {
                    id: 'cap', label: '마개 (Cap)', options: [
                        { val: 2, text: '몸체와 같은 재질 / 분리 가능' },
                        { val: 2, text: '몸체와 다른 재질 / 분리 가능' },
                        { val: 0, text: '금속 / 분리 불가능' }
                    ]
                }
            ]
        },
        psp: {
            inputs: [
                {
                    id: 'body', label: '몸체 (Body)', options: [
                        { val: 3, text: '단일 재질 (흰색)' },
                        { val: 0, text: '유색 / 코팅 / 복합 재질' }
                    ]
                },
                {
                    id: 'label', label: '라벨 (Label)', options: [
                        { val: 3, text: '없음 / 직접 인쇄' },
                        { val: 2, text: '종이 / PP (분리 가능)' },
                        { val: 0, text: 'PVC / 분리 불가능' }
                    ]
                },
                {
                    id: 'cap', label: '마개 및 잡자재 (Cap/Others)', options: [
                        { val: 3, text: '없음 / 분리 가능' },
                        { val: 0, text: '분리 불가능 (이물질 포함)' }
                    ]
                }
            ]
        },
        single: {
            inputs: [
                {
                    id: 'body', label: '몸체 (Body)', options: [
                        { val: 3, text: '단일 재질 (PE/PP/PS)' },
                        { val: 1, text: '복합 재질 (Composite Material)' },
                        { val: 0, text: 'PVC' }
                    ]
                },
                {
                    id: 'label', label: '라벨 (Label)', options: [
                        { val: 3, text: '몸체와 동일 재질 / 라벨 없음' },
                        { val: 1, text: '몸체와 다른 재질 (분리 가능)' },
                        { val: 0, text: 'PVC / 분리 불가능' }
                    ]
                },
                {
                    id: 'cap', label: '마개 및 잡자재 (Cap/Others)', options: [
                        { val: 3, text: '없음' },
                        { val: 2, text: '몸체와 동일 재질 (분리 가능)' },
                        { val: 1, text: '몸체와 다른 재질 (분리 가능)' },
                        { val: 0, text: '분리 불가능 (금속 등)' }
                    ]
                }
            ]
        },
        film: {
            inputs: [
                {
                    id: 'body', label: '재질 (Material)', options: [
                        { val: 3, text: '단일 재질 (PE/PP/PS)' },
                        { val: 1, text: '복합 재질 (알루미늄 50㎛ 이하 사용)' },
                        { val: 0, text: '복합 재질 (알루미늄 50㎛ 초과 / PVC)' }
                    ]
                },
                {
                    id: 'label', label: '라벨 (Label)', options: [
                        { val: 3, text: '없음 / 직접 인쇄' },
                        { val: 2, text: '종이 스티커 (분리 가능)' },
                        { val: 0, text: '분리 불가능' }
                    ]
                },
                {
                    id: 'cap', label: '마개 및 잡자재 (Cap/Others)', options: [
                        { val: 3, text: '없음' },
                        { val: 2, text: '별도 재질 (스파우트 등) - 분리 가능' },
                        { val: 0, text: '분리 불가능' }
                    ]
                }
            ]
        },
        glass: {
            inputs: [
                {
                    id: 'body', label: '색상 (Color)', options: [
                        { val: 2, text: '무색 / 갈색 / 녹색' },
                        { val: 0, text: '그 외 색상' }
                    ]
                },
                {
                    id: 'label', label: '라벨 (Label)', options: [
                        { val: 2, text: '비 PVC 계열 (종이 등)' },
                        { val: 0, text: 'PVC 계열' }
                    ]
                },
                {
                    id: 'cap', label: '마개 및 잡자재 (Cap/Others)', options: [
                        { val: 2, text: '분리 가능 (금속/플라스틱)' },
                        { val: 0, text: '분리 불가능 / 접착제 사용' }
                    ]
                }
            ]
        },
        paper: {
            inputs: [
                {
                    id: 'body', label: '구조 (Structure)', options: [
                        { val: 2, text: '알루미늄 첩합 없음 (일반 팩)' },
                        { val: 0, text: '알루미늄 첩합 (멸균 팩)' }
                    ]
                },
                {
                    id: 'label', label: '라벨 (Label)', options: [
                        { val: 2, text: '없음 / 직접 인쇄' },
                        { val: 0, text: '분리 불가능한 라벨' }
                    ]
                },
                {
                    id: 'cap', label: '마개 및 잡자재 (Cap/Others)', options: [
                        { val: 2, text: '없음 / 분리 가능 (스트로우 등)' },
                        { val: 0, text: '분리 불가능' }
                    ]
                }
            ]
        }
    };

    function renderInputs() {
        if (!calcCategory) return;
        const cat = calcCategory.value;
        const data = categoryData[cat];

        calcInputs.innerHTML = '';

        data.inputs.forEach(input => {
            const group = document.createElement('div');
            group.className = 'calc-group';

            const label = document.createElement('label');
            label.textContent = input.label;

            const select = document.createElement('select');
            select.className = 'calc-input-dynamic';
            select.dataset.id = input.id; // Store ID for logic if needed

            input.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.val;
                option.textContent = opt.text;
                select.appendChild(option);
            });

            select.addEventListener('change', calculateGrade);

            group.appendChild(label);
            group.appendChild(select);
            calcInputs.appendChild(group);
        });

        calculateGrade();
    }

    // Improvement Suggestions Data with examples
    const improvementSuggestions = {
        // PET Bottle
        'pet_body': {
            text: '유색 페트병은 재활용이 어렵습니다. 무색 페트병으로 변경을 권장합니다.',
            example: {
                bad: '유색/초록색 페트병은 재활용 공정에서 색상 분리가 어렵습니다.',
                good: '무색 투명 페트병은 재활용이 용이하여 최우수 등급을 받을 수 있습니다.'
            }
        },
        'pet_body_pvc': {
            text: 'PVC 재질 용기는 재활용이 불가능합니다. PET 재질로 변경하세요.',
            example: {
                bad: 'PVC 재질은 재활용 시 독성 가스가 발생하여 사용이 금지됩니다.',
                good: 'PET 재질은 안전하게 재활용이 가능합니다.'
            }
        },
        'pet_label': {
            text: 'PVC 라벨이나 일반 접착제는 재활용을 방해합니다. 절취선이 있는 라벨이나 수분리 접착제로 변경하세요.',
            example: {
                bad: 'PVC 라벨이나 강한 접착제는 분리가 어려워 재활용을 방해합니다.',
                good: '절취선이 있거나 물에 쉽게 분리되는 접착제를 사용하세요.',
            }
        },
        'pet_cap': {
            text: '금속 마개는 재활용이 불가능합니다. 몸체와 같은 재질이나 분리 가능한 플라스틱 마개로 변경하세요.',
            example: {
                bad: '금속 마개는 플라스틱 재활용 과정에서 제거가 어렵고 이물질로 처리됩니다.',
                good: 'PET 재질 마개나 분리 가능한 플라스틱 마개를 사용하세요.',
            }
        },

        // PSP
        'psp_body': {
            text: '유색이나 코팅된 트레이는 재활용이 어렵습니다. 흰색 단일 재질로 변경하세요.',
            example: {
                bad: '유색이나 코팅된 PSP는 재활용 시 색상 혼합으로 품질이 떨어집니다.',
                good: '흰색 단일 재질 PSP는 깨끗하게 재활용이 가능합니다.',
            }
        },
        'psp_label': {
            text: 'PVC 라벨이나 분리 불가능한 라벨은 피해주세요. 종이 라벨이나 직접 인쇄 방식을 권장합니다.',
            example: {
                bad: 'PVC 라벨은 분리되지 않아 재활용 품질을 떨어뜨립니다.',
                good: '종이 라벨은 물에 분리되거나 직접 인쇄 방식이 좋습니다.',
            }
        },
        'psp_cap': {
            text: '이물질이 포함된 잡자재는 제거하거나 분리 가능한 구조로 변경해야 합니다.',
            example: {
                bad: '접착된 잡자재나 분리 불가능한 부품은 재활용을 방해합니다.',
                good: '잡자재 없이 또는 쉽게 분리 가능한 구조로 설계하세요.',
            }
        },

        // Single Material Container
        'single_body': {
            text: 'PVC 재질은 재활용이 매우 어렵습니다. PE, PP, PS 등 단일 재질로 변경하세요.',
            example: {
                bad: 'PVC는 재활용 시 독성물질 발생으로 사용이 제한됩니다.',
                good: 'PE, PP, PS 단일 재질은 재활용이 용이합니다.',
            }
        },
        'single_label': {
            text: 'PVC 라벨은 사용을 지양하고, 몸체와 동일한 재질이나 분리 가능한 라벨을 사용하세요.',
            example: {
                bad: 'PVC 라벨은 분리되지 않아 재활용을 방해합니다.',
                good: '몸체와 같은 재질(PE/PP) 라벨이나 분리 가능한 라벨을 사용하세요.',
            }
        },
        'single_cap': {
            text: '금속 마개 등 분리 불가능한 잡자재는 재활용 등급을 낮춥니다. 분리 가능한 구조로 개선하세요.',
            example: {
                bad: '금속 마개나 접착된 부품은 분리가 어렵습니다.',
                good: '플라스틱 마개나 쉽게 분리 가능한 구조로 변경하세요.',
            }
        },

        // Film/Sheet
        'film_body': {
            text: '알루미늄이 두껍게 포함되거나 PVC가 섞인 재질은 재활용이 어렵습니다. 단일 재질(PE/PP)로 변경하세요.',
            example: {
                bad: '알루미늄 50㎛ 초과 또는 PVC 혼합은 재활용이 불가능합니다.',
                good: '단일 재질(PE/PP) 또는 알루미늄 50㎛ 이하 사용 시 보통 등급 가능합니다.',
            }
        },
        'film_label': {
            text: '분리 불가능한 라벨 대신 직접 인쇄하거나 분리 가능한 스티커를 사용하세요.',
            example: {
                bad: '접착된 라벨은 분리가 어렵습니다.',
                good: '직접 인쇄나 물에 떨어지는 스티커를 사용하세요.',
            }
        },
        'film_cap': {
            text: '분리 불가능한 마개는 재활용을 방해합니다. 별도 재질이라도 분리가 쉬운 구조로 변경하세요.',
            example: {
                bad: '접착된 마개나 분리 불가능한 부품은 재활용을 어렵게 합니다.',
                good: '분리 가능한 구조로 설계하거나 부품을 최소화하세요.',
            }
        },

        // Glass
        'glass_body': {
            text: '무색, 갈색, 녹색 이외의 색상은 재활용이 어렵습니다. 표준 색상(무색/갈색/녹색)을 사용하세요.',
            example: {
                bad: '파란색, 보라색 등 비표준 색상은 재활용이 어렵습니다.',
                good: '무색, 갈색, 녹색은 재활용이 용이한 표준 색상입니다.',
            }
        },
        'glass_label': {
            text: 'PVC 계열 라벨은 재활용 공정에서 문제를 일으킵니다. 종이 등 비 PVC 계열로 변경하세요.',
            example: {
                bad: 'PVC 라벨은 유리 재활용 공정에서 문제를 일으킵니다.',
                good: '종이 라벨은 물에 쉽게 분리되어 재활용이 용이합니다.',
            }
        },
        'glass_cap': {
            text: '접착제를 사용하여 분리가 안 되는 마개는 피하고, 분리 가능한 금속/플라스틱 마개를 사용하세요.',
            example: {
                bad: '접착된 마개는 분리가 어렵습니다.',
                good: '나사식이나 끼움식 등 분리 가능한 마개를 사용하세요.',
            }
        },

        // Paper Pack
        'paper_body': {
            text: '알루미늄이 첩합된 멸균팩은 일반 팩보다 재활용이 까다롭습니다. 가능하다면 일반 팩 구조로 변경하세요.',
            example: {
                bad: '알루미늄 첩합 멸균팩은 재활용 과정이 복잡합니다.',
                good: '일반 종이팩은 재활용이 더 용이합니다.',
            }
        },
        'paper_label': {
            text: '분리 불가능한 라벨은 재활용 품질을 떨어뜨립니다. 직접 인쇄하거나 제거 쉬운 라벨을 사용하세요.',
            example: {
                bad: '접착된 라벨은 종이 재활용 시 이물질이 됩니다.',
                good: '직접 인쇄나 쉽게 제거되는 라벨을 사용하세요.',
            }
        },
        'paper_cap': {
            text: '분리 불가능한 잡자재는 재활용을 어렵게 합니다. 제거하거나 분리 가능한 구조로 변경하세요.',
            example: {
                bad: '접착된 스트로우나 부품은 종이 재활용을 방해합니다.',
                good: '분리 가능한 구조나 부품을 최소화하세요.',
            }
        }
    };

    function calculateGrade() {
        const selects = document.querySelectorAll('.calc-input-dynamic');
        if (selects.length === 0) return;

        let scores = [];
        let inputs = [];
        selects.forEach(sel => {
            scores.push(parseInt(sel.value));
            inputs.push({
                id: sel.dataset.id,
                value: parseInt(sel.value),
                cat: calcCategory.value,
                selectedText: sel.options[sel.selectedIndex].text
            });
        });

        // Minimum Grade Logic
        const minScore = Math.min(...scores);

        // Special case for PET bottle
        let finalGrade = minScore;
        if (calcCategory.value === 'pet') {
            const capInput = inputs.find(input => input.id === 'cap');
            
            // 마개가 몸체와 다른 재질 / 분리 가능이면 보통
            if (capInput && capInput.value === 2 && capInput.selectedText === '몸체와 다른 재질 / 분리 가능') {
                finalGrade = 1; // 보통
            }
        }

        // Special case for single material container
        if (calcCategory.value === 'single') {
            const bodyInput = inputs.find(input => input.id === 'body');
            const labelInput = inputs.find(input => input.id === 'label');
            const capInput = inputs.find(input => input.id === 'cap');
            
            // 몸체가 단일재질인 경우
            if (bodyInput && bodyInput.value === 3 && bodyInput.selectedText === '단일 재질 (PE/PP/PS)') {
                // 라벨 조건: 동일재질/라벨 없음이면 우수
                if (labelInput && labelInput.value === 3 && labelInput.selectedText === '몸체와 동일 재질 / 라벨 없음') {
                    // 마개 조건에 따라 등급 결정
                    if (capInput) {
                        if (capInput.value === 2 && capInput.selectedText === '몸체와 동일 재질 (분리 가능)') {
                            finalGrade = 2; // 우수
                        } else if (capInput.value === 1 && capInput.selectedText === '몸체와 다른 재질 (분리 가능)') {
                            finalGrade = 1; // 보통
                        } else if (capInput.value === 0 && capInput.selectedText === '분리 불가능 (금속 등)') {
                            finalGrade = 0; // 어려움
                        } else if (capInput.value === 3 && capInput.selectedText === '없음') {
                            finalGrade = 2; // 우수 (마개 없음)
                        }
                    }
                }
            }
        }

        // Special case for film/sheet
        if (calcCategory.value === 'film') {
            const bodyInput = inputs.find(input => input.id === 'body');
            const labelInput = inputs.find(input => input.id === 'label');
            const capInput = inputs.find(input => input.id === 'cap');
            
            let bodyGrade = null;
            let labelGrade = null;
            let capGrade = null;
            
            // 몸체 조건
            if (bodyInput) {
                // 단일재질이면 우수
                if (bodyInput.value === 3 && bodyInput.selectedText === '단일 재질 (PE/PP/PS)') {
                    bodyGrade = 2; // 우수
                }
                // 복합재질(알루미늄 50um 이하)이면 보통
                else if (bodyInput.value === 1 && bodyInput.selectedText === '복합 재질 (알루미늄 50㎛ 이하 사용)') {
                    bodyGrade = 1; // 보통
                }
                // 복합재질(알루미늄 50um 초과/PVC)은 어려움
                else if (bodyInput.value === 0) {
                    bodyGrade = 0; // 어려움
                }
            }
            
            // 라벨 조건
            if (labelInput) {
                // 없음/직접 인쇄 → 우수
                if (labelInput.value === 3 && labelInput.selectedText === '없음 / 직접 인쇄') {
                    labelGrade = 2; // 우수
                }
                // 종이 스티커 (분리 가능) → 보통
                else if (labelInput.value === 2 && labelInput.selectedText === '종이 스티커 (분리 가능)') {
                    labelGrade = 1; // 보통
                }
                // 분리 불가능 → 어려움
                else if (labelInput.value === 0 && labelInput.selectedText === '분리 불가능') {
                    labelGrade = 0; // 어려움
                }
            }
            
            // 마개 및 잡자재 조건
            if (capInput) {
                // 없음 → 우수
                if (capInput.value === 3 && capInput.selectedText === '없음') {
                    capGrade = 2; // 우수
                }
                // 별도 재질 (분리 가능) → 보통
                else if (capInput.value === 2 && capInput.selectedText === '별도 재질 (스파우트 등) - 분리 가능') {
                    capGrade = 1; // 보통
                }
                // 분리 불가능 → 어려움
                else if (capInput.value === 0 && capInput.selectedText === '분리 불가능') {
                    capGrade = 0; // 어려움
                }
            }
            
            // 몸체, 라벨, 마개 중 가장 낮은 등급 선택
            const grades = [bodyGrade, labelGrade, capGrade].filter(g => g !== null);
            if (grades.length > 0) {
                finalGrade = Math.min(...grades);
            }
        }

        let gradeText = '';
        let msgText = '';
        let gradeClass = '';

        // Mapping Score to Grade
        // 3: Best, 2: Good, 1: Normal, 0: Difficult
        switch (finalGrade) {
            case 3:
                gradeText = '최우수';
                msgText = '재활용이 매우 쉬운 최적의 포장재입니다.';
                gradeClass = 'best';
                break;
            case 2:
                gradeText = '우수';
                msgText = '재활용이 비교적 쉬운 포장재입니다.';
                gradeClass = 'good';
                break;
            case 1:
                gradeText = '보통';
                msgText = '일반적인 수준의 재활용 용이성을 가집니다.';
                gradeClass = 'normal';
                break;
            case 0:
                gradeText = '어려움';
                msgText = '재활용이 어렵습니다. 개선이 필요하거나 표시 의무가 있습니다.';
                gradeClass = 'difficult';
                break;
        }

        resultGrade.textContent = gradeText;
        resultMsg.textContent = msgText;

        calcResult.className = 'calc-result ' + gradeClass;

        // Improvement Suggestions Logic
        const improvementBox = document.getElementById('improvement-box');
        const improvementList = document.getElementById('improvement-list');

        if (minScore === 0) {
            improvementList.innerHTML = '';
            let hasSuggestions = false;

            inputs.forEach(input => {
                if (input.value === 0) {
                    let key = `${input.cat}_${input.id}`;

                    // Special case for PVC in PET bottles
                    if (input.cat === 'pet' && input.id === 'body' && input.selectedText === 'PVC') {
                        key = 'pet_body_pvc';
                    }

                    if (improvementSuggestions[key]) {
                        const suggestion = improvementSuggestions[key];
                        const li = document.createElement('li');
                        
                        // Create suggestion item with text and examples
                        li.innerHTML = `
                            <div class="suggestion-content">
                                <p class="suggestion-text">${suggestion.text}</p>
                                ${suggestion.example ? `
                                    <div class="example-comparison">
                                        <div class="example-item bad">
                                            <div class="example-label">❌ 문제 예시</div>
                                            <div class="example-image-container">
                                                <div class="example-placeholder bad-placeholder">
                                                    <div class="placeholder-icon">📦</div>
                                                    <div class="placeholder-text">문제 사례</div>
                                                </div>
                                            </div>
                                            <p class="example-desc">${suggestion.example.bad}</p>
                                        </div>
                                        <div class="example-item good">
                                            <div class="example-label">✅ 개선 예시</div>
                                            <div class="example-image-container">
                                                <div class="example-placeholder good-placeholder">
                                                    <div class="placeholder-icon">♻️</div>
                                                    <div class="placeholder-text">개선 사례</div>
                                                </div>
                                            </div>
                                            <p class="example-desc">${suggestion.example.good}</p>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                        improvementList.appendChild(li);
                        hasSuggestions = true;
                    }
                }
            });

            if (hasSuggestions) {
                improvementBox.classList.remove('hidden');
            } else {
                improvementBox.classList.add('hidden');
            }
        } else {
            improvementBox.classList.add('hidden');
        }
    }

    if (calcCategory) {
        calcCategory.addEventListener('change', renderInputs);
        renderInputs(); // Initial render
    }

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });

    // 제품·포장재 검색 기능
    const searchInput = document.getElementById('product-search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResult = document.getElementById('search-result');

    function displaySearchResult(result) {
        if (!result) {
            searchResult.innerHTML = `
                <div class="search-result-item not-found">
                    <div class="result-icon">❓</div>
                    <div class="result-content">
                        <h3>검색 결과 없음</h3>
                        <p>입력하신 제품·포장재에 대한 정보를 찾을 수 없습니다. 정확한 의무대상 여부는 대구경북환경본부(053-580-7517)로 문의하시기 바랍니다.</p>
                    </div>
                </div>
            `;
            searchResult.classList.remove('hidden');
            return;
        }

        const isTarget = result.isTarget;
        const icon = isTarget ? '✅' : '❌';
        const titleColor = isTarget ? '#dc3545' : '#28a745';
        const bgColor = isTarget ? '#fff5f5' : '#f0fff4';
        const borderColor = isTarget ? '#fecaca' : '#c6f6d5';

        searchResult.innerHTML = `
            <div class="search-result-item ${isTarget ? 'target' : 'non-target'}" style="background: ${bgColor}; border-color: ${borderColor};">
                <div class="result-icon">${icon}</div>
                <div class="result-content">
                    <div class="result-header">
                        <h3 style="color: ${titleColor};">${result.name}</h3>
                        <span class="result-badge ${isTarget ? 'badge-target' : 'badge-non-target'}">${result.category}</span>
                    </div>
                    <p class="result-description">${result.description}</p>
                    ${isTarget ? `
                        <div class="result-notice">
                            <strong>📌 의무사항:</strong>
                            <ul>
                                <li>출고·수입 실적 신고 (매년 4월 15일까지)</li>
                                <li>재활용 분담금 납부 (해당 공제조합에 납부)</li>
                            </ul>
                        </div>
                    ` : `
                        <div class="result-notice">
                            <p><strong>참고:</strong> 현재 EPR 의무대상이 아니지만, 제도 개정 시 포함될 수 있으니 주의하시기 바랍니다.</p>
                            ${result.requiresReasonDocument ? `
                                <div style="margin-top: 16px; padding: 16px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                    <strong>⚠️ 비대상 사유서 제출 필요:</strong>
                                    <p style="margin-top: 8px; margin-bottom: 0;">
                                        ${result.name}의 경우 비대상 사유서를 제출해야 합니다. 
                                        EPR 시스템(portal.budamgum.or.kr)에서 비대상 사유서를 작성하여 제출하시기 바랍니다.
                                    </p>
                                </div>
                            ` : ''}
                        </div>
                    `}
                    <p class="result-matched">매칭된 키워드: <strong>${result.matchedKeyword}</strong></p>
                </div>
            </div>
        `;
        searchResult.classList.remove('hidden');
    }

    function handleSearch() {
        const keyword = searchInput.value.trim();
        if (keyword.length === 0) {
            searchResult.classList.add('hidden');
            return;
        }

        const result = searchEPRTarget(keyword);
        displaySearchResult(result);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        // 입력 시 실시간 검색 (옵션)
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.trim().length > 0) {
                // 실시간 검색이 필요하면 주석 해제
                // handleSearch();
            } else {
                searchResult.classList.add('hidden');
            }
        });
    }

    // 부드러운 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 모든 섹션에 관찰자 적용
    const sections = document.querySelectorAll('.content-section, .timeline-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // 초기 로드 시 첫 번째 섹션은 즉시 표시
    if (sections.length > 0) {
        sections[0].classList.add('visible');
    }

    // Scroll to Top 버튼
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollToTopBtn) {
        // 스크롤 시 버튼 표시/숨김
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // 버튼 클릭 시 맨 위로 스크롤
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
