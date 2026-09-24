import app
import json
with app.app.app_context():
    print(json.dumps(app.supabase.table('reels').select('id, caption').execute().data))
