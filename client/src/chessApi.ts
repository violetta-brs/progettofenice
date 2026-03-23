const API_BASE = '';

export interface MoveResponse {
  success: boolean;
  move?: string;
  fen?: string;
  error?: string;
}

export async function postMove(
  fen: string,
  from: string,
  to: string,
  promotion?: string
): Promise<MoveResponse> {
  const res = await fetch(`${API_BASE}/api/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen, from, to, promotion }),
  });
  return res.json();
}

export async function postRandomMove(fen: string): Promise<MoveResponse> {
  const res = await fetch(`${API_BASE}/api/random-move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen }),
  });
  return res.json();
}
