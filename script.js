class CityWheel {
  constructor() {
    this.cities = [];
    this.selectedContinent = null;
    this.canvas = document.getElementById("wheelCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.isSpinning = false;
    this.currentRotation = 0;

    // 대륙별 도시 데이터 (안전한 여행 가능한 도시들)
    this.continentData = {
      asia: [
        "도쿄",
        "오사카",
        "교토",
        "후쿠오카",
        "나고야",
        "삿포로",
        "오키나와",
        "싱가포르",
        "타이베이",
        "홍콩",
        "마카오",
        "방콕",
        "푸켓",
        "치앙마이",
        "쿠알라룸푸르",
        "랑카위",
        "발리",
        "세부",
        "마닐라",
        "호치민",
        "하노이",
        "다낭",
        "부산",
        "제주도",
      ],
      europe: [
        "파리",
        "로마",
        "바르셀로나",
        "마드리드",
        "암스테르담",
        "베를린",
        "뮌헨",
        "빈",
        "프라하",
        "부다페스트",
        "리스본",
        "아테네",
        "취리히",
        "제네바",
        "코펜하겐",
        "스톡홀름",
        "오슬로",
        "헬싱키",
        "더블린",
        "런던",
        "에든버러",
        "브뤼셀",
        "바르샤바",
        "크라쿠프",
        "두브로브니크",
        "탈린",
      ],
      northamerica: [
        "뉴욕",
        "로스앤젤레스",
        "샌프란시스코",
        "시애틀",
        "밴쿠버",
        "토론토",
        "몬트리올",
        "보스턴",
        "시카고",
        "워싱턴 DC",
        "마이애미",
        "라스베가스",
        "샌디에이고",
        "포틀랜드",
        "덴버",
        "오스틴",
        "댈러스",
        "애틀랜타",
        "필라델피아",
        "샌안토니오",
      ],
      oceania: [
        "시드니",
        "멜버른",
        "브리즈번",
        "골드코스트",
        "오클랜드",
        "웰링턴",
        "크라이스트처치",
        "퀸즈타운",
        "애들레이드",
        "퍼스",
        "호바트",
        "케언스",
      ],
    };

    this.continentNames = {
      asia: "아시아",
      europe: "유럽",
      northamerica: "북미",
      oceania: "오세아니아",
    };

    this.init();
  }

  init() {
    // 대륙 버튼 이벤트 리스너
    document.querySelectorAll(".continent-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const continent = e.target.dataset.continent;
        this.selectContinent(continent);
      });
    });

    // 도시 추가 버튼 이벤트 리스너
    document
      .getElementById("addBtn")
      .addEventListener("click", () => this.addCity());

    // 엔터키로 도시 추가
    document.getElementById("cityInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addCity();
    });

    // 돌리기 버튼 이벤트 리스너
    document
      .getElementById("spinBtn")
      .addEventListener("click", () => this.spin());

    // 초기 상태 업데이트
    this.updateUI();
  }

  selectContinent(continent) {
    // 버튼 활성화 상태 업데이트
    document.querySelectorAll(".continent-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.continent === continent) {
        btn.classList.add("active");
      }
    });

    this.selectedContinent = continent;
    this.cities = [...this.continentData[continent]];
    this.currentRotation = 0;

    // 선택된 대륙 표시
    const selectedContinentEl = document.getElementById("selectedContinent");
    selectedContinentEl.textContent = `선택된 대륙: ${this.continentNames[continent]}`;

    this.updateUI();
    this.drawWheel();
  }

  addCity() {
    if (!this.selectedContinent) {
      alert("먼저 대륙을 선택해주세요!");
      return;
    }

    const input = document.getElementById("cityInput");
    const city = input.value.trim();

    if (!city) {
      alert("도시 이름을 입력해주세요!");
      return;
    }

    if (this.cities.includes(city)) {
      alert("이미 추가된 도시입니다!");
      return;
    }

    this.cities.push(city);
    input.value = "";
    this.updateUI();
    this.drawWheel();
  }

  removeCity(city) {
    this.cities = this.cities.filter((c) => c !== city);
    this.updateUI();
    this.drawWheel();
  }

  updateUI() {
    const list = document.getElementById("cityList");
    const spinBtn = document.getElementById("spinBtn");

    // 도시 목록 업데이트
    list.innerHTML = "";

    if (this.cities.length === 0) {
      list.innerHTML = '<li class="empty-message">대륙을 선택해주세요</li>';
      spinBtn.disabled = true;
    } else {
      this.cities.forEach((city) => {
        const li = document.createElement("li");
        li.className = "city-item";
        li.innerHTML = `
          <span>${city}</span>
          <button class="delete-btn" onclick="wheel.removeCity('${city}')">삭제</button>
        `;
        list.appendChild(li);
      });
      spinBtn.disabled = false;
    }
  }

  drawWheel() {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // 배경 지우기
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.cities.length === 0) {
      // 빈 돌림판 그리기
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#f0f0f0";
      ctx.fill();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#999";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("대륙을 선택하세요", centerX, centerY);
      return;
    }

    const anglePerSlice = (Math.PI * 2) / this.cities.length;
    const colors = this.generateColors(this.cities.length);

    // 각 조각 그리기
    this.cities.forEach((city, index) => {
      const startAngle = index * anglePerSlice + this.currentRotation;
      const endAngle = (index + 1) * anglePerSlice + this.currentRotation;

      // 조각 그리기
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 텍스트 그리기
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSlice / 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 3;
      ctx.fillText(city, radius * 0.3, 0);
      ctx.restore();
    });
  }

  generateColors(count) {
    const colors = [];
    const hueStep = 360 / count;

    for (let i = 0; i < count; i++) {
      const hue = (i * hueStep) % 360;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }

    return colors;
  }

  spin() {
    if (this.isSpinning || this.cities.length === 0) return;

    this.isSpinning = true;
    document.getElementById("spinBtn").disabled = true;
    document.getElementById("result").classList.remove("show");
    this.closeModal();

    // 랜덤 회전 각도 (최소 3바퀴 이상)
    const spins = 3 + Math.random() * 2; // 3~5바퀴
    const randomAngle = Math.random() * Math.PI * 2;
    const totalRotation =
      this.currentRotation + spins * Math.PI * 2 + randomAngle;

    // 최종 결과 미리 계산
    const finalRotation = totalRotation;
    const selectedCity = this.calculateResult(finalRotation);

    const startTime = Date.now();
    const duration = 5000; // 5초
    let resultShown = false;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 이징 함수 (강한 ease-out 효과 - 초반엔 빠르게, 나중에 천천히)
      // 지수를 높여서 더 강한 감속 효과
      const easeOut = 1 - Math.pow(1 - progress, 5);
      this.currentRotation =
        this.currentRotation + (totalRotation - this.currentRotation) * easeOut;

      this.drawWheel();

      // 85% 진행 시 결과 팝업 표시
      if (progress >= 0.85 && !resultShown) {
        this.showModal(selectedCity);
        resultShown = true;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 애니메이션 완료
        this.currentRotation = totalRotation;
        this.showResult();
        this.isSpinning = false;
        document.getElementById("spinBtn").disabled = false;
      }
    };

    animate();
  }

  calculateResult(rotation) {
    const normalizedRotation =
      ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const anglePerSlice = (Math.PI * 2) / this.cities.length;

    // 포인터는 위쪽(270도 또는 -90도)을 가리킴
    const pointerAngle = (Math.PI * 3) / 2; // 270도
    const adjustedAngle =
      (pointerAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2);

    const selectedIndex = Math.floor(adjustedAngle / anglePerSlice);
    return this.cities[selectedIndex];
  }

  showModal(city) {
    const modal = document.getElementById("resultModal");
    const cityName = document.getElementById("modalCityName");
    cityName.textContent = city;
    modal.classList.add("show");
  }

  closeModal() {
    const modal = document.getElementById("resultModal");
    modal.classList.remove("show");
  }

  showResult() {
    // 현재 포인터가 가리키는 도시 찾기
    const normalizedRotation =
      ((this.currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const anglePerSlice = (Math.PI * 2) / this.cities.length;

    // 포인터는 위쪽(270도 또는 -90도)을 가리킴
    const pointerAngle = (Math.PI * 3) / 2; // 270도
    const adjustedAngle =
      (pointerAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2);

    const selectedIndex = Math.floor(adjustedAngle / anglePerSlice);
    const selectedCity = this.cities[selectedIndex];

    // 결과 표시
    const resultElement = document.getElementById("result");
    resultElement.textContent = `🎉 ${selectedCity} 🎉`;
    resultElement.classList.add("show");
  }
}

// 국내 여행지 클래스 (힘 게이지 + 랜덤 다트 던지기)
class DomesticTravel {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.power = 0;
    this.powerInterval = null;
    this.isCharging = false;
    this.dartOverlay = null;
    this.selectedLocation = null;

    // 대한민국 지도 영역 (Canvas 좌표)
    this.koreaBounds = {
      minX: 200,
      maxX: 600,
      minY: 100,
      maxY: 800,
    };

    // 지역 데이터 (대략적인 좌표)
    this.regions = [
      { name: "서울", x: 300, y: 200 },
      { name: "인천", x: 250, y: 180 },
      { name: "수원", x: 320, y: 220 },
      { name: "용인", x: 330, y: 230 },
      { name: "가평", x: 340, y: 180 },
      { name: "양평", x: 350, y: 200 },
      { name: "춘천", x: 380, y: 160 },
      { name: "화천", x: 390, y: 170 },
      { name: "평창", x: 420, y: 220 },
      { name: "정선", x: 430, y: 230 },
      { name: "강릉", x: 450, y: 210 },
      { name: "속초", x: 460, y: 190 },
      { name: "단양", x: 380, y: 280 },
      { name: "대구", x: 450, y: 400 },
      { name: "포항", x: 480, y: 380 },
      { name: "안동", x: 440, y: 360 },
      { name: "부산", x: 520, y: 500 },
      { name: "전주", x: 300, y: 420 },
      { name: "군산", x: 280, y: 410 },
      { name: "부안", x: 270, y: 430 },
      { name: "태안", x: 260, y: 320 },
      { name: "보령", x: 280, y: 360 },
      { name: "여수", x: 400, y: 550 },
      { name: "순천", x: 390, y: 540 },
      { name: "담양", x: 360, y: 520 },
      { name: "목포", x: 320, y: 560 },
      { name: "제주도", x: 300, y: 750 },
    ];

    this.init();
  }

  init() {
    this.initMap();
    this.setupDartButton();
  }

  initMap() {
    this.canvas = document.getElementById("koreaMapCanvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.drawKoreaMap();

    this.dartOverlay = document.getElementById("dartOverlay");
  }

  drawKoreaMap() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 배경
    ctx.fillStyle = "#e8f4f8";
    ctx.fillRect(0, 0, width, height);

    // 대한민국 지도 경계 (간단한 형태)
    ctx.beginPath();
    ctx.moveTo(200, 100);
    ctx.lineTo(300, 120);
    ctx.lineTo(400, 150);
    ctx.lineTo(500, 200);
    ctx.lineTo(550, 300);
    ctx.lineTo(550, 450);
    ctx.lineTo(520, 550);
    ctx.lineTo(450, 600);
    ctx.lineTo(350, 650);
    ctx.lineTo(250, 680);
    ctx.lineTo(200, 700);
    ctx.lineTo(150, 680);
    ctx.lineTo(120, 600);
    ctx.lineTo(100, 500);
    ctx.lineTo(100, 350);
    ctx.lineTo(120, 250);
    ctx.lineTo(150, 150);
    ctx.closePath();

    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 지역 포인트 표시
    this.regions.forEach((region) => {
      ctx.beginPath();
      ctx.arc(region.x, region.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#f5576c";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 제주도
    ctx.beginPath();
    ctx.arc(300, 750, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(300, 750, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#f5576c";
    ctx.fill();
  }

  setupDartButton() {
    const btn = document.getElementById("throwDartBtn");
    if (!btn) return;

    // 마우스 다운
    btn.addEventListener("mousedown", () => {
      this.startCharging();
    });

    // 마우스 업
    btn.addEventListener("mouseup", () => {
      this.stopCharging();
    });

    // 마우스가 버튼 밖으로 나갔을 때
    btn.addEventListener("mouseleave", () => {
      if (this.isCharging) {
        this.stopCharging();
      }
    });

    // 터치 이벤트
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.startCharging();
    });

    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.stopCharging();
    });
  }

  startCharging() {
    if (this.isCharging) return;

    this.isCharging = true;
    this.power = 0;

    this.powerInterval = setInterval(() => {
      this.power = Math.min(this.power + 2, 100);
      this.updatePowerGauge();
    }, 30);
  }

  stopCharging() {
    if (!this.isCharging) return;

    this.isCharging = false;
    if (this.powerInterval) {
      clearInterval(this.powerInterval);
      this.powerInterval = null;
    }

    // 다트 던지기
    this.throwDart();

    // 힘 게이지 리셋
    setTimeout(() => {
      this.power = 0;
      this.updatePowerGauge();
    }, 2000);
  }

  updatePowerGauge() {
    const powerBar = document.getElementById("powerBar");
    const powerValue = document.getElementById("powerValue");

    if (powerBar) {
      powerBar.style.width = `${this.power}%`;

      // 힘에 따라 색상 변경
      if (this.power < 30) {
        powerBar.style.background = "#4caf50";
      } else if (this.power < 70) {
        powerBar.style.background = "#ff9800";
      } else {
        powerBar.style.background = "#f5576c";
      }
    }

    if (powerValue) {
      powerValue.textContent = `${Math.round(this.power)}%`;
    }
  }

  throwDart() {
    // 힘에 따라 랜덤 범위 조절
    const powerFactor = this.power / 100;
    const randomRange = 50 + 150 * (1 - powerFactor); // 힘이 높을수록 더 멀리

    // 랜덤 위치 생성 (대한민국 영역 내)
    const centerX = (this.koreaBounds.minX + this.koreaBounds.maxX) / 2;
    const centerY = (this.koreaBounds.minY + this.koreaBounds.maxY) / 2;

    let targetX, targetY;
    let attempts = 0;

    do {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * randomRange;
      targetX = centerX + Math.cos(angle) * distance;
      targetY = centerY + Math.sin(angle) * distance;
      attempts++;
    } while (
      (targetX < this.koreaBounds.minX ||
        targetX > this.koreaBounds.maxX ||
        targetY < this.koreaBounds.minY ||
        targetY > this.koreaBounds.maxY) &&
      attempts < 50
    );

    // 제한된 범위 내로 조정
    targetX = Math.max(
      this.koreaBounds.minX,
      Math.min(this.koreaBounds.maxX, targetX)
    );
    targetY = Math.max(
      this.koreaBounds.minY,
      Math.min(this.koreaBounds.maxY, targetY)
    );

    // 가장 가까운 지역 찾기
    let closestRegion = this.regions[0];
    let minDistance = Infinity;

    this.regions.forEach((region) => {
      const distance = Math.sqrt(
        Math.pow(targetX - region.x, 2) + Math.pow(targetY - region.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = region;
      }
    });

    // 다트 애니메이션
    this.animateDart(targetX, targetY, closestRegion.name);
  }

  animateDart(targetX, targetY, locationName) {
    const startX = this.canvas.width / 2;
    const startY = 50;

    const steps = 30;
    let currentStep = 0;

    this.dartOverlay.style.display = "block";
    this.dartOverlay.style.left = `${startX}px`;
    this.dartOverlay.style.top = `${startY}px`;

    const animate = () => {
      if (currentStep <= steps) {
        const ratio = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - ratio, 3);

        const currentX = startX + (targetX - startX) * easeOut;
        const currentY = startY + (targetY - startY) * easeOut;

        const rect = this.canvas.getBoundingClientRect();
        this.dartOverlay.style.left = `${
          rect.left + currentX * (rect.width / this.canvas.width)
        }px`;
        this.dartOverlay.style.top = `${
          rect.top + currentY * (rect.height / this.canvas.height)
        }px`;

        currentStep++;
        requestAnimationFrame(animate);
      } else {
        // 다트 도착
        this.showResult(targetX, targetY, locationName);
      }
    };

    animate();
  }

  showResult(x, y, locationName) {
    // 지도에 다트 마커 그리기
    this.ctx.beginPath();
    this.ctx.arc(x, y, 12, 0, Math.PI * 2);
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fill();
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // 펄스 효과
    let pulseRadius = 12;
    const pulse = () => {
      if (pulseRadius < 30) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 0, 0, ${1 - pulseRadius / 30})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        pulseRadius += 2;
        requestAnimationFrame(pulse);
      }
    };
    pulse();

    // 결과 표시
    this.selectedLocation = locationName;
    const resultElement = document.getElementById("domesticResult");
    resultElement.textContent = `🎯 ${locationName} 🎯`;
    resultElement.classList.add("show");

    // 다트 오버레이 숨기기
    setTimeout(() => {
      this.dartOverlay.style.display = "none";
    }, 1000);
  }
}

// 전역 변수로 wheel 인스턴스 생성
let wheel;
let domesticTravel;

// 페이지 로드 시 초기화
window.addEventListener("DOMContentLoaded", () => {
  wheel = new CityWheel();
  wheel.drawWheel();
  // domesticTravel = new DomesticTravel(); // 국내 여행지 비활성화

  // 모달 닫기 버튼 이벤트
  document.querySelector(".close-modal").addEventListener("click", () => {
    wheel.closeModal();
  });

  // 모달 배경 클릭 시 닫기
  document.getElementById("resultModal").addEventListener("click", (e) => {
    if (e.target.id === "resultModal") {
      wheel.closeModal();
    }
  });
});
