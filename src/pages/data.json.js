// Serves the merged src/data/*.json at /data.json (emitted as a static file at build).
import data from '../data/index.js';

export function GET() {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
