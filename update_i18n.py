import re

with open('static/js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to en
content = re.sub(
    r'community_members_label',
    r'timeline_hub:"Timeline hub",timeline_hub_title:"Choose whose posts shape your LvL",community_desc_main:"Move between followers, following, and group threads without leaving the LvL feed.",community_create_group:"Create group",community_members_label',
    content, count=1
)

content = re.sub(
    r'community_default_desc:"A community on LvL.",',
    r'community_default_desc:"A community on LvL.",profile_posts:"Posts",profile_likes:"Likes",profile_no_posts:"No posts",profile_no_posts_desc:"This profile has not posted yet.",profile_no_liked_posts:"No liked posts",profile_no_liked_posts_desc:"This user hasn\'t liked any posts yet.",',
    content
)

# Add to tr
content = re.sub(
    r'community_join_desc:"Sohbete kat.l.n"',
    r'community_join_desc:"Sohbete katılın",profile_posts:"Gönderiler",profile_likes:"Beğeniler",profile_no_posts:"Gönderi yok",profile_no_posts_desc:"Bu profil henüz gönderi paylaşmadı.",profile_no_liked_posts:"Beğenilen gönderi yok",profile_no_liked_posts_desc:"Bu kullanıcı henüz hiçbir gönderiyi beğenmedi.",timeline_hub:"Zaman Tüneli",timeline_hub_title:"Kimin gönderilerinin LvL\'nizi şekillendireceğini seçin",community_desc_main:"LvL akışından ayrılmadan takipçiler, takip edilenler ve grup başlıkları arasında geçiş yapın.",community_create_group:"Grup oluştur"',
    content
)

# Add to ar
content = re.sub(
    r'community_join_desc:"[^"]+"',
    r'community_join_desc:"انضم إلى المحادثة",profile_posts:"المنشورات",profile_likes:"الإعجابات",profile_no_posts:"لا توجد منشورات",profile_no_posts_desc:"هذا الملف الشخصي لم ينشر بعد.",profile_no_liked_posts:"لا توجد منشورات معجب بها",profile_no_liked_posts_desc:"هذا المستخدم لم يعجب بأي منشورات بعد.",timeline_hub:"محور الجدول الزمني",timeline_hub_title:"اختر من تشكل منشوراتهم الـ LvL الخاص بك",community_desc_main:"تنقل بين المتابعين، الذين تتابعهم، ومجموعات النقاش دون مغادرة موجز LvL.",community_create_group:"إنشاء مجموعة"',
    content
)

with open('static/js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated i18n.js")
