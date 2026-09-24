import app
res = app.supabase.table('posts').select('id, content, image_url, likes(count), comments(count), reposts(count)').order('created_at', desc=True).limit(15).execute()
for p in res.data:
    likes = p.get('likes', [{'count': 0}])[0].get('count', 0) if p.get('likes') else 0
    comments = p.get('comments', [{'count': 0}])[0].get('count', 0) if p.get('comments') else 0
    reposts = p.get('reposts', [{'count': 0}])[0].get('count', 0) if p.get('reposts') else 0
    score = likes + comments + reposts
    print(f"[{score}] ID: {p['id']} - content: '{p.get('content', '')}' - image: {p.get('image_url', '')}")
