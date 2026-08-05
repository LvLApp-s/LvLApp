import re

js_path = r'static\js\i18n.js'

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
    'en': '''
      community_form_create_btn: "Create Community",
      community_form_desc: "Build a focused space for people, posts, images, and active threads.",
      community_form_name: "Name",
      community_form_slug: "URL slug",
      community_form_slug_hint: "Lowercase letters, numbers, and hyphens. Leave blank to generate from the name.",
      community_form_description: "Description",
      community_form_accent: "Accent color",
      reel_upload_btn: "Upload",
      reel_upload_clip: "Upload clip",
      post_reply_title: "Reply",
      post_reply_aria: "Reply to post",
      post_repost_title: "Repost",
      post_repost_aria: "Repost",
      post_like_title: "Like",
      post_like_aria: "Like post",
''',
    'tr': '''
      community_form_create_btn: "Topluluk Oluştur",
      community_form_desc: "İnsanlar, gönderiler, görseller ve aktif sohbetler için odaklanmış bir alan oluştur.",
      community_form_name: "İsim",
      community_form_slug: "URL uzantısı",
      community_form_slug_hint: "Küçük harfler, sayılar ve tire. İsimden oluşturmak için boş bırakın.",
      community_form_description: "Açıklama",
      community_form_accent: "Vurgu rengi",
      reel_upload_btn: "Yükle",
      reel_upload_clip: "Klip yükle",
      post_reply_title: "Yanıtla",
      post_reply_aria: "Gönderiyi yanıtla",
      post_repost_title: "Paylaş",
      post_repost_aria: "Paylaş",
      post_like_title: "Beğen",
      post_like_aria: "Gönderiyi beğen",
''',
    'ar': '''
      community_form_create_btn: "إنشاء مجتمع",
      community_form_desc: "قم ببناء مساحة مخصصة للأشخاص والمشاركات والصور والمواضيع النشطة.",
      community_form_name: "الاسم",
      community_form_slug: "رابط URL",
      community_form_slug_hint: "أحرف صغيرة، أرقام، وشرطات. اتركه فارغاً للإنشاء من الاسم.",
      community_form_description: "الوصف",
      community_form_accent: "لون التمييز",
      reel_upload_btn: "رفع",
      reel_upload_clip: "رفع مقطع",
      post_reply_title: "رد",
      post_reply_aria: "الرد على المنشور",
      post_repost_title: "إعادة نشر",
      post_repost_aria: "إعادة نشر",
      post_like_title: "إعجاب",
      post_like_aria: "الإعجاب بالمنشور",
'''
}

for lang in ['en', 'tr', 'ar']:
    # Find the end of the language object
    pattern = rf'({lang}: {{.*?)(}},|\s*}}\s*}})'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.end(1)] + new_keys[lang] + content[match.end(1):]

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated i18n.js')
