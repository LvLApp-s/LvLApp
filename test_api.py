import app
import json
with app.app.test_client() as c:
    with c.session_transaction() as sess:
        sess['user_id'] = 4
    response = c.get('/api/reels/1/comments')
    print(response.get_json())
