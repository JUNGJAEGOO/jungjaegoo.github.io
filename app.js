/* ============================================================
   REEL THOUGHTS — app.js
   Handles: localStorage, sample data, add/delete, filter, stars
   ============================================================ */

'use strict';

/* ---------- Sample Data ---------- */
const SAMPLE_MOVIES = [
  {
    id: 'movie-1781425104935',
    title: '아마데우스',
    year: 1984,
    genre: '음악',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TJs3VnpwzHpkFOl9yWigHTN5NyTC_CyAaM_xH1yNrRPN4jqA2IUcm2xzh3avBxTpqHIOfh4iaJgKwb1D6IjW8Ec982VdgW6zY6C6MB-VYJVykeXFG7kPI5dpuMCydnKpGrgJISQKLTmnQB6TtQFsGFM.webp',
    rating: 5,
    review: '음악영화의 품격',
    createdAt: '2026-06-14T08:18:24.935Z'
  },
  {
    id: 'movie-1781424952955',
    title: '양들의 침',
    year: 1991,
    genre: '스릴러',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TNOm9104DLx-9cKyEmq883f-MK1kv71GPMeTF0U3dvut9PNWWl0pmQ0IuaD85px8bhHQiWoueO-hhXBsiNVzCCETmlTYUym1bJ6Y1k4yg8ZITcqSXJIxvHXiTMOLj1I-Cs3XNg0CGhjkvZ4fu0plvmU.webp',
    rating: 5,
    review: '스릴러의 정석, 정점',
    createdAt: '2026-06-14T08:15:52.955Z'
  },
  {
    id: 'movie-1781424906115',
    title: '프로젝트 헤일메리',
    year: 2026,
    genre: 'SF',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TMbs2K_uhbazErsJA-DJS7lkmTZjXtqAExHYHSP0Yb40kpko8QE13jsgzjCVHATZKY3naIF_FXRSE8G9LXWGZWras_p7rJ9fHHbWNIQwO3vP11uK89sFT60VwD1lpDM4nrV5FqACCAiw0Bh9yuQv8js.webp',
    rating: 4,
    review: '돌아올 수 없는 편도 비행선을 탄 라이언 고슬링의 고군분투',
    createdAt: '2026-06-14T08:15:06.115Z'
  },
  {
    id: 'movie-1781424775743',
    title: '왕의 남자',
    year: 2005,
    genre: '드라마',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TH0oICyaqDwXOzAF1aedjW-IUy26_9MCmd77A0FydJ0KTPX5wPcwgjkj6HvRNKI3A2MXRVZxs__V9sJ4vA8H7ouQ9fYF8pZUyraCnn6BtUxme0VNd16Pyo23fJ24ACUPwwkOnLuEu6aij4ZFSoUH9bY.webp',
    rating: 4,
    review: '대한민국 천만 영화의 자부심',
    createdAt: '2026-06-14T08:12:55.743Z'
  },
  {
    id: 'movie-1781424722328',
    title: '어벤져스 : 인피니티 워',
    year: 2018,
    genre: '히어로',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TD_72GCp-oS_331maG8l6sbXWaaPD-_7-DlPsNw6Q8FemogTmqZeT4O2oz1rTal7ojSTNRz6guzIb0_8lltBxY3w3rAfJlNVFEn3ti_eUhlmCdC096o1Pv7yPsKv-YcC8vAbk1rCnhGoz6N6udk4ImY.webp',
    rating: 4,
    review: '히어로물이 보여줄 수 있는 모든 것',
    createdAt: '2026-06-14T08:12:02.328Z'
  },
  {
    id: 'movie-1781424676768',
    title: '어벤져스 : 엔드게임',
    year: 2019,
    genre: '히어로',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TLv3mFmwPGsaWg4UFgV_1BoH06HtmfBKcQ2ivm8skyqhj1lv0UgNZ4LhXWCQ_iWpN2wNsYFcHcUVzhNaVhIkdvwrdPhy13d5qGuvwSz4pqVX5fRkxoKl7f9X8ffVBChoz12YEQBiFaQ4sBgT38qgmuQ.webp',
    rating: 3.5,
    review: '긴 여정의 장중한 마무리',
    createdAt: '2026-06-14T08:11:16.768Z'
  },
  {
    id: 'movie-1781424435912',
    title: '아이언맨',
    year: 2008,
    genre: '히어로',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TLSWW-qjYO4yW3gFwk3kXJHgkhAYY9TKHnQl3uz_UKL5diD-UvwfG8Iw3vdJ1IW5rta_E3aWPaBct0f-HfZTMShMKzkZMOsTwZDSTMGNXqfouF4uCgt8cFzBGxghHIdEqDmxno5AIcfITPl8f95iRlk.webp',
    rating: 4,
    review: 'MCU, 전설의 시작',
    createdAt: '2026-06-14T08:07:15.912Z'
  },
  {
    id: 'movie-1781424343940',
    title: '레옹',
    year: 1994,
    genre: '액션',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TNche16C7DqjJmU0RQ64wQQAeVeyZ4WkIyPSkq3JElzHl3VCHgTvs-9aiLslrglDzs81zzu0RqwtVn78-K-wITUme46cXZwyV_LIaS-uFbv97HylehrT7AI3f6CuBL48tW1rXrGv8m5Zl1WwWzY4yrY.webp',
    rating: 5,
    review: '나탈리 포트만의 전설적 데뷔',
    createdAt: '2026-06-14T08:05:43.940Z'
  },
  {
    id: 'movie-1781424264938',
    title: '인터스텔라',
    year: 2014,
    genre: 'SF',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TEQgGZk0sjO5KHLF5DttOgxGUnc3IqDNQrOXIk3z7Ho3v3Jw_fW2SK06aFG97uovNklgFJtpMLYAG_6vOAe7EVN8YattFNWXO4_DJ-AQbvVMHWA7JVq0YNvmRbVI1V5pAHIKyGXsAaBO2lHstLE7cfc.webp',
    rating: 5,
    review: '단순한 공상과학을 넘어선, 중력(Gravity)의 첫 이름인 이끌림(Attraction)에 대한 이야기',
    createdAt: '2026-06-14T08:04:24.938Z'
  },
  {
    id: 'movie-1781424209862',
    title: '조커',
    year: 2019,
    genre: '스릴러',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TBRCUDuSjdKpVKmVDIIS1FijacywRLpmAfaZitDHR_prXJG5aEr59mHjsyAfB7xkCjrN7bQyqNgvCMTr8bchlxSHrBVqieMxYv4jEERG_B8VisNdQA1eYH--3BAzQkn68qEcm-aNUN8giSl5dP4Vnf0.webp',
    rating: 4.5,
    review: '호아킨 피닉스의 미친 연기',
    createdAt: '2026-06-14T08:03:29.862Z'
  },
  {
    id: 'movie-1781423301419',
    title: '스즈메의 문단속',
    year: 2022,
    genre: '애니메이션',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TPmwp26p4cUW_FSX3fAJvesL4rMJ1czfQZERcWSt2hNXXKJJQ4MCzBqJuDzr9ZEzi01da1bMUI8JJq3tgs1mfBBDxDE0Yt-Su_g-QtDxVihEzwfGSm10gHwoc_MhtvNH7zkQ7s7S5iAJNFAG2vwG9E0.webp',
    rating: 4,
    review: '간절하게 열고 절실하게 닫는다.',
    createdAt: '2026-06-14T07:48:21.419Z'
  },
  {
    id: 'movie-1781422347761',
    title: '너의 이름은.',
    year: 2016,
    genre: '애니메이션',
    poster: 'https://i.namu.wiki/i/d2GfXTNXza1PlkwZaXH4TOnkuafaYIiWeFz15p4M0n5NthYSLHBQDfOHdHsnyuXE-geWJDncMARKh9GY4WKuYm8iAtEU_bFX4Z-0E_qiHy7jgZwYjKdGBC061j56ElNzXt2JpxNjr3mu1EZmSLWhiZFr-ToemyDwdtzQZjZfAY8.webp',
    rating: 4.5,
    review: '신카이 마코토 감독의 최고작',
    createdAt: '2026-06-14T07:32:27.761Z'
  },
  {
    id: 'sample-2',
    title: '기생충',
    year: 2019,
    genre: '스릴러',
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
    rating: 4.5,
    review: '봉준호 감독의 날카로운 계급 풍자극. 예측 불가능한 전개와 완벽한 연출로 오랫동안 머릿속에 남는 작품.',
    createdAt: '2026-06-03T10:00:00.000Z'
  }
];

const STORAGE_KEY = 'reelthoughts_movies_v4';

/* ---------- State ---------- */
let movies = [];
let activeGenre = 'All';
let pendingRating = 0;
let editingId = null;
let sortKey = 'createdAt';
let sortDir = 'desc';

/* ---------- DOM References ---------- */
const movieGrid    = document.getElementById('movieGrid');
const emptyState   = document.getElementById('emptyState');
const filterChips  = document.getElementById('filterChips');
const modalOverlay = document.getElementById('modalOverlay');
const movieForm    = document.getElementById('movieForm');
const starPicker   = document.getElementById('starPicker');
const ratingInput  = document.getElementById('ratingInput');
const formError    = document.getElementById('formError');

const openFormBtn   = document.getElementById('openFormBtn');
const closeFormBtn  = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');

/* ============================================================
   localStorage helpers
   ============================================================ */
function loadMovies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) { /* ignore */ }
  // First visit: seed with samples and persist them
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MOVIES));
  return SAMPLE_MOVIES.map(m => ({ ...m }));
}

function saveMovies() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

/* ============================================================
   Rendering
   ============================================================ */
function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      html += '<span class="s-on">&#9733;</span>';
    } else if (rating >= i - 0.5) {
      html += '<span class="s-half">&#9733;</span>';
    } else {
      html += '<span class="s-off">&#9734;</span>';
    }
  }
  return html;
}

function createCard(movie) {
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.dataset.id = movie.id;

  const posterHTML = movie.poster
    ? `<img class="card-poster" src="${escapeAttr(movie.poster)}"
            alt="${escapeAttr(movie.title)} poster"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
       <div class="card-poster-placeholder" style="display:none;">
         <span>&#127909;</span>
         <span class="placeholder-label">이미지 없음</span>
       </div>`
    : `<div class="card-poster-placeholder">
         <span>&#127909;</span>
         <span class="placeholder-label">이미지 없음</span>
       </div>`;

  card.innerHTML = `
    ${posterHTML}
    <div class="card-body">
      <h3 class="card-title">${escapeHTML(movie.title)}</h3>
      <p class="card-meta">
        <span>${escapeHTML(String(movie.year))}</span>
        <span class="card-meta-dot"></span>
        <span>${escapeHTML(movie.genre)}</span>
      </p>
      ${movie.createdAt ? `<p class="card-date">등록일 · ${new Date(movie.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</p>` : ''}
      <span class="card-genre">${escapeHTML(movie.genre)}</span>
      <div class="card-stars" aria-label="${movie.rating} out of 5 stars">
        ${renderStars(movie.rating)}
      </div>
      <p class="card-review">&ldquo;${escapeHTML(movie.review)}&rdquo;</p>
    </div>
    <div class="card-footer">
      <button class="btn-edit" data-id="${escapeAttr(movie.id)}">&#9999; 수정</button>
      <button class="btn-delete" data-id="${escapeAttr(movie.id)}">&#128465; 삭제</button>
    </div>
  `;

  return card;
}

function getSorted(list) {
  return [...list].sort((a, b) => {
    const valA = sortKey === 'rating' ? a.rating : new Date(a.createdAt || 0).getTime();
    const valB = sortKey === 'rating' ? b.rating : new Date(b.createdAt || 0).getTime();
    return sortDir === 'desc' ? valB - valA : valA - valB;
  });
}

function updateSortUI() {
  const dateBtn   = document.getElementById('sortDate');
  const ratingBtn = document.getElementById('sortRating');
  dateBtn.classList.toggle('active', sortKey === 'createdAt');
  ratingBtn.classList.toggle('active', sortKey === 'rating');
  dateBtn.textContent   = '날짜순 ' + (sortKey === 'createdAt' ? (sortDir === 'desc' ? '↓' : '↑') : '↓');
  ratingBtn.textContent = '별점순 ' + (sortKey === 'rating'    ? (sortDir === 'desc' ? '↓' : '↑') : '↓');
}

function renderGrid() {
  const filtered = activeGenre === 'All'
    ? movies
    : movies.filter(m => m.genre === activeGenre);

  const sorted = getSorted(filtered);
  movieGrid.innerHTML = '';

  if (sorted.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    sorted.forEach(m => movieGrid.appendChild(createCard(m)));
  }
}

function renderFilterChips() {
  // Collect unique genres from current movie list, preserve insertion order
  const genreSet = new Set();
  movies.forEach(m => genreSet.add(m.genre));

  // Remove old dynamic chips (keep "All")
  while (filterChips.children.length > 1) {
    filterChips.removeChild(filterChips.lastChild);
  }

  genreSet.forEach(genre => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (activeGenre === genre ? ' active' : '');
    btn.dataset.genre = genre;
    btn.textContent = genre;
    filterChips.appendChild(btn);
  });

  // Sync "All" chip active state
  filterChips.children[0].className = 'chip' + (activeGenre === 'All' ? ' active' : '');
}

function render() {
  renderFilterChips();
  renderGrid();
}

/* ============================================================
   Modal open / close
   ============================================================ */
function openModal() {
  movieForm.reset();
  editingId = null;
  pendingRating = 0;
  ratingInput.value = 0;
  formError.textContent = '';
  updateStarPickerUI(0);
  document.querySelector('.modal-header h2').textContent = '영화 추가';
  modalOverlay.classList.add('open');
  document.getElementById('titleInput').focus();
}

function openEditModal(movie) {
  movieForm.reset();
  editingId = movie.id;
  pendingRating = movie.rating;
  ratingInput.value = movie.rating;
  formError.textContent = '';
  document.getElementById('titleInput').value = movie.title;
  document.getElementById('yearInput').value = movie.year;
  document.getElementById('genreInput').value = movie.genre;
  document.getElementById('posterInput').value = movie.poster || '';
  document.getElementById('reviewInput').value = movie.review;
  updateStarPickerUI(0);
  document.querySelector('.modal-header h2').textContent = '영화 수정';
  modalOverlay.classList.add('open');
  document.getElementById('titleInput').focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

openFormBtn.addEventListener('click', openModal);
closeFormBtn.addEventListener('click', closeModal);
cancelFormBtn.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

/* ============================================================
   Star Picker
   ============================================================ */
function updateStarPickerUI(hoverValue) {
  const stars = starPicker.querySelectorAll('.star-pick');
  const activeValue = hoverValue > 0 ? hoverValue : pendingRating;
  const isHover = hoverValue > 0;

  stars.forEach(s => {
    const v = parseInt(s.dataset.value, 10);
    s.classList.remove('hovered', 'selected', 'half-hovered', 'half-selected');
    if (activeValue >= v) {
      s.classList.add(isHover ? 'hovered' : 'selected');
    } else if (activeValue >= v - 0.5) {
      s.classList.add(isHover ? 'half-hovered' : 'half-selected');
    }
  });
}

function getStarHalfValue(e) {
  const star = e.target.closest('.star-pick');
  if (!star) return null;
  const rect = star.getBoundingClientRect();
  const isLeft = (e.clientX - rect.left) < rect.width / 2;
  return parseInt(star.dataset.value, 10) - (isLeft ? 0.5 : 0);
}

starPicker.addEventListener('mousemove', e => {
  const val = getStarHalfValue(e);
  if (val !== null) updateStarPickerUI(val);
});

starPicker.addEventListener('mouseleave', () => {
  updateStarPickerUI(0);
});

starPicker.addEventListener('click', e => {
  const val = getStarHalfValue(e);
  if (val === null) return;
  pendingRating = val;
  ratingInput.value = val;
  updateStarPickerUI(0);
});

/* ============================================================
   Add Movie (form submit)
   ============================================================ */
movieForm.addEventListener('submit', e => {
  e.preventDefault();
  formError.textContent = '';

  const title  = document.getElementById('titleInput').value.trim();
  const year   = parseInt(document.getElementById('yearInput').value, 10);
  const genre  = document.getElementById('genreInput').value;
  const poster = document.getElementById('posterInput').value.trim();
  const rating = parseFloat(ratingInput.value);
  const review = document.getElementById('reviewInput').value.trim();

  // Validation
  if (!title)               return showError('제목을 입력해주세요.');
  if (!year || year < 1888 || year > 2099) return showError('올바른 연도를 입력해주세요 (1888–2099).');
  if (!genre)               return showError('장르를 선택해주세요.');
  if (rating < 0.5 || rating > 5) return showError('별점을 선택해주세요.');
  if (!review)              return showError('한줄평을 입력해주세요.');

  if (editingId) {
    const idx = movies.findIndex(m => m.id === editingId);
    if (idx !== -1) {
      movies[idx] = { ...movies[idx], title, year, genre, poster, rating, review };
    }
    editingId = null;
  } else {
    movies.unshift({ id: 'movie-' + Date.now(), title, year, genre, poster, rating, review, createdAt: new Date().toISOString() });
  }

  saveMovies();
  activeGenre = 'All';
  render();
  closeModal();
});

function showError(msg) {
  formError.textContent = msg;
}

/* ============================================================
   Delete Movie (event delegation)
   ============================================================ */
movieGrid.addEventListener('click', e => {
  if (e.target.closest('.btn-edit')) {
    const id = e.target.closest('.btn-edit').dataset.id;
    const movie = movies.find(m => m.id === id);
    if (movie) openEditModal(movie);
    return;
  }

  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  const id = btn.dataset.id;
  if (!id) return;

  movies = movies.filter(m => m.id !== id);
  saveMovies();

  // If active genre no longer has any movies, reset to All
  if (activeGenre !== 'All' && !movies.some(m => m.genre === activeGenre)) {
    activeGenre = 'All';
  }
  render();
});

/* ============================================================
   Genre Filter (event delegation)
   ============================================================ */
filterChips.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  activeGenre = chip.dataset.genre;
  render();
});

/* ============================================================
   Escape helpers (XSS prevention)
   ============================================================ */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   Sort
   ============================================================ */
document.getElementById('sortDate').addEventListener('click', () => {
  if (sortKey === 'createdAt') {
    sortDir = sortDir === 'desc' ? 'asc' : 'desc';
  } else {
    sortKey = 'createdAt';
    sortDir = 'desc';
  }
  updateSortUI();
  render();
});

document.getElementById('sortRating').addEventListener('click', () => {
  if (sortKey === 'rating') {
    sortDir = sortDir === 'desc' ? 'asc' : 'desc';
  } else {
    sortKey = 'rating';
    sortDir = 'desc';
  }
  updateSortUI();
  render();
});

/* ============================================================
   Init
   ============================================================ */
movies = loadMovies();
updateSortUI();
render();
