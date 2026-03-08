import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

type FloppyBallScoreRow = {
  created_at: string
  player_name?: string | null
  score: number
}

const mapRows = (rows: FloppyBallScoreRow[]) =>
  rows
    .map((row) => ({
      createdAt: row.created_at,
      name: row.player_name || 'Anonymous',
      score: Number(row.score),
    }))
    .filter((row) => Number.isFinite(row.score))
    .sort((a, b) => b.score - a.score || +new Date(a.createdAt) - +new Date(b.createdAt))

export const fetchLeaderboardEntries = async (limit: number) => {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('floppyball_scores')
    .select('player_name, score, created_at')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error || !data) {
    return null
  }

  return mapRows(data as FloppyBallScoreRow[])
}

export const insertLeaderboardEntry = async (name: string, score: number) => {
  if (!supabase) {
    return false
  }

  const { error } = await supabase.from('floppyball_scores').insert({
    player_name: name,
    score,
  })

  return !error
}
