import app
import json
with app.app.app_context():
    res = app.supabase.table('reel_comments').select('*, user:users!reel_comments_user_id_fkey(id,username,display_name,profile_photo_url)').eq('reel_id', 3).is_('deleted_at', 'null').order('created_at', desc=False).limit(50).execute()
    with open('dump.txt', 'w', encoding='utf-8') as f:
        json.dump(res.data, f)
