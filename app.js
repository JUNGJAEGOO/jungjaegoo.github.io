/* ============================================================
   REEL THOUGHTS — app.js
   Handles: localStorage, sample data, add/delete, filter, stars
   ============================================================ */

'use strict';

/* ---------- Sample Data ---------- */
const SAMPLE_MOVIES = [
  {
    id: 'sample-1',
    title: '아멜리에',
    year: 2001,
    genre: '로맨스',
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/Amelie_poster.jpg',
    rating: 5,
    review: '몽마르트르를 배경으로 한 몽환적이고 아름다운 동화. 오드리 토투의 매력이 스크린을 가득 채운다.'
  },
  {
    id: 'sample-2',
    title: '기생충',
    year: 2019,
    genre: '스릴러',
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
    rating: 5,
    review: '봉준호 감독의 날카로운 계급 풍자극. 예측 불가능한 전개와 완벽한 연출로 오랫동안 머릿속에 남는 작품.'
  },
  {
    id: 'sample-3',
    title: '코코',
    year: 2017,
    genre: '애니메이션',
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg',
    rating: 4,
    review: '가족, 기억, 그리고 음악에 대한 픽사의 가장 따뜻한 찬가. 엔딩에서 눈물을 참기 어렵다.'
  },
  {
    id: 'sample-4',
    title: '비포 선셋',
    year: 2004,
    genre: '로맨스',
    poster: '',
    rating: 5,
    review: '파리의 오후, 두 사람, 10년의 감정. 링클레이터는 대화만으로 영화적 감동을 만들어낸다.'
  },
  {
    id: 'sample-5',
    title: '나이브스 아웃',
    year: 2019,
    genre: '미스터리',
    poster: '',
    rating: 4,
    review: '자기 규칙을 스스로 뒤집는 기발한 추리극. 다니엘 크레이그의 탐정 연기가 신선하고 유쾌하다.'
  },
  {
    id: 'sample-6',
    title: '타오르는 여인의 초상',
    year: 2019,
    genre: '드라마',
    poster: '',
    rating: 5,
    review: '모든 프레임이 그림이고, 모든 눈빛이 고백이다. 셀린 시아마의 조용하고 강렬한 걸작.'
  }
];

const STORAGE_KEY = 'reelthoughts_movies';

/* ---------- State ---------- */
let movies = [];
let activeGenre = 'All';
let pendingRating = 0;

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
    html += i <= rating
      ? '<span class="s-on">&#9733;</span>'
      : '<span class="s-off">&#9734;</span>';
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
      <span class="card-genre">${escapeHTML(movie.genre)}</span>
      <div class="card-stars" aria-label="${movie.rating} out of 5 stars">
        ${renderStars(movie.rating)}
      </div>
      <p class="card-review">&ldquo;${escapeHTML(movie.review)}&rdquo;</p>
    </div>
    <div class="card-footer">
      <button class="btn-delete" data-id="${escapeAttr(movie.id)}" aria-label="Delete ${escapeAttr(movie.title)}">
        &#128465; 삭제
      </button>
    </div>
  `;

  return card;
}

function renderGrid() {
  const filtered = activeGenre === 'All'
    ? movies
    : movies.filter(m => m.genre === activeGenre);

  movieGrid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    filtered.forEach(m => movieGrid.appendChild(createCard(m)));
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
  pendingRating = 0;
  ratingInput.value = 0;
  formError.textContent = '';
  updateStarPickerUI(0);
  modalOverlay.classList.add('open');
  document.getElementById('titleInput').focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

openFormBtn.addEventListener('click', openModal);
closeFormBtn.addEventListener('click', closeModal);
cancelFormBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

/* ============================================================
   Star Picker
   ============================================================ */
function updateStarPickerUI(hoverValue) {
  const stars = starPicker.querySelectorAll('.star-pick');
  stars.forEach(s => {
    const v = parseInt(s.dataset.value, 10);
    s.classList.remove('hovered', 'selected');
    if (hoverValue > 0) {
      if (v <= hoverValue) s.classList.add('hovered');
    } else {
      if (v <= pendingRating) s.classList.add('selected');
    }
  });
}

starPicker.addEventListener('mousemove', e => {
  const star = e.target.closest('.star-pick');
  if (star) updateStarPickerUI(parseInt(star.dataset.value, 10));
});

starPicker.addEventListener('mouseleave', () => {
  updateStarPickerUI(0);
});

starPicker.addEventListener('click', e => {
  const star = e.target.closest('.star-pick');
  if (!star) return;
  pendingRating = parseInt(star.dataset.value, 10);
  ratingInput.value = pendingRating;
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
  const rating = parseInt(ratingInput.value, 10);
  const review = document.getElementById('reviewInput').value.trim();

  // Validation
  if (!title)               return showError('제목을 입력해주세요.');
  if (!year || year < 1888 || year > 2099) return showError('올바른 연도를 입력해주세요 (1888–2099).');
  if (!genre)               return showError('장르를 선택해주세요.');
  if (rating < 1 || rating > 5) return showError('별점을 선택해주세요.');
  if (!review)              return showError('한줄평을 입력해주세요.');

  const newMovie = {
    id: 'movie-' + Date.now(),
    title,
    year,
    genre,
    poster,
    rating,
    review
  };

  movies.unshift(newMovie);
  saveMovies();
  activeGenre = 'All'; // reset filter so new movie is visible
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
   Init
   ============================================================ */
movies = loadMovies();
render();
