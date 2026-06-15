/* ============================================================
   REEL THOUGHTS — data.js
   Sample movie data (loaded before app.js)
   ============================================================ */

const GENRES = [
  '드라마', '코미디', '음악', '스릴러', '호러', '히어로',
  '로맨스', '액션', 'SF', '애니메이션', '다큐멘터리',
  '미스터리', '판타지', '추리', '역사', '전기영화', '기타',
];

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
