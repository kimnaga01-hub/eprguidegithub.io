// EPR 법령·제도 요약(참고용) - 챗봇이 참고할 기본 베이스
const EPR_KNOWLEDGE_SUMMARY = [
    "1) 법적 근거: 「자원의 절약과 재활용촉진에 관한 법률」 및 같은 법 시행령·고시.",
    "2) 재활용 의무대상 제품: 전지류, 타이어, 윤활유, 형광등 등.",
    "3) 재활용 의무대상 포장재: 종이팩, 금속캔, 유리병, 합성수지(플라스틱) 재질 포장재 등.",
    "4) 기본 구조: 의무대상 품목을 취급하는 제조·수입업자는 매년 출고·수입 실적을 신고하고, 법에서 정한 재활용 의무를 이행하거나 분담금을 납부해야 함.",
    "5) 세부 기준(톤수, 매출액, 수입액, 면제 요건 등)은 자주 개정될 수 있으므로, 항상 최신 법령과 한국환경공단·환경부 안내를 확인해야 함."
].join('\\n');

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
            label: "EPR 대상 제품(전지류, 타이어, 윤활유, 형광등 등)",
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
                { value: 'product', text: '제품 (타이어, 전지, 형광등 등)', icon: '🔋' }
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
                desc: "타이어, 전지, 형광등 등 '제18조 제품'을 제조/수입하는 경우, 매출액 규모와 관계없이 대상이 될 수 있습니다.",
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

    // Improvement Suggestions Data
    const improvementSuggestions = {
        // PET Bottle
        'pet_body': '유색 페트병은 재활용이 어렵습니다. 무색 페트병으로 변경을 권장합니다.',
        'pet_body_pvc': 'PVC 재질 용기는 재활용이 불가능합니다. PET 재질로 변경하세요.',
        'pet_label': 'PVC 라벨이나 일반 접착제는 재활용을 방해합니다. 절취선이 있는 라벨이나 수분리 접착제로 변경하세요.',
        'pet_cap': '금속 마개는 재활용이 불가능합니다. 몸체와 같은 재질이나 분리 가능한 플라스틱 마개로 변경하세요.',

        // PSP
        'psp_body': '유색이나 코팅된 트레이는 재활용이 어렵습니다. 흰색 단일 재질로 변경하세요.',
        'psp_label': 'PVC 라벨이나 분리 불가능한 라벨은 피해주세요. 종이 라벨이나 직접 인쇄 방식을 권장합니다.',
        'psp_cap': '이물질이 포함된 잡자재는 제거하거나 분리 가능한 구조로 변경해야 합니다.',

        // Single Material Container
        'single_body': 'PVC 재질은 재활용이 매우 어렵습니다. PE, PP, PS 등 단일 재질로 변경하세요.',
        'single_label': 'PVC 라벨은 사용을 지양하고, 몸체와 동일한 재질이나 분리 가능한 라벨을 사용하세요.',
        'single_cap': '금속 마개 등 분리 불가능한 잡자재는 재활용 등급을 낮춥니다. 분리 가능한 구조로 개선하세요.',

        // Film/Sheet
        'film_body': '알루미늄이 두껍게 포함되거나 PVC가 섞인 재질은 재활용이 어렵습니다. 단일 재질(PE/PP)로 변경하세요.',
        'film_label': '분리 불가능한 라벨 대신 직접 인쇄하거나 분리 가능한 스티커를 사용하세요.',
        'film_cap': '분리 불가능한 마개는 재활용을 방해합니다. 별도 재질이라도 분리가 쉬운 구조로 변경하세요.',

        // Glass
        'glass_body': '무색, 갈색, 녹색 이외의 색상은 재활용이 어렵습니다. 표준 색상(무색/갈색/녹색)을 사용하세요.',
        'glass_label': 'PVC 계열 라벨은 재활용 공정에서 문제를 일으킵니다. 종이 등 비 PVC 계열로 변경하세요.',
        'glass_cap': '접착제를 사용하여 분리가 안 되는 마개는 피하고, 분리 가능한 금속/플라스틱 마개를 사용하세요.',

        // Paper Pack
        'paper_body': '알루미늄이 첩합된 멸균팩은 일반 팩보다 재활용이 까다롭습니다. 가능하다면 일반 팩 구조로 변경하세요.',
        'paper_label': '분리 불가능한 라벨은 재활용 품질을 떨어뜨립니다. 직접 인쇄하거나 제거 쉬운 라벨을 사용하세요.',
        'paper_cap': '분리 불가능한 잡자재는 재활용을 어렵게 합니다. 제거하거나 분리 가능한 구조로 변경하세요.'
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
                        const li = document.createElement('li');
                        li.textContent = improvementSuggestions[key];
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
});
// Chatbot Logic
document.addEventListener('DOMContentLoaded', () => {
    // 🔑 하드코딩된 API 키는 사용하지 않고, 사용자가 입력한 키만 사용합니다.
    const HARDCODED_API_KEY = '';

    const chatContainer = document.getElementById('chatbot-container');
    const openBtn = document.getElementById('open-chat-btn');
    const closeBtn = document.getElementById('close-chat-btn');
    const sendBtn = document.getElementById('send-msg-btn');
    const chatInput = document.getElementById('chat-input');
    const messagesArea = document.getElementById('chat-messages');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveKeyBtn = document.getElementById('save-api-key-btn');

    // Toggle Chat
    openBtn.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
        openBtn.classList.add('hidden');
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        openBtn.classList.remove('hidden');
    });

    // API Key Management (localStorage에 영구 저장)
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }

    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('openai_api_key', key);
            alert('API Key가 이 브라우저에 영구 저장되었습니다.');
        }
    });

    // Send Message
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        const text = chatInput.value.trim();
        let apiKey = HARDCODED_API_KEY || localStorage.getItem('openai_api_key');

        if (!text) return;
        if (!apiKey) {
            addMessage('bot', '⚠️ OpenAI API Key를 먼저 입력하고 저장해주세요.');
            return;
        }

        // Add User Message
        addMessage('user', text);
        chatInput.value = '';

        // 1차: 규모 미만/면제 기준 질문이면, 로컬 표로 직접 답변
        const localAnswer = handleLocalSizeQuery(text);
        if (localAnswer) {
            addMessage('bot', localAnswer);
            return;
        }

        chatInput.disabled = true;
        sendBtn.disabled = true;

        // Loading Indicator
        const loadingId = addMessage('bot', '생각 중...');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content:
                                "당신은 한국의 생산자책임재활용(EPR) 제도와 포장재 재질·구조 평가 제도에 대한 안내 챗봇입니다. " +
                                "아래는 참고용 요약 자료입니다:\n\n" +
                                EPR_KNOWLEDGE_SUMMARY + "\n\n" +
                                "모든 답변에서 다음 원칙을 반드시 지키세요:\n" +
                                "1) 법령의 구체적인 숫자 기준(톤수, 매출액, 수입액, 세부 면제 기준 등)을 임의로 추측하거나 만들어내지 마세요.\n" +
                                "2) 사용자가 정확한 기준이나 수치를 물어보면, 반드시 '정확한 기준은 「자원의 절약과 재활용촉진에 관한 법률」, 같은 법 시행령·고시 및 한국환경공단 안내를 통해 확인해야 한다'는 문장을 포함해 답변하세요.\n" +
                                "3) 가능한 경우에는 개념적인 구조(의무대상 / 규모 미만 / 면제 가능성 등)와 절차, 주의사항 위주로 설명하세요."
                        },
                        { role: "user", content: text }
                    ],
                    max_tokens: 500
                })
            });

            const data = await response.json();

            // Remove Loading
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();

            if (data.error) {
                addMessage('bot', `오류 발생: ${data.error.message}`);
            } else {
                const reply = data.choices[0].message.content;
                addMessage('bot', reply);
            }

        } catch (error) {
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            addMessage('bot', `네트워크 오류가 발생했습니다: ${error.message}`);
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }

    function addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;
        div.textContent = text;

        // Unique ID for loading message
        const id = 'msg-' + Date.now();
        div.id = id;

        messagesArea.appendChild(div);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return id;
    }
});
