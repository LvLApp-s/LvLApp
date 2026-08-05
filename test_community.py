import traceback
from app import app
app.testing = True
client = app.test_client()
try:
  with client.session_transaction() as sess:
    sess['user_id'] = 5
  res = client.get('/community')
  print('Status:', res.status_code)
except Exception as e:
  traceback.print_exc()
