import app
import json
with app.app.app_context():
    res = app.supabase.table('reels').select('id, video_url, cover_url').execute()
    with open('dump_reels.txt', 'w', encoding='utf-8') as f:
        json.dump(res.data, f)
