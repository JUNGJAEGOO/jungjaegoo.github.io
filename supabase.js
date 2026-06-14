/* ============================================================
   REEL THOUGHTS — supabase.js
   Supabase API wrapper for MOV_INFO_MASTER table
   ============================================================ */

'use strict';

const SUPABASE_URL = 'https://mmnhgggoovjhtcizwwqo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_53wzC_R3FFbzfPv9_h90Bw_tll1aSYL';
const TABLE        = 'MOV_INFO_MASTER';

const _client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ----------------------------------------------------------
   영화 전체 조회
   반환: { data: Row[], error }
   컬럼: id, cre_dt, mod_dt, mov_rsl_dt, poster_url, genre, ver, rating, comment
---------------------------------------------------------- */
async function fetchMovies() {
  const { data, error } = await _client
    .from(TABLE)
    .select('*')
    .order('cre_dt', { ascending: false });

  return { data, error };
}

/* ----------------------------------------------------------
   영화 단건 조회
   반환: { data: Row, error }
---------------------------------------------------------- */
async function fetchMovie(id) {
  const { data, error } = await _client
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

/* ----------------------------------------------------------
   영화 추가
   id는 DB 시퀀스 자동 발급이므로 포함하지 않음
   row: {
     mov_name:    string,  // 영화 제목
     mov_rsl_dt:  string,  // 개봉일 (연도)
     poster_url:  string,  // 포스터 URL
     genre:       string,
     rating:      string,  // 별점 (예: "4.5")
     comment:     string,  // 한줄평
   }
   반환: { data: Row, error }
---------------------------------------------------------- */
async function addMovie(row) {
  const now = new Date().toISOString();

  const { data, error } = await _client
    .from(TABLE)
    .insert([{ id: Date.now(), ...row, cre_dt: now, mod_dt: now, ver: 1 }])
    .select()
    .single();

  return { data, error };
}

/* ----------------------------------------------------------
   영화 수정 (낙관적 잠금: ver 일치 여부 확인 후 +1)
   id:      수정 대상 PK
   updates: 수정할 필드 객체 (mov_rsl_dt, poster_url, genre, rating, comment 중 일부)
   currentVer: 현재 클라이언트가 알고 있는 ver 값
   반환: { data: Row, error }
---------------------------------------------------------- */
async function updateMovie(id, updates, currentVer) {
  const { data, error } = await _client
    .from(TABLE)
    .update({ ...updates, mod_dt: new Date().toISOString(), ver: currentVer + 1 })
    .eq('id', id)
    .eq('ver', currentVer)   // 낙관적 잠금: ver가 다르면 0 rows 업데이트
    .select()
    .single();

  return { data, error };
}

/* ----------------------------------------------------------
   영화 삭제
   반환: { error }
---------------------------------------------------------- */
async function deleteMovie(id) {
  const { error } = await _client
    .from(TABLE)
    .delete()
    .eq('id', id);

  return { error };
}

/* ----------------------------------------------------------
   장르별 조회
   반환: { data: Row[], error }
---------------------------------------------------------- */
async function fetchMoviesByGenre(genre) {
  const { data, error } = await _client
    .from(TABLE)
    .select('*')
    .eq('genre', genre)
    .order('cre_dt', { ascending: false });

  return { data, error };
}
