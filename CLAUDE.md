# Reel Thoughts — 프로젝트 가이드

## 프로젝트 개요

나만의 영화 기록장 웹앱. 영화를 추가/수정/삭제하고, 장르별 필터 및 별점·날짜 정렬 기능을 제공한다.

## 파일 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 마크업 (모달, 필터 바, 영화 그리드) |
| `style.css` | 전체 스타일 |
| `data.js` | 샘플 데이터 (`SAMPLE_MOVIES`) |
| `supabase.js` | Supabase API CRUD 래퍼 |
| `app.js` | UI 로직, 이벤트, localStorage 관리 |

## Supabase 연동

### 테이블: `MOV_INFO_MASTER`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | `int8` | PK, 신규 INSERT 시 1씩 자동 증가 |
| `cre_dt` | `timestamptz` | 생성일 |
| `mod_dt` | `timestamptz` | 최종 수정일 |
| `mov_name` | `varchar` | 영화 제목 |
| `mov_rsl_dt` | `varchar` | 개봉일 |
| `poster_url` | `varchar` | 포스터 이미지 URL |
| `genre` | `varchar` | 장르 |
| `ver` | `int8` | 데이터 버전 (낙관적 잠금용) |
| `rating` | `varchar` | 별점 (예: "4.5") |
| `comment` | `varchar` | 한줄평 / 의견 |

> `id`는 Supabase 시퀀스(auto-increment)로 자동 발급되므로 INSERT 시 포함하지 않는다.
> `ver`는 UPDATE 시 기존 값 + 1 로 올려서 보낸다.
> `mod_dt`는 UPDATE 시 현재 시각(`new Date().toISOString()`)으로 갱신한다.

### 설정 위치

`supabase.js` 상단 두 상수를 채워야 동작한다.

```js
const SUPABASE_URL = 'https://mmnhgggoovjhtcizwwqo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_53wzC_R3FFbzfPv9_h90Bw_tll1aSYL';
```

### app.js ↔ Supabase 필드 매핑

| app.js (UI) | MOV_INFO_MASTER |
|---|---|
| `movie.title` | `mov_name` |
| `movie.year` | `mov_rsl_dt` |
| `movie.genre` | `genre` |
| `movie.poster` | `poster_url` |
| `movie.rating` | `rating` |
| `movie.review` | `comment` |
| `movie.createdAt` | `cre_dt` |

## 데이터 흐름

1. 앱 초기 로드 시 `initApp()`이 `fetchMovies()`를 호출해 Supabase에서 데이터를 가져온다.
2. 영화 추가: `addMovie()` 호출 → DB가 `id`, `cre_dt`, `ver` 자동 세팅 → 응답 행을 `dbToMovie()`로 변환해 `movies` 배열에 추가.
3. 영화 수정: `updateMovie()` 호출 (낙관적 잠금: `ver` 일치 확인 후 +1) → 응답 행으로 `movies` 배열 갱신.
4. 영화 삭제: `deleteMovie()` 호출 → `movies` 배열에서 제거 후 리렌더.
5. localStorage는 더 이상 사용하지 않는다.

## 주의사항

- `escapeHTML` / `escapeAttr` 함수가 `app.js`에 있으므로 XSS 방지를 위해 사용자 입력은 반드시 이 함수를 통해 렌더링한다.
- `STORAGE_KEY = 'reelthoughts_movies_v4'` — localStorage 키 변경 시 기존 데이터가 초기화된다.
