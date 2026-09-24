from app import supabase
print(supabase.table('reel_comments').select('*').eq('reel_id', 3).execute().data)
