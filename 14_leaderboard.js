/* ===================== shared leaderboard (Supabase REST) ===================== */
const SUPABASE_GAME = Object.freeze({
  url: 'https://lrbsthmjkbbbvhbvblqr.supabase.co',
  key: 'sb_publishable_ZKWgsEH0hNyNre7OyTHX9g_T1h_H7Nv'
});

const Leaderboard = {
  headers(extra) {
    return Object.assign({
      apikey: SUPABASE_GAME.key,
      Authorization: 'Bearer ' + SUPABASE_GAME.key,
      'Content-Type': 'application/json'
    }, extra || {});
  },
  async load() {
    const url = SUPABASE_GAME.url + '/rest/v1/cs2_leaderboard?select=player_name,wins,last_win&order=wins.desc,player_name.asc&limit=50';
    const res = await fetch(url, { headers: this.headers({ Accept: 'application/json' }) });
    if (!res.ok) throw new Error('Leaderboard request failed (' + res.status + ').');
    return res.json();
  },
  async recordMatch(mode, winners) {
    if (!winners || !winners.length) return false;
    const matchId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
    const rows = [...new Set(winners.map(n => String(n || '').trim().slice(0, 24)).filter(Boolean))]
      .map(player_name => ({ match_id: matchId, player_name, mode, created_at: new Date().toISOString() }));
    if (!rows.length) return false;
    const url = SUPABASE_GAME.url + '/rest/v1/cs2_match_wins?on_conflict=match_id,player_name';
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers({ Prefer: 'resolution=ignore-duplicates,return=minimal' }),
      body: JSON.stringify(rows)
    });
    if (!res.ok) throw new Error('Could not save match result (' + res.status + ').');
    return true;
  }
};
