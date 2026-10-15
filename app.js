/**
 * ==========================================================================
 * 이마트 리버점 삼겹살 프로모션 웹사이트 스크립트 (Pure Vanilla JavaScript)
 * - 서버/빌드 도구 없이 브라우저에서 바로 실행되는 순수 자바스크립트
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. 상품 데이터 (기획안 & 설문조사 반영)
     -------------------------------------------------- */
  const PRODUCTS = [
    // 신선 쌈채소
    { id: 'lettuce', name: '아삭한 청상추', unit: '1봉 (150g)', price: 1980, category: 'vege', emoji: '🥬' },
    { id: 'perilla', name: '향긋한 깻잎', unit: '1봉 (30장)', price: 1480, category: 'vege', emoji: '🍃' },
    { id: 'mushroom', name: '구이용 모둠버섯', unit: '1팩 (새송이·팽이)', price: 2980, category: 'vege', emoji: '🍄' },
    { id: 'onion', name: '햇 달큰양파', unit: '1망 (1.5kg)', price: 3200, category: 'vege', emoji: '🧅' },
    { id: 'garlic', name: '국내산 깐마늘', unit: '1봉 (200g)', price: 2100, category: 'vege', emoji: '🧄' },
    { id: 'chili', name: '알싸한 청양고추', unit: '1봉 (100g)', price: 1500, category: 'vege', emoji: '🌶️' },

    // 양념 / 반찬
    { id: 'ssamjang', name: '고소한 마늘쌈장', unit: '1통 (450g)', price: 2480, category: 'seasoning', emoji: '🥣' },
    { id: 'kimchi', name: '종가집 맛김치', unit: '1봉 (500g)', price: 4500, category: 'seasoning', emoji: '🥗' },
    { id: 'wasabi', name: '생와사비 튜브', unit: '1개 (43g)', price: 2200, category: 'seasoning', emoji: '🌿' },

    // 음료 / 기타 식재료
    { id: 'sparkling', name: '플레인 탄산수 4입', unit: '350ml x 4캔', price: 2800, category: 'beverage', emoji: '🫧' },
    { id: 'coke', name: '제로 펩시콜라 6캔', unit: '355ml x 6입', price: 4980, category: 'beverage', emoji: '🥤' },
    { id: 'rice', name: '따끈한 즉석밥 3입', unit: '210g x 3개', price: 3980, category: 'beverage', emoji: '🍚' }
  ];

  // 메인 삼겹살 정보
  const PORK_ITEM = {
    id: 'pork',
    name: '국내산 삼겹살 500g',
    regularPrice: 13900,
    discountAmount: 2000,
    targetThreshold: 35000
  };

  // 장바구니 상태 (초기: 삼겹살 1팩 기본 담김)
  const cartState = {
    pork: 1
  };

  /* --------------------------------------------------
     2. D-Day 카운트다운 타이머
     - 행사 시작일: 2026년 11월 7일 토요일 09:00
     -------------------------------------------------- */
  const targetDate = new Date('2026-11-07T09:00:00+09:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minutesEl = document.getElementById('cdMinutes');
    const secondsEl = document.getElementById('cdSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* --------------------------------------------------
     3. 카드뉴스 캐러셀 / 슬라이더
     -------------------------------------------------- */
  const track = document.getElementById('cardCarouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
      goToSlide(slideIndex);
    });
  });

  // 모바일 터치 스와이프 지원
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        goToSlide(currentSlide + 1); // 다음 슬라이드
      } else {
        goToSlide(currentSlide - 1); // 이전 슬라이드
      }
    }
  }

  /* --------------------------------------------------
     4. 추천 상품 목록 렌더링 & 카테고리 필터
     -------------------------------------------------- */
  const itemsGrid = document.getElementById('itemsGrid');
  const catTabs = document.querySelectorAll('.cat-tab');
  let currentCategory = 'all';

  function renderProductList() {
    if (!itemsGrid) return;
    itemsGrid.innerHTML = '';

    const filtered = currentCategory === 'all' 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === currentCategory);

    filtered.forEach(product => {
      const qty = cartState[product.id] || 0;
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-top">
          <div class="item-emoji">${product.emoji}</div>
          <div class="item-info">
            <h4 class="item-name">${product.name}</h4>
            <span class="item-unit">${product.unit}</span>
            <div class="item-price">${product.price.toLocaleString()}원</div>
          </div>
        </div>
        <div class="quantity-controller" data-id="${product.id}">
          <button type="button" class="qty-btn minus-btn" aria-label="${product.name} 수량 감소">-</button>
          <span class="qty-display">${qty}</span>
          <button type="button" class="qty-btn plus-btn" aria-label="${product.name} 수량 증가">+</button>
        </div>
      `;
      itemsGrid.appendChild(card);
    });

    attachQuantityEvents();
  }

  // 카테고리 탭 클릭
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      renderProductList();
    });
  });

  /* --------------------------------------------------
     5. 장바구니 수량 조절 및 계산 로직
     -------------------------------------------------- */
  function attachQuantityEvents() {
    const controllers = document.querySelectorAll('.quantity-controller');
    controllers.forEach(ctrl => {
      const id = ctrl.dataset.id;
      const minusBtn = ctrl.querySelector('.minus-btn');
      const plusBtn = ctrl.querySelector('.plus-btn');

      // 기존 이벤트 중복 방지를 위해 cloneNode 혹은 단순 핸들러 연결
      minusBtn.onclick = (e) => {
        e.stopPropagation();
        updateItemQty(id, -1);
      };

      plusBtn.onclick = (e) => {
        e.stopPropagation();
        updateItemQty(id, 1);
      };
    });
  }

  function updateItemQty(id, delta) {
    const current = cartState[id] || 0;
    const next = Math.max(0, current + delta);

    if (next === 0) {
      delete cartState[id];
    } else {
      cartState[id] = next;
    }

    // UI 동기화
    updateCartUI();

    // 토스트 안내 (추가 시)
    if (delta > 0) {
      const name = id === 'pork' ? PORK_ITEM.name : (PRODUCTS.find(p => p.id === id)?.name || '상품');
      showToast(`🛒 ${name}이(가) 장바구니에 담겼습니다.`);
    }
  }

  // 삼겹살 컨트롤러 이벤트
  const porkHeroCard = document.getElementById('porkHeroCard');
  if (porkHeroCard) {
    const porkMinus = porkHeroCard.querySelector('.minus-btn');
    const porkPlus = porkHeroCard.querySelector('.plus-btn');

    porkMinus.addEventListener('click', () => updateItemQty('pork', -1));
    porkPlus.addEventListener('click', () => updateItemQty('pork', 1));
  }

  // 장바구니 비우기 버튼
  const btnClearCart = document.getElementById('btnClearCart');
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      if (confirm('장바구니를 모두 비우시겠습니까?')) {
        for (const key in cartState) {
          delete cartState[key];
        }
        updateCartUI();
        showToast('장바구니를 비웠습니다.');
      }
    });
  }

  /* --------------------------------------------------
     6. 실시간 장바구니 계산 및 UI 렌더링
     -------------------------------------------------- */
  function updateCartUI() {
    // 1) 삼겹살 수량 UI 업데이트
    const porkQtyDisplay = document.getElementById('porkQty');
    if (porkQtyDisplay) {
      porkQtyDisplay.textContent = cartState['pork'] || 0;
    }

    // 2) 상품 그리드 내부 수량 업데이트
    const gridControllers = itemsGrid.querySelectorAll('.quantity-controller');
    gridControllers.forEach(ctrl => {
      const id = ctrl.dataset.id;
      const display = ctrl.querySelector('.qty-display');
      if (display) {
        display.textContent = cartState[id] || 0;
      }
    });

    // 3) 금액 계산
    let subtotal = 0;
    let totalCount = 0;
    const cartItemsList = document.getElementById('cartItemsList');
    if (cartItemsList) cartItemsList.innerHTML = '';

    // 삼겹살 계산
    const porkCount = cartState['pork'] || 0;
    if (porkCount > 0) {
      const porkSum = porkCount * PORK_ITEM.regularPrice;
      subtotal += porkSum;
      totalCount += porkCount;

      if (cartItemsList) {
        const li = document.createElement('li');
        li.className = 'cart-item-row';
        li.innerHTML = `
          <span class="cart-item-name">🥩 ${PORK_ITEM.name}</span>
          <div class="cart-item-calc">
            <span class="cart-item-qty">${porkCount}팩</span>
            <span class="cart-item-price">${porkSum.toLocaleString()}원</span>
          </div>
        `;
        cartItemsList.appendChild(li);
      }
    }

    // 연계 상품들 계산
    PRODUCTS.forEach(prod => {
      const count = cartState[prod.id] || 0;
      if (count > 0) {
        const itemSum = count * prod.price;
        subtotal += itemSum;
        totalCount += count;

        if (cartItemsList) {
          const li = document.createElement('li');
          li.className = 'cart-item-row';
          li.innerHTML = `
            <span class="cart-item-name">${prod.emoji} ${prod.name}</span>
            <div class="cart-item-calc">
              <span class="cart-item-qty">${count}개</span>
              <span class="cart-item-price">${itemSum.toLocaleString()}원</span>
            </div>
          `;
          cartItemsList.appendChild(li);
        }
      }
    });

    // 빈 장바구니 처리
    if (totalCount === 0 && cartItemsList) {
      cartItemsList.innerHTML = `<li class="cart-empty-text">장바구니에 담긴 상품이 없습니다.</li>`;
    }

    // 4) 35,000원 혜택 달성 여부 판별
    const isThresholdMet = subtotal >= PORK_ITEM.targetThreshold;
    const hasPork = porkCount > 0;
    let discount = 0;

    // 삼겹살이 담겨 있고 35,000원 이상일 때 2,000원 할인 (영수증당 1팩 한정)
    if (isThresholdMet && hasPork) {
      discount = PORK_ITEM.discountAmount;
    }

    const finalTotal = Math.max(0, subtotal - discount);

    // 5) 게이지 및 메시지 업데이트
    const progressPercentEl = document.getElementById('progressPercent');
    const progressBarFill = document.getElementById('progressBarFill');
    const msgIcon = document.getElementById('msgIcon');
    const msgText = document.getElementById('msgText');
    const progressMessageBox = document.getElementById('progressMessageBox');
    const benefitUnlockedBanner = document.getElementById('benefitUnlockedBanner');

    const progressRatio = Math.min(100, Math.round((subtotal / PORK_ITEM.targetThreshold) * 100));

    if (progressPercentEl) progressPercentEl.textContent = `${progressRatio}%`;
    if (progressBarFill) progressBarFill.style.width = `${progressRatio}%`;

    if (isThresholdMet) {
      if (hasPork) {
        if (progressMessageBox) progressMessageBox.className = 'progress-message-box achieved';
        if (msgIcon) msgIcon.textContent = '🎉';
        if (msgText) msgText.innerHTML = `<strong>35,000원 달성!</strong> 삼겹살 2,000원 할인이 적용되었습니다!`;
        if (benefitUnlockedBanner) benefitUnlockedBanner.classList.add('active');
      } else {
        if (progressMessageBox) progressMessageBox.className = 'progress-message-box';
        if (msgIcon) msgIcon.textContent = '🥩';
        if (msgText) msgText.innerHTML = `<strong>35,000원 달성!</strong> 삼겹살을 담으시면 2,000원 할인이 적용됩니다!`;
        if (benefitUnlockedBanner) benefitUnlockedBanner.classList.remove('active');
      }
    } else {
      const remaining = PORK_ITEM.targetThreshold - subtotal;
      if (progressMessageBox) progressMessageBox.className = 'progress-message-box';
      if (msgIcon) msgIcon.textContent = '💡';
      if (msgText) msgText.innerHTML = `<strong>${remaining.toLocaleString()}원</strong> 더 담으시면 삼겹살 2,000원 할인!`;
      if (benefitUnlockedBanner) benefitUnlockedBanner.classList.remove('active');
    }

    // 6) 텍스트 금액 업데이트
    const cartTotalCount = document.getElementById('cartTotalCount');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const discountAmount = document.getElementById('discountAmount');
    const finalTotalAmount = document.getElementById('finalTotalAmount');

    if (cartTotalCount) cartTotalCount.textContent = totalCount;
    if (subtotalAmount) subtotalAmount.textContent = `${subtotal.toLocaleString()}원`;
    if (discountAmount) discountAmount.textContent = `-${discount.toLocaleString()}원`;
    if (finalTotalAmount) finalTotalAmount.textContent = `${finalTotal.toLocaleString()}원`;

    // 7) 모바일 하단 Sticky Bar 동기화
    const mobileTotal = document.getElementById('mobileTotal');
    const mobileDiscount = document.getElementById('mobileDiscount');
    const mobileStatusBadge = document.getElementById('mobileStatusBadge');

    if (mobileTotal) mobileTotal.textContent = `${finalTotal.toLocaleString()}원`;
    if (mobileDiscount) {
      if (discount > 0) {
        mobileDiscount.textContent = `(삼겹살 -2,000원 적용됨)`;
        mobileDiscount.style.color = '#059669';
      } else {
        mobileDiscount.textContent = `(35,000원 채우면 2,000원 할인)`;
        mobileDiscount.style.color = '#d97706';
      }
    }
    if (mobileStatusBadge) {
      if (isThresholdMet && hasPork) {
        mobileStatusBadge.textContent = '🎉 2,000원 할인 적용 완료';
        mobileStatusBadge.style.color = '#059669';
      } else {
        const remaining = Math.max(0, PORK_ITEM.targetThreshold - subtotal);
        mobileStatusBadge.textContent = remaining > 0 ? `${remaining.toLocaleString()}원 더 담기` : '삼겹살 담고 할인받기';
        mobileStatusBadge.style.color = '#ea580c';
      }
    }
  }

  /* --------------------------------------------------
     7. 꿀조합 카드 일괄 담기 연동
     -------------------------------------------------- */
  const quickAddBtns = document.querySelectorAll('.btn-quick-add');
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemIds = btn.dataset.items.split(',');
      itemIds.forEach(id => {
        cartState[id] = (cartState[id] || 0) + 1;
      });
      updateCartUI();
      showToast('🥗 꿀조합 세트가 장바구니에 담겼습니다!');

      // 계산기 섹션으로 부드럽게 스크롤
      const simSection = document.getElementById('simulator');
      if (simSection) {
        simSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------
     8. FAQ 아코디언 인터랙션
     -------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // 다른 아코디언은 닫기 (깔끔한 UI)
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // 현재 클릭한 항목 토글
      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------------------------------------
     9. 토스트 알림 헬퍼
     -------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  /* --------------------------------------------------
     10. 지도 탭 전환 (실시간 구글 지도 vs 랜드마크 약도)
     -------------------------------------------------- */
  function initMapTabs() {
    const tabBtns = document.querySelectorAll('.map-tab-btn');
    const realMap = document.getElementById('realMapContainer');
    const schematicMap = document.getElementById('schematicMapContainer');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.dataset.target;
        if (target === 'realMap') {
          if (realMap) realMap.classList.add('active');
          if (schematicMap) schematicMap.classList.remove('active');
        } else {
          if (schematicMap) schematicMap.classList.add('active');
          if (realMap) realMap.classList.remove('active');
        }
      });
    });
  }

  /* --------------------------------------------------
     11. 티맵(TMAP) 내비 길찾기 핸들러
     -------------------------------------------------- */
  function initTmapNavi() {
    const btnTmap = document.getElementById('btnTmapNavi');
    const tmapModal = document.getElementById('tmapModal');
    const btnCloseTmap = document.getElementById('btnCloseTmapModal');

    if (!btnTmap) return;

    btnTmap.addEventListener('click', () => {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const tmapUrl = 'tmap://route?goalname=%EC%9D%B4%EB%A7%88%ED%8A%B8%EC%97%B0%EC%A0%9C%EC%A0%90&goalx=129.0831&goaly=35.1802';

      if (isMobile) {
        // 모바일 기기에서는 티맵 앱 바로 실행 시도
        window.location.href = tmapUrl;
        setTimeout(() => {
          // 티맵 앱이 설치되어 있지 않은 경우 모달 팝업으로 대체
          if (tmapModal) tmapModal.classList.add('active');
        }, 1500);
      } else {
        // PC 브라우저에서는 길찾기 안내 모달 팝업 표시
        if (tmapModal) tmapModal.classList.add('active');
      }
    });

    if (btnCloseTmap && tmapModal) {
      btnCloseTmap.addEventListener('click', () => {
        tmapModal.classList.remove('active');
      });
      tmapModal.addEventListener('click', (e) => {
        if (e.target === tmapModal) tmapModal.classList.remove('active');
      });
    }
  }

  /* --------------------------------------------------
     12. [기능 A] 모바일 할인 쿠폰 & 바코드 모달 인터랙션
     -------------------------------------------------- */
  function initCouponModal() {
    const couponModal = document.getElementById('couponModal');
    const btnOpenCoupon = document.getElementById('btnOpenCoupon');
    const navCouponBtn = document.getElementById('navCouponBtn');
    const btnCloseModal = document.getElementById('btnCloseCouponModal');
    const btnCloseSub = document.getElementById('btnCloseCouponSub');
    const btnSaveCoupon = document.getElementById('btnSaveCoupon');
    const couponStatusTag = document.getElementById('couponStatusTag');

    function openModal() {
      if (!couponModal) return;

      // 35,000원 충족 여부 체크
      let subtotal = 0;
      const porkCount = cartState['pork'] || 0;
      if (porkCount > 0) subtotal += porkCount * PORK_ITEM.regularPrice;
      PRODUCTS.forEach(p => {
        const c = cartState[p.id] || 0;
        if (c > 0) subtotal += c * p.price;
      });

      const isAchieved = subtotal >= PORK_ITEM.targetThreshold && porkCount > 0;

      if (couponStatusTag) {
        if (isAchieved) {
          couponStatusTag.textContent = '✓ 사용 가능 (2,000원 할인 적용)';
          couponStatusTag.style.background = '#10b981';
          couponStatusTag.style.color = '#ffffff';
        } else {
          couponStatusTag.textContent = '조건 미달성 (장보기 35,000원 필요)';
          couponStatusTag.style.background = '#ef4444';
          couponStatusTag.style.color = '#ffffff';
          showToast('💡 장바구니 35,000원을 채우시면 즉시 사용하실 수 있습니다.');
        }
      }

      couponModal.classList.add('active');
      couponModal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      if (!couponModal) return;
      couponModal.classList.remove('active');
      couponModal.setAttribute('aria-hidden', 'true');
    }

    if (btnOpenCoupon) btnOpenCoupon.addEventListener('click', openModal);
    if (navCouponBtn) navCouponBtn.addEventListener('click', openModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCloseSub) btnCloseSub.addEventListener('click', closeModal);

    // 배경 클릭 시 닫기
    if (couponModal) {
      couponModal.addEventListener('click', (e) => {
        if (e.target === couponModal) closeModal();
      });
    }

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        if (document.getElementById('tmapModal')) {
          document.getElementById('tmapModal').classList.remove('active');
        }
      }
    });

    // 쿠폰 저장 / 캡처 안내
    if (btnSaveCoupon) {
      btnSaveCoupon.addEventListener('click', () => {
        showToast('📸 화면을 캡처해 두시면 결제 시 편리하게 바코드를 제시할 수 있습니다!');
      });
    }
  }

  /* --------------------------------------------------
     13. 주소 복사 기능
     -------------------------------------------------- */
  function initAddressCopy() {
    const btnCopy = document.getElementById('btnCopyAddress');
    const addressText = document.getElementById('storeAddressText');
    if (!btnCopy || !addressText) return;

    btnCopy.addEventListener('click', () => {
      const textToCopy = addressText.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('📋 매장 주소가 복사되었습니다!');
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });

    function fallbackCopyText(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('📋 매장 주소가 복사되었습니다!');
      } catch (e) {
        alert('주소: ' + text);
      }
      document.body.removeChild(textarea);
    }
  }

  /* --------------------------------------------------
     14. 초기 실행
     -------------------------------------------------- */
  renderProductList();
  updateCartUI();
  initMapTabs();
  initTmapNavi();
  initCouponModal();
  initAddressCopy();

});


