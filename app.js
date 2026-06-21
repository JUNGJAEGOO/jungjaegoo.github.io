/* ============================================================
   REEL THOUGHTS — app.js
   Handles: Supabase data layer, add/edit/delete, filter, stars
   ============================================================ */

'use strict';

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

const openFormBtn    = document.getElementById('openFormBtn');
const closeFormBtn   = document.getElementById('closeFormBtn');
const cancelFormBtn  = document.getElementById('cancelFormBtn');
const detailOverlay  = document.getElementById('detailOverlay');
const detailBody     = document.getElementById('detailBody');
const detailTitle    = document.getElementById('detailTitle');
const closeDetailBtn = document.getElementById('closeDetailBtn');

/* ============================================================
   DB ↔ App 변환 헬퍼
   ============================================================ */
function dbToMovie(row) {
  return {
    id:        row.id,
    title:     row.mov_name,
    year:      row.mov_rsl_dt,
    genre:     row.genre,
    poster:    row.poster_url || '',
    rating:    parseFloat(row.rating) || 0,
    review:    row.comment,
    createdAt: row.cre_dt,
    ver:       row.ver,
  };
}

function movieToDbFields({ title, year, genre, poster, rating, review }) {
  return {
    mov_name:   title,
    mov_rsl_dt: String(year),
    genre,
    poster_url: poster,
    rating:     String(rating),
    comment:    review,
  };
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
        <span>개봉년도 : ${escapeHTML(String(movie.year))}</span>
      </p>
      ${movie.createdAt ? `<p class="card-date">등록 : ${new Date(movie.createdAt).toLocaleString('ko-KR', { year: '2-digit', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</p>` : ''}
      <div class="card-genres">${(movie.genre || '').split('|').filter(Boolean).map(g => `<span class="card-genre">${escapeHTML(g)}</span>`).join('')}</div>
      <div class="card-stars" aria-label="${movie.rating} out of 5 stars">
        ${renderStars(movie.rating)}
      </div>
    </div>
    <div class="card-footer">
      <button class="btn-edit" data-id="${escapeAttr(String(movie.id))}">&#9999; 수정</button>
      <button class="btn-delete" data-id="${escapeAttr(String(movie.id))}">&#128465; 삭제</button>
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
    : movies.filter(m => m.genre && m.genre.split('|').includes(activeGenre));

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
  const genreSet = new Set();
  movies.forEach(m => { if (m.genre) m.genre.split('|').forEach(g => g && genreSet.add(g)); });

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

  filterChips.children[0].className = 'chip' + (activeGenre === 'All' ? ' active' : '');
}

function render() {
  renderFilterChips();
  renderGrid();
  document.getElementById('movieCount').textContent = `현재 ${movies.length}개의 영화 평가함`;
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
  const selectedGenres = movie.genre ? movie.genre.split('|') : [];
  document.querySelectorAll('#genreCheckboxes input[type="checkbox"]').forEach(cb => {
    cb.checked = selectedGenres.includes(cb.value);
  });
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
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
detailOverlay.addEventListener('click', e => { if (e.target === detailOverlay) closeDetailModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modalOverlay.classList.contains('open')) closeModal();
    if (detailOverlay.classList.contains('open')) closeDetailModal();
  }
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
   Add / Edit Movie (form submit)
   ============================================================ */
movieForm.addEventListener('submit', async e => {
  e.preventDefault();
  formError.textContent = '';

  const title  = document.getElementById('titleInput').value.trim();
  const year   = parseInt(document.getElementById('yearInput').value, 10);
  const genre  = [...document.querySelectorAll('#genreCheckboxes input:checked')].map(cb => cb.value).join('|');
  const poster = document.getElementById('posterInput').value.trim();
  const rating = parseFloat(ratingInput.value);
  const review = document.getElementById('reviewInput').value.trim();

  if (!title)                              return showError('제목을 입력해주세요.');
  if (!year || year < 1888 || year > 2099) return showError('올바른 연도를 입력해주세요 (1888–2099).');
  if (!genre)                              return showError('장르를 하나 이상 선택해주세요.');
  if (rating < 0.5 || rating > 5)         return showError('별점을 선택해주세요.');
  if (!review)                             return showError('한줄평을 입력해주세요.');

  const submitBtn = movieForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;

  if (editingId !== null) {
    const movie = movies.find(m => m.id === editingId);
    const { data, error } = await updateMovie(
      editingId,
      movieToDbFields({ title, year, genre, poster, rating, review }),
      movie.ver
    );
    if (error) {
      showError('수정 중 오류가 발생했습니다: ' + error.message);
      submitBtn.disabled = false;
      return;
    }
    const idx = movies.findIndex(m => m.id === editingId);
    if (idx !== -1) movies[idx] = dbToMovie(data);
    editingId = null;
  } else {
    const { data, error } = await addMovie(
      movieToDbFields({ title, year, genre, poster, rating, review })
    );
    if (error) {
      showError('저장 중 오류가 발생했습니다: ' + error.message);
      submitBtn.disabled = false;
      return;
    }
    movies.unshift(dbToMovie(data));
  }

  submitBtn.disabled = false;
  activeGenre = 'All';
  render();
  closeModal();
});

function showError(msg) {
  formError.textContent = msg;
}

/* ============================================================
   Detail Modal (read-only view)
   ============================================================ */
function openDetailModal(movie) {
  detailTitle.textContent = movie.title;

  const posterHTML = movie.poster
    ? `<img class="detail-poster" src="${escapeAttr(movie.poster)}"
            alt="${escapeAttr(movie.title)} poster"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
       <div class="detail-poster-placeholder" style="display:none;"><span>&#127909;</span></div>`
    : `<div class="detail-poster-placeholder"><span>&#127909;</span></div>`;

  const detailGenresHTML = (movie.genre || '').split('|').filter(Boolean)
    .map(g => `<span class="card-genre">${escapeHTML(g)}</span>`).join('');

  detailBody.innerHTML = `
    <div class="detail-poster-wrap">${posterHTML}</div>
    <div class="detail-info">
      <p class="detail-meta"><span>개봉년도 : ${escapeHTML(String(movie.year))}</span></p>
      <div class="detail-genres">${detailGenresHTML}</div>
      <div class="detail-stars" aria-label="${movie.rating} out of 5 stars">
        ${renderStars(movie.rating)}
        <span class="detail-rating-num">${movie.rating}</span>
      </div>
      <p class="detail-review">&ldquo;${escapeHTML(movie.review)}&rdquo;</p>
    </div>
  `;

  detailOverlay.classList.add('open');
}

function closeDetailModal() {
  detailOverlay.classList.remove('open');
}

closeDetailBtn.addEventListener('click', closeDetailModal);

/* ============================================================
   Delete / Edit Movie (event delegation)
   ============================================================ */
movieGrid.addEventListener('click', async e => {
  if (e.target.closest('.btn-edit')) {
    const id = Number(e.target.closest('.btn-edit').dataset.id);
    const movie = movies.find(m => m.id === id);
    if (movie) openEditModal(movie);
    return;
  }

  if (e.target.closest('.btn-delete')) {
    const btn = e.target.closest('.btn-delete');
    const id = Number(btn.dataset.id);
    if (!id) return;
    btn.disabled = true;
    const { error } = await deleteMovie(id);
    if (error) {
      alert('삭제 중 오류가 발생했습니다: ' + error.message);
      btn.disabled = false;
      return;
    }
    movies = movies.filter(m => m.id !== id);
    if (activeGenre !== 'All' && !movies.some(m => m.genre === activeGenre)) {
      activeGenre = 'All';
    }
    render();
    return;
  }

  const card = e.target.closest('.movie-card');
  if (card) {
    const id = Number(card.dataset.id);
    const movie = movies.find(m => m.id === id);
    if (movie) openDetailModal(movie);
  }
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
function buildGenreCheckboxes() {
  const container = document.getElementById('genreCheckboxes');
  container.innerHTML = GENRES.map(g =>
    `<label class="genre-check-item"><input type="checkbox" name="genre" value="${escapeAttr(g)}"> ${escapeHTML(g)}</label>`
  ).join('');
}

async function initApp() {
  buildGenreCheckboxes();
  const { data, error } = await fetchMovies();
  if (error) {
    console.error('데이터 로드 오류:', error.message);
    emptyState.textContent = '데이터를 불러오는 중 오류가 발생했습니다.';
    emptyState.style.display = 'block';
    return;
  }
  movies = (data || []).map(dbToMovie);
  updateSortUI();
  render();
}

initApp();
