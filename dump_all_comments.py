import app
import json
with app.app.app_context():
    res = app.supabase.table('reel_comments').select('*').is_('deleted_at', 'null').execute()
    with open('dump_all_comments.txt', 'w', encoding='utf-8') as f:
        json.dump(res.data, f)
