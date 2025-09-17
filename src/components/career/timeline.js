console.log('Career Timeline 초기화 시작');

const careerData = {
  publishing: [
    {
      company: '캐시맵주식회사',
      startDate: '2024-01-29',
      endDate: '2024-11-08',
      color: '#10B981',
      duration: '11개월',
    },
    {
      company: '주식회사하이브랩',
      startDate: '2023-07-03',
      endDate: '2023-10-03',
      color: '#F59E0B',
      duration: '4개월',
    },
    {
      company: '(주)퀀텀에이아이',
      startDate: '2023-03-02',
      endDate: '2023-04-29',
      color: '#EF4444',
      duration: '2개월',
    },
    {
      company: '(주)에스투퍼블리싱',
      startDate: '2019-05-01',
      endDate: '2022-02-01',
      color: '#8B5CF6',
      duration: '2년 10개월',
    },
  ],
  publishingElse: [
    {
      company: '캐시맵주식회사',
      startDate: '2024-01-29',
      endDate: '2024-11-08',
      color: '#10B981',
      duration: '11개월',
    },
    {
      company: '주식회사하이브랩',
      startDate: '2023-07-03',
      endDate: '2023-10-03',
      color: '#F59E0B',
      duration: '4개월',
    },
    {
      company: '(주)퀀텀에이아이',
      startDate: '2023-03-02',
      endDate: '2023-04-29',
      color: '#EF4444',
      duration: '2개월',
    },
    {
      company: '(주)에스투퍼블리싱',
      startDate: '2019-05-01',
      endDate: '2022-02-01',
      color: '#8B5CF6',
      duration: '2년 10개월',
    },
    {
      company: '주식회사원더풀플랫폼',
      startDate: '2017-12-18',
      endDate: '2018-07-26',
      color: '#3B82F6',
      duration: '8개월',
    },
    {
      company: '주식회사 빅밸류',
      startDate: '2016-11-07',
      endDate: '2017-08-11',
      color: '#06B6D4',
      duration: '10개월',
    },
  ],
};

function parseDate(dateString) {
  return new Date(dateString);
}

function calculateMonthsDifference(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const monthsDiff =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;

  return monthsDiff;
}

function calculateTotalCareerPeriod(companies, calculationMode = 'all') {
  console.log('경력 기간 계산 시작:', companies, '계산 모드:', calculationMode);

  let totalMonths = 0;
  let calculationCompanies = [];

  if (calculationMode === 'publishing') {
    // 퍼블리싱 모드: 캐시맵주식회사 + (주)에스투퍼블리싱만 계산
    calculationCompanies = companies.filter(
      (company) =>
        company.company === '캐시맵주식회사' ||
        company.company === '(주)에스투퍼블리싱'
    );
  } else if (calculationMode === 'publishingElse') {
    // 퍼블리싱+a 모드: 애로우잉글리시주식회사 제외하고 계산 (이미 데이터에서 제거됨)
    calculationCompanies = companies;
  } else {
    // 기본 모드: 모든 회사 계산
    calculationCompanies = companies;
  }

  calculationCompanies.forEach((company) => {
    const monthsDiff = calculateMonthsDifference(
      company.startDate,
      company.endDate
    );
    totalMonths += monthsDiff;
    console.log(`${company.company}: ${monthsDiff}개월 (계산에 포함)`);
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  console.log(
    `총 경력: ${years}년 ${months}개월 (총 ${totalMonths}개월) - 계산 회사 수: ${calculationCompanies.length}`
  );
  return { years, months };
}

function updateCareerDisplay(companies, calculationMode = 'all') {
  const { years, months } = calculateTotalCareerPeriod(
    companies,
    calculationMode
  );

  const careerYearElement = document.querySelector('.career-year');
  const careerMonthElement = document.querySelector('.career-month');

  if (careerYearElement && careerMonthElement) {
    careerYearElement.textContent = years;
    careerMonthElement.textContent = months;
    console.log('경력 표시 업데이트 완료');
  }
}

function calculateTimelineSegments(companies) {
  // 전체 기간 계산 (2015.03 ~ 2024.11)
  const totalStart = parseDate('2015-03-01');
  const totalEnd = parseDate('2024-11-30');
  const totalMonths = calculateMonthsDifference('2015-03-01', '2024-11-30');

  const segments = [];
  let currentPosition = 0;

  // 시간순으로 정렬
  const sortedCompanies = [...companies].sort(
    (a, b) => parseDate(a.startDate) - parseDate(b.startDate)
  );

  sortedCompanies.forEach((company) => {
    const companyStart = parseDate(company.startDate);
    const companyEnd = parseDate(company.endDate);

    // 회사 시작 전 공백 기간 계산
    const gapStart = new Date(
      totalStart.getTime() + currentPosition * 30.44 * 24 * 60 * 60 * 1000
    );
    const gapMonths = Math.max(
      0,
      (companyStart.getFullYear() - gapStart.getFullYear()) * 12 +
        (companyStart.getMonth() - gapStart.getMonth())
    );

    // 공백 기간 추가
    if (gapMonths > 0) {
      const gapPercentage = (gapMonths / totalMonths) * 100;
      segments.push({
        type: 'gap',
        width: gapPercentage,
        color: '#e2e8f0',
      });
      currentPosition += gapMonths;
    }

    // 회사 근무 기간 추가
    const companyMonths = calculateMonthsDifference(
      company.startDate,
      company.endDate
    );
    const companyPercentage = (companyMonths / totalMonths) * 100;

    segments.push({
      type: 'company',
      company: company,
      width: companyPercentage,
      color: company.color,
      months: companyMonths,
    });

    currentPosition += companyMonths;
  });

  // 마지막 공백 기간 처리
  const remainingMonths = totalMonths - currentPosition;
  if (remainingMonths > 0) {
    const remainingPercentage = (remainingMonths / totalMonths) * 100;
    segments.push({
      type: 'gap',
      width: remainingPercentage,
      color: '#e2e8f0',
    });
  }

  return segments;
}

function createTimelineBar(containerId, companies) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container not found: ${containerId}`);
    return;
  }

  container.innerHTML = '';

  const segments = calculateTimelineSegments(companies);

  segments.forEach((segment) => {
    const segmentElement = document.createElement('span');
    segmentElement.className = 'timeline-segment';
    segmentElement.style.width = `${segment.width}%`;
    segmentElement.style.backgroundColor = segment.color;

    if (segment.type === 'company') {
      segmentElement.title = `${segment.company.company} (${segment.company.duration})`;
    }

    container.appendChild(segmentElement);
  });
}

function createCompaniesList(containerId, companies) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container not found: ${containerId}`);
    return;
  }

  container.innerHTML = '';

  companies.forEach((company) => {
    const listItem = document.createElement('li');
    listItem.className = 'career-company-item';

    const startDate = parseDate(company.startDate);
    const endDate = parseDate(company.endDate);

    const formatDate = (date) => {
      return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}월 ${String(date.getDate()).padStart(2, '0')}일`;
    };

    listItem.innerHTML = `
                    <span class="company-color-indicator" style="background-color: ${
                      company.color
                    }"></span>
                    <div class="company-info">
                      <div>
                        <span class="company-name">${company.company}</span>
                        <p class="company-period">${formatDate(
                          startDate
                        )} - ${formatDate(endDate)}</p>
                      </div>
                      <span class="company-duration">${company.duration}</span>
                    </div>
                `;

    container.appendChild(listItem);
  });
}

function initializeTimelines() {
  console.log('타임라인 초기화 시작');

  // 퍼블리싱 타임라인 생성
  createTimelineBar('publishingTimelineBar', careerData.publishing);
  createCompaniesList('publishingCompaniesList', careerData.publishing);

  // 퍼블리싱+a 타임라인 생성
  createTimelineBar('publishingElseTimelineBar', careerData.publishingElse);
  createCompaniesList('publishingElseCompaniesList', careerData.publishingElse);

  console.log('타임라인 초기화 완료');
}

function handleRadioChange() {
  console.log('라디오 버튼 변경 이벤트 발생');

  const publishingOnlyRadio = document.getElementById('career-publishing-only');
  const publishingElseRadio = document.getElementById('career-publishing-else');

  const publishingGraph = document.querySelector('.graph-type-publishing');
  const publishingElseGraph = document.querySelector(
    '.graph-type-publishing-else'
  );

  if (publishingOnlyRadio?.checked) {
    console.log('퍼블리싱 모드 선택');
    publishingGraph?.classList.add('show');
    publishingElseGraph?.classList.remove('show');
    // 캐시맵주식회사 + (주)에스투퍼블리싱만 계산
    updateCareerDisplay(careerData.publishing, 'publishing');
  } else if (publishingElseRadio?.checked) {
    console.log('퍼블리싱+a 모드 선택');
    publishingGraph?.classList.remove('show');
    publishingElseGraph?.classList.add('show');
    // 애로우잉글리시주식회사 제외하고 계산 (이미 데이터에서 제거됨)
    updateCareerDisplay(careerData.publishingElse, 'publishingElse');
  }
}

function initializeEventListeners() {
  console.log('이벤트 리스너 초기화');

  const publishingOnlyRadio = document.getElementById('career-publishing-only');
  const publishingElseRadio = document.getElementById('career-publishing-else');

  if (publishingOnlyRadio && publishingElseRadio) {
    publishingOnlyRadio.addEventListener('change', handleRadioChange);
    publishingElseRadio.addEventListener('change', handleRadioChange);

    // 초기 상태 설정
    handleRadioChange();
    console.log('이벤트 리스너 설정 완료');
  } else {
    console.error('라디오 버튼 요소를 찾을 수 없습니다');
  }
}

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM 로드 완료, 초기화 시작');

  initializeTimelines();
  initializeEventListeners();

  console.log('Career Timeline 초기화 완료');
});
