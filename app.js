/* ============================================================
   REEL THOUGHTS — app.js
   Handles: localStorage, sample data, add/delete, filter, stars
   ============================================================ */

'use strict';

/* ---------- Sample Data ---------- */
const SAMPLE_MOVIES = [
  {
    id: 'sample-1',
    title: 'Amélie',
    year: 2001,
    genre: 'Romance',
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/Amelie_poster.jpg',
    rating: 5,
    review: 'A whimsical, visually intoxicating fairy tale set in Montmartre. Audrey Tautou is absolutely enchanting.'
  },
  {
    id: 'sample-2',
    title: 'Parasite',
    year: 2019,
    genre: 'Thriller',
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
    rating: 5,
    review: 'Bong Joon-ho crafts a razor-sharp class satire that pivots without warning into something truly unforgettable.'
  },
  {
    id: 'sample-3',
    title: 'Coco',
    year: 2017,
    genre: 'Animation',
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg',
    rating: 4,
    review: 'Pixar at its most vibrant — a celebration of family, memory, and the music that outlives us all. Brought me to tears.'
  },
  {
    id: 'sample-4',
    title: 'Before Sunset',
    year: 2004,
    genre: 'Romance',
    poster: '',
    rating: 5,
    review: 'Two people, one afternoon in Paris, a decade of unspoken feeling. Linklater makes conversation feel cinematic.'
  },
  {
    id: 'sample-5',
    title: 'Knives Out',
    year: 2019,
    genre: 'Mystery',
    poster: '',
    rating: 4,
    review: 'A fiendishly clever whodunit that keeps flipping its own rules. Daniel Craig is a revelation as Benoit Blanc.'
  },
  {
    id: 'sample-6',
    title: 'Portrait of a Lady on Fire',
    year: 2019,
    genre: 'Drama',
    poster: '',
    rating: 5,
    review: 'Quietly devastating. Every frame is a painting, every glance a confession. Céline Sciamma at her finest.'
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
         <span class="placeholder-label">No image</span>
       </div>`
    : `<div class="card-poster-placeholder">
         <span>&#127909;</span>
         <span class="placeholder-label">No image</span>
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
        &#128465; Remove
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
  if (!title)               return showError('Please enter a title.');
  if (!year || year < 1888 || year > 2099) return showError('Please enter a valid year (1888–2099).');
  if (!genre)               return showError('Please select a genre.');
  if (rating < 1 || rating > 5) return showError('Please select a star rating (1–5).');
  if (!review)              return showError('Please write a short review.');

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
