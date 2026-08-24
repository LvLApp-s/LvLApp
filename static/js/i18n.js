const TRANSLATIONS = {
  en: {
      reel_share_send_to: "Send to",
      reel_share_search: "Search...",
      reel_share_loading_friends: "Loading friends...",
      reel_share_send: "Send",
      reel_share_sending: "Sending...",
      reel_share_sent: "Sent",
      reel_share_failed: "Failed",
      banner_level_1_label: "First Step",
      banner_level_1_desc: "The starter banner for new LvL profiles.",
      banner_level_2_label: "Neon Climb",
      banner_level_2_desc: "Your first upgraded LvL banner.",
      banner_level_3_label: "Rising Charge",
      banner_level_3_desc: "A stronger banner for active members gaining momentum.",
      banner_level_4_label: "Hero Pulse",
      banner_level_4_desc: "A brighter profile stage for proven community energy.",
      reward_lvl_5_label: "Emoji Kit",
      reward_lvl_5_desc: "Unlock first profile expression tools and a cyan LvL badge.",
      reward_lvl_10_label: "Rising Medal",
      reward_lvl_10_desc: "Unlock a purple medal badge, title upgrade, and stronger profile status.",
      reward_lvl_15_label: "Avatar Frame",
      reward_lvl_15_desc: "Unlock avatar border styles that make your profile stand out.",
      reward_lvl_20_label: "Profile Color",
      reward_lvl_20_desc: "Unlock custom profile colors and the Elite Champion title.",
      reward_lvl_30_label: "Mythic Badge",
      reward_lvl_30_desc: "Unlock a gold medal badge and premium public status.",
      reward_lvl_50_label: "App Icon Recolor",
      reward_lvl_50_desc: "Unlock the first prestige icon recolor tier for long-term players.",
      achievement_first_post_name: "First Post",
      achievement_first_post_desc: "Share your first post.",
      achievement_active_poster_name: "Active Poster",
      achievement_active_poster_desc: "Share 5 posts.",
      achievement_conversation_starter_name: "Conversation Starter",
      achievement_conversation_starter_desc: "Receive your first comment.",
      achievement_popular_voice_name: "Popular Voice",
      achievement_popular_voice_desc: "Receive 10 comments on your posts.",
      achievement_liked_name: "Liked",
      achievement_liked_desc: "Receive your first like.",
      achievement_rising_star_name: "Rising Star",
      achievement_rising_star_desc: "Receive 20 likes.",
      achievement_community_builder_name: "Community Builder",
      achievement_community_builder_desc: "Follow 5 people.",
      achievement_influencer_name: "Influencer",
      achievement_influencer_desc: "Gain 5 followers.",
      achievement_streak_starter_name: "Streak Starter",
      achievement_streak_starter_desc: "Start a 3-day interaction streak.",
      achievement_community_voice_name: "Community Voice",
      achievement_community_voice_desc: "Share 3 posts inside a community.",
      achievement_top_contributor_name: "Top Contributor",
      achievement_top_contributor_desc: "Reach LvL 10.",
      achievement_elite_champion_name: "Elite Champion",
      achievement_elite_champion_desc: "Reach LvL 20.",
      error_500_title: "Something went wrong",
      error_500_desc: "The app hit a problem while loading this page. Try again in a moment.",

    /* Navigation */
    nav_home:"Home",nav_clips:"Clips",nav_community:"Community",nav_guide:"LvL Guide",nav_settings:"Settings",nav_post:"Post",nav_logout:"Log out",nav_messages:"Messages",nav_alerts:"Alerts",nav_me:"Me",nav_more:"More",
    /* Messages */
    delete_for_me:"Delete for me",delete_for_everyone:"Delete for everyone",message_deleted:"This message was deleted",
    messages_new:"New Message",messages_search:"Search conversations",messages_empty:"No conversations yet.",messages_start:"Start a conversation",
    /* Errors */
    error_file_too_large:"File size exceeds the limit of 15 MB.",error_unsupported_file:"This file type is not supported for security reasons.",
    /* Auth */
    auth_title:"Level up every connection.",auth_desc:"Earn XP as you post, comment, like, and meet people. Build your profile rank and unlock stronger badges.",auth_login_tab:"Login",auth_register_tab:"Register",auth_or_email:"or continue with email",auth_nickname_email:"Nickname or email",auth_password:"Password",auth_forgot:"Forgot password?",auth_remember_me:"Remember me",auth_login_btn:"Login",auth_first_name:"First name",auth_last_name:"Last name",auth_nickname:"Nickname",auth_email:"Email",auth_birthday:"Birthday",auth_gender:"Gender",auth_male:"Male",auth_female:"Female",auth_create_btn:"Create account",auth_continue_google:"Continue with Google",auth_new_account_note:"New accounts will finish profile setup after connecting.",
    /* Settings */
    settings_title:"Edit profile",settings_subtitle:"Update how your account appears to others on LvL.",settings_public_info:"Public Information",settings_first_name:"First Name",settings_last_name:"Last Name",settings_username:"Username / Nickname",settings_username_hint:"3-24 letters, numbers, or underscores. Usernames are saved lowercase.",settings_bio:"Bio",settings_bio_placeholder:"Tell us about yourself...",settings_details:"Details",settings_location:"Location",settings_location_placeholder:"City, Country",settings_website:"Website",settings_gender:"Gender",settings_birthday:"Birthday",settings_appearance:"Appearance",settings_photo:"Profile Photo",settings_photo_hint:"Upload JPG, PNG, GIF, or WebP up to 5 MB.",settings_remove_photo:"Remove current photo and use the default avatar",settings_banner_color:"Profile banner color",settings_banner_hint:"Changes the banner on your profile and the color used for your chat header.",settings_cancel:"Cancel",settings_save:"Save Changes",settings_project_setup:"Project setup",settings_project_hint:"Check database tables, storage, Clips, service worker, and PWA files.",settings_open_health:"Open Setup Health",settings_delete_title:"Delete account",settings_delete_desc:"This permanently removes your account and the content connected to it. This action cannot be undone.",settings_current_password:"Current password",settings_delete_btn:"Delete account",settings_language_title:"Language / Dil / اللغة",settings_language_subtitle:"Choose your preferred language. Saved locally on this device.",settings_preferences:"Preferences",settings_autoplay_next:"Autoplay next Clip automatically",settings_notif_sounds:"Enable notification sounds",
    /* Guide */
    guide_tab_guide:"LvL Guide",guide_tab_contact:"Contact",guide_tab_careers:"Careers",guide_hero_kicker:"🎮 Progress system",guide_hero_title:"Use LvL like a social app. Level up like a game.",guide_hero_desc:"Posting, replying, liking, messaging, and high-fiving all feed your XP track.",guide_score_label:"⚡ Score track",guide_score_value:"XP → LvL → Rewards",guide_score_desc:"Achievements are display badges for now.",guide_how_title:"How it works",guide_how_desc:"Three simple steps: interact, fill the bar, unlock a visible reward.",guide_step1_title:"1. Join in",guide_step1_desc:"Post, reply, like, repost, message, or high-five someone.",guide_step2_title:"2. Gain XP",guide_step2_desc:"Useful activity fills your LvL bar and helps your profile grow.",guide_step3_title:"3. Show rewards",guide_step3_desc:"Unlock badges, borders, colors, titles, and future icon recolors.",guide_earn_title:"Earn XP By",guide_earn_desc:"Small actions add up. The app should reward real interaction, not spam.",guide_rewards_title:"LvL Rewards",guide_rewards_desc:"Your public profile gets more recognizable as you climb.",guide_roadmap_title:"Reward Roadmap",guide_roadmap_desc:"The clean product table for what each reward changes visually.",guide_lvl_col:"LvL",guide_reward_col:"Reward",guide_type_col:"Type",guide_visual_col:"Visual change",guide_why_col:"Why it exists",guide_requirements_title:"Level Requirements",guide_requirements_desc:"Total XP needed for each LvL.",guide_achievements_title:"Achievements",guide_achievements_desc:"These badges appear on profiles so members can show their progress.",
    /* Contact */
    contact_title:"Contact Us",contact_subtitle:"Have a question or feedback? We'd love to hear from you.",contact_name:"Full Name",contact_email:"Email Address",contact_subject:"Subject",contact_subject_general:"General Question",contact_subject_tech:"Technical Support",contact_subject_account:"Account Problem",contact_subject_verification:"Verification Request",contact_subject_report:"Report a Problem",contact_subject_suggestion:"Suggestion",contact_subject_partnership:"Partnership",contact_subject_other:"Other",contact_message:"Message",contact_message_placeholder:"Write your message here...",contact_send:"Send Message",contact_success:"Your message has been sent! We'll get back to you soon.",
    /* Verification */
    verification_title:"Request Profile Verification",verification_subtitle:"Verify your identity to get a cyan verified badge on your profile.",verification_reason:"Reason for Verification",verification_reason_placeholder:"Why should your profile be verified? (e.g. public figure, organization representative, content creator...)",verification_links:"Social Media or Official Website Links",verification_document:"Proof / Identification Document (optional, Max 15 MB)",verification_document_hint:"Upload passport, ID card, official letter, or other proof (PDF, JPG, PNG, DOCX).",verification_submit:"Submit Request",verification_success:"Your verification request has been submitted! Admins will review it soon.",verification_status:"Request Status",verification_submitted:"Submitted on",verification_pending:"Your request is under review. You will be notified once an admin takes action.",verification_approved:"Congratulations! Your profile has been verified. The cyan badge is active on your profile card.",verification_admin_notes:"Admin Notes",
    /* Careers */
    careers_title:"Join Our Team",careers_subtitle:"We're building the future of social interaction. Come help us shape it.",careers_open:"Open Positions",careers_no_positions:"No open positions at the moment.",careers_no_positions_sub:"We're not actively hiring right now, but we're always happy to hear from talented people.",careers_apply_title:"Apply Now",careers_apply_subtitle:"Interested in joining LvL? Fill out the form below.",careers_position:"Position",careers_position_placeholder:"Which role are you applying for?",careers_name:"Full Name",careers_email:"Email Address",careers_message:"Cover Letter / Message",careers_message_placeholder:"Tell us about yourself and why you want to join LvL...",careers_cv:"CV / Resume",careers_cv_hint:"PDF, DOC, or DOCX up to 5 MB",careers_submit:"Submit Application",careers_success:"Your application has been submitted! We'll review it and get back to you.",careers_fulltime:"Full-time",careers_internship:"Internship",careers_parttime:"Part-time",
    /* Notifications */
    notif_empty:"No notifications yet",notif_empty_sub:"When people interact with you or your posts, you'll see it here.",notif_mark_read:"Mark read",notif_alerts_title:"Alerts",notif_alerts_desc:"Short grouped updates for likes, comments, follows, messages, and high-fives.",notif_like:"liked your post",notif_reel_like:"liked your reel",notif_repost:"reposted your post",notif_comment:"commented on your post",notif_comment_reply:"replied to your comment",notif_comment_like:"liked your comment",notif_comment_repost:"reposted your comment",notif_reel_comment:"commented on your reel",notif_follow:"followed you",notif_friend_request:"sent you a friend request",notif_friend_accept:"accepted your friend request",notif_message:"sent you a message",notif_high_five:"high-fived you",notif_open_post:"Open post",notif_open_clip:"Open clip",notif_open_message:"Open message",notif_accept:"Accept",notif_decline:"Decline",notif_total:"total",
    /* Profile */
    profile_posts:"Posts",profile_following:"Following",profile_followers:"Followers",profile_friends:"Friends",profile_no_bio:"No bio yet.",profile_activity:"Activity",profile_edit_settings:"Settings",profile_guide:"LvL Guide",profile_follow:"Follow",profile_unfollow:"Unfollow",profile_message:"Message",profile_mute:"Mute",profile_muted:"Muted",profile_block:"Block",profile_unblock:"Unblock",profile_total_xp:"Total XP",profile_next_reward:"Next reward",profile_open_guide:"Open LvL Guide",profile_streak_friend:"Friend streak active",profile_streak_keep:"Keep it alive daily.",profile_streak_days_left:"more daily interactions to become friends.",profile_streak_start:"Friendship starts with a streak",profile_streak_hint:"High-five or trade messages daily for 7 days to become friends.",
    /* Post card */
    post_copy_link:"Copy link",post_share_dm:"Share via DM",post_delete:"Delete post",post_report:"Report post",post_mute_user:"Mute",post_block_user:"Block",post_reposted_by:"reposted",post_edit:"Edit post",comment_delete:"Delete reply",
    /* GIF Picker */
    gif_search_placeholder:"Search GIFs…",gif_loading:"Loading…",gif_no_results:"No GIFs found",gif_trending:"Trending",
    /* Search */
    search_placeholder:"Search LvL",search_no_results:"No results found",search_results_for:"Results for",
    /* General */
    leaderboard_title:"Leaderboard",leaderboard_empty:"No community members yet.",trending_title:"Trending Posts",follow_btn:"Follow",unfollow_btn:"Unfollow",back:"Go back",no_bio:"No bio yet.",mobile_switch_account:"Switch account",mobile_add_account:"Add account",mobile_logout:"Log out",open_post:"Open post",open_clip:"Open clip",joined:"Joined",location_label:"Location",website_label:"Website",
    /* Safety */
    unblock_to_interact:"Unblock to interact.",cant_interact:"You can't interact with this user.",
    /* Added keys */
    feed_for_you:"For you",feed_following:"Following",composer_placeholder:"What's happening?",composer_add_image:"Add image",composer_post_btn:"Post",composer_char_count_suffix:"left",videos_kicker:"Videos",see_all:"See all →",see_home:"See home →",media_kicker:"Media",open_btn:"Open",keep_moving:"Keep moving",quick_loops:"Quick loops",quick_clips_desc:"Watch, like, and comment.",quick_community_desc:"Find posts from groups and active people.",quick_activity_desc:"Review your likes, replies, posts, and reposts.",quick_guide_desc:"See what your next reward unlocks.",tab_verify_profile:"Verify Profile",community_desc_main:"Move between followers, following, and group threads without leaving the LvL feed.",community_create_group:"Create group",timeline_hub:"Timeline hub",timeline_hub_title:"Choose whose posts shape your LvL",timeline_hub:"Timeline hub",timeline_hub_title:"Choose whose posts shape your LvL",community_desc_main:"Move between followers, following, and group threads without leaving the LvL feed.",community_create_group:"Create group",community_members_label:"members",community_posts_label:"posts",community_and_label:"and",community_groups_label:"communities are feeding these timelines.",community_lens_history:"History",community_lens_history_desc:"Your posts, replies, and profile activity.",community_lens_community_desc:"Group threads and topic rooms across LvL.",community_lens_trends:"Trends",community_lens_trends_desc_part2:"follows shaping discovery.",community_lens_news:"News",community_lens_news_desc:"Reward changes, XP rules, and unlocks.",community_followers_eyebrow:"They follow you",community_followers_title:"Posts from people who follow you",community_followers_desc:"See what the people already connected to you are sharing.",community_followers_empty_title:"No follower posts yet",community_followers_empty_text:"When someone who follows you posts, it will appear here.",community_followers_empty_help:"This tab is for seeing your audience from the other side: people who follow you, even if you do not follow them back.",community_following_eyebrow:"Your picks",community_following_title:"Posts from people you follow",community_following_desc:"Your main community timeline, focused on accounts you chose.",community_following_empty_title:"Follow people to fill this timeline",community_following_empty_text:"Search for members or open profiles and follow them to build this feed.",community_following_empty_help:"This is the middle timeline and should feel like your chosen feed: accounts you intentionally follow.",community_group_eyebrow:"Groups and threads",community_group_title:"Community threads across LvL",community_group_desc:"Group posts and public threads ranked by activity and relevance.",community_group_empty_title:"No community threads yet",community_group_empty_text:"Join or create a community, then start a thread.",community_group_empty_help:"This tab is for shared rooms and topic threads, separate from personal follower/following feeds.",community_empty_explainer_title:"What this timeline means",community_empty_action_search:"Search members",community_spaces_kicker:"Spaces",community_rooms_title:"Community rooms",community_new_btn:"New",community_no_groups:"No groups yet. Create the first community.",community_default_desc:"A community on LvL.",profile_posts:"Posts",profile_likes:"Likes",profile_no_posts:"No posts",profile_no_posts_desc:"This profile has not posted yet.",profile_no_liked_posts:"No liked posts",profile_no_liked_posts_desc:"This user hasn\'t liked any posts yet.",messages_select_title:"Select a message",messages_select_desc:"Choose an existing chat, find someone active, or start a new conversation.",messages_suggested_groups:"Suggested groups",messages_people_to_message:"People to message",messages_start_new:"Start a new conversation",search_users:"Search users...",messages_no_suggested_groups:"No suggested groups yet.",messages_no_suggested_people:"No people suggestions yet.",messages_no_users:"No other users are available yet.",start_message_placeholder:"Start a new message",remove_btn:"Remove",community_join_desc:"انضم إلى المحادثة",profile_posts:"المنشورات",profile_likes:"الإعجابات",profile_no_posts:"لا توجد منشورات",profile_no_posts_desc:"هذا الملف الشخصي لم ينشر بعد.",profile_no_liked_posts:"لا توجد منشورات معجب بها",profile_no_liked_posts_desc:"هذا المستخدم لم يعجب بأي منشورات بعد.",timeline_hub:"محور الجدول الزمني",timeline_hub_title:"اختر من تشكل منشوراتهم الـ LvL الخاص بك",community_desc_main:"تنقل بين المتابعين، الذين تتابعهم، ومجموعات النقاش دون مغادرة موجز LvL.",community_create_group:"إنشاء مجموعة",
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

      xp_reward_0_label: "Daily login", xp_reward_0_desc: "Open LvL once per day.",
      xp_reward_1_label: "Create a post", xp_reward_1_desc: "Share a normal profile post.",
      xp_reward_2_label: "Create a community post", xp_reward_2_desc: "Start a post inside a community.",
      xp_reward_3_label: "Write a comment", xp_reward_3_desc: "Reply to another post.",
      xp_reward_4_label: "Receive a comment", xp_reward_4_desc: "Someone comments on your post.",
      xp_reward_5_label: "Give a like", xp_reward_5_desc: "Like another post.",
      xp_reward_6_label: "Receive a like", xp_reward_6_desc: "Someone likes your post.",
      xp_reward_7_label: "Repost", xp_reward_7_desc: "Share another post again.",
      lvl_reward_0_label: "Emoji Kit",
      lvl_reward_1_label: "Rising Medal",
      lvl_reward_2_label: "Avatar Frame",
      lvl_reward_3_label: "Profile Color",
      lvl_reward_4_label: "Mythic Badge",
      lvl_reward_5_label: "App Icon Recolor",
      lvl_roadmap_0_reward: "Default identity", lvl_roadmap_0_type: "Baseline", lvl_roadmap_0_visual: "Black and white profile, standard avatar border, default LvL badge.", lvl_roadmap_0_purpose: "Keeps new accounts clean and makes later color rewards feel earned.",
      lvl_roadmap_1_reward: "Emoji Kit", lvl_roadmap_1_type: "Expression", lvl_roadmap_1_visual: "First emoji/profile expression tools plus the cyan LvL badge color.", lvl_roadmap_1_purpose: "Small visible reward for early activity.",
      lvl_roadmap_2_reward: "Rising Medal", lvl_roadmap_2_type: "Badge", lvl_roadmap_2_visual: "Purple medal styling and a stronger public rank title.", lvl_roadmap_2_purpose: "Shows that the account has moved past beginner status.",
      lvl_roadmap_3_reward: "Avatar Frame", lvl_roadmap_3_type: "Profile", lvl_roadmap_3_visual: "Avatar border styles for profile and feed identity.", lvl_roadmap_3_purpose: "Adds recognition without changing the whole theme too early.",
      lvl_roadmap_4_reward: "Profile Color", lvl_roadmap_4_type: "Customization", lvl_roadmap_4_visual: "Custom profile color for banners, chat headers, and profile accents.", lvl_roadmap_4_purpose: "Unlocks personal color only after enough visible participation.",
      lvl_roadmap_5_reward: "Mythic Badge", lvl_roadmap_5_type: "Prestige", lvl_roadmap_5_visual: "Gold public badge treatment and premium status visuals.", lvl_roadmap_5_purpose: "Rewards long-term activity with a clearly rare look.",
      lvl_roadmap_6_reward: "App Icon Recolor", lvl_roadmap_6_type: "Prestige", lvl_roadmap_6_visual: "First special LvL icon recolor tier for very active members.", lvl_roadmap_6_purpose: "Creates a long-term chase reward without affecting core usability.",

      profile_xp_this_level: "XP this level",
      profile_xp_to_lvl: "XP to LvL",
      profile_public_progress: "Public progress",
      profile_unlocked: "Unlocked",
      profile_locked: "Locked",
      achievement_first_post_name: "First Post", achievement_first_post_desc: "Share your first post.",
      achievement_active_poster_name: "Active Poster", achievement_active_poster_desc: "Share 5 posts.",
      achievement_conversation_starter_name: "Conversation Starter", achievement_conversation_starter_desc: "Write 10 comments.",
      achievement_known_member_name: "Known Member", achievement_known_member_desc: "Reach 5 followers.",
      achievement_squad_builder_name: "Squad Builder", achievement_squad_builder_desc: "Connect with 3 friends.",
      achievement_xp_collector_name: "XP Collector", achievement_xp_collector_desc: "Earn 1,000 total XP.",
      achievement_rising_member_name: "Rising Member", achievement_rising_member_desc: "Reach LvL 5.",
      achievement_hero_status_name: "Hero Status", achievement_hero_status_desc: "Reach LvL 10.",

      guide_header_desc: "Earn XP, unlock profile style, and make your progress visible without reading a rule book.",
      verification_submit_title: "Submit Verification Request",
      verification_submit_desc: "Please provide proof of identity, such as links to official websites or document uploads, and state why your account should be verified.",
      settings_username_hint: "3-24 letters, numbers, or underscores. Usernames are saved lowercase.",
      settings_bio_placeholder: "Tell us about yourself...",
      settings_location_placeholder: "City, Country",
      settings_photo_hint: "Upload JPG, PNG, GIF, or WebP up to 5 MB.",
      settings_remove_photo: "Remove current photo and use the default avatar",
      settings_banner_hint: "Changes the banner on your profile and the color used for your chat header.",
      settings_banner_locked_hint: "Profile colors unlock at LvL 20. Until then, accounts stay black and white so reward colors stay meaningful.",
      settings_banner_earn_xp: "Earn XP by posting, commenting, liking, and joining conversations.",
      settings_banner_see_table: "See the LvL reward table.",
      settings_delete_prefix: "Type",
      settings_delete_suffix: "to confirm",
      achievement_elite_champion_name: "Elite Champion", achievement_elite_champion_desc: "Reach LvL 20.",
      achievement_mythic_legend_name: "Mythic Legend", achievement_mythic_legend_desc: "Reach LvL 30.",
      activity_kicker: "Your history",
      activity_title: "Activity",
      activity_desc: "Posts, replies, likes, reposts, and clips you touched recently.",
      activity_empty_title: "Nothing here yet",
      activity_empty_desc: "Post, comment, like, repost, or upload a reel to build your LvL history.",
      activity_type_post: "Post",
      activity_type_comment: "Comment",
      activity_type_like: "Like",
      activity_type_repost: "Repost",
      activity_type_reel: "Reel",
      activity_desc_picture: "Picture post",
      activity_desc_like: "You liked a post.",
      activity_desc_repost: "You reposted something to your network.",
      activity_desc_reel: "You uploaded a reel.",

      level_title_new_adventurer: "New Adventurer",
      level_title_rising_star: "Rising Star",
      level_title_lvl_pro: "LvL Pro",
      level_title_elite_champion: "Elite Champion",
      level_title_mythic_legend: "Mythic Legend",
      level_title_server_icon: "Server Icon",
},
  tr: {
      reel_share_send_to: "Gönder",
      reel_share_search: "Ara...",
      reel_share_loading_friends: "Arkadaşlar yükleniyor...",
      reel_share_send: "Gönder",
      reel_share_sending: "Gönderiliyor...",
      reel_share_sent: "Gönderildi",
      reel_share_failed: "Başarısız",
      banner_level_1_label: "İlk Adım",
      banner_level_1_desc: "Yeni LvL profilleri için başlangıç afişi.",
      banner_level_2_label: "Neon Tırmanış",
      banner_level_2_desc: "İlk yükseltilmiş LvL afişin.",
      banner_level_3_label: "Yükselen Güç",
      banner_level_3_desc: "Aktif ve ivme kazanan üyeler için daha güçlü bir afiş.",
      banner_level_4_label: "Kahraman Nabzı",
      banner_level_4_desc: "Kanıtlanmış topluluk enerjisi için daha parlak bir profil sahnesi.",
      reward_lvl_5_label: "Emoji Kiti",
      reward_lvl_5_desc: "İlk profil ifade araçlarını ve camgöbeği LvL rozetini aç.",
      reward_lvl_10_label: "Yükselen Madalya",
      reward_lvl_10_desc: "Mor bir madalya rozeti, unvan yükseltmesi ve daha güçlü bir profil durumu aç.",
      reward_lvl_15_label: "Avatar Çerçevesi",
      reward_lvl_15_desc: "Profilini öne çıkaran avatar kenarlık stillerini aç.",
      reward_lvl_20_label: "Profil Rengi",
      reward_lvl_20_desc: "Özel profil renklerini ve Elit Şampiyon unvanını aç.",
      reward_lvl_30_label: "Efsanevi Rozet",
      reward_lvl_30_desc: "Altın bir madalya rozeti ve premium açık durum aç.",
      reward_lvl_50_label: "Uygulama İkonu Rengi",
      reward_lvl_50_desc: "Uzun vadeli oyuncular için ilk prestij ikonu renk değişimini aç.",
      achievement_first_post_name: "İlk Gönderi",
      achievement_first_post_desc: "İlk gönderini paylaş.",
      achievement_active_poster_name: "Aktif Paylaşımcı",
      achievement_active_poster_desc: "5 gönderi paylaş.",
      achievement_conversation_starter_name: "Sohbet Başlatan",
      achievement_conversation_starter_desc: "İlk yorumunu al.",
      achievement_popular_voice_name: "Popüler Ses",
      achievement_popular_voice_desc: "Gönderilerine 10 yorum al.",
      achievement_liked_name: "Beğenilen",
      achievement_liked_desc: "İlk beğenini al.",
      achievement_rising_star_name: "Yükselen Yıldız",
      achievement_rising_star_desc: "20 beğeni al.",
      achievement_community_builder_name: "Topluluk Kurucu",
      achievement_community_builder_desc: "5 kişiyi takip et.",
      achievement_influencer_name: "Etkileyici",
      achievement_influencer_desc: "5 takipçi kazan.",
      achievement_streak_starter_name: "Seri Başlatıcı",
      achievement_streak_starter_desc: "3 günlük bir etkileşim serisi başlat.",
      achievement_community_voice_name: "Topluluk Sesi",
      achievement_community_voice_desc: "Bir topluluk içinde 3 gönderi paylaş.",
      achievement_top_contributor_name: "En İyi Katkıda Bulunan",
      achievement_top_contributor_desc: "LvL 10'a ulaş.",
      achievement_elite_champion_name: "Elit Şampiyon",
      achievement_elite_champion_desc: "LvL 20'ye ulaş.",
      error_500_title: "Bir şeyler yanlış gitti",
      error_500_desc: "Uygulama bu sayfayı yüklerken bir sorunla karşılaştı. Birazdan tekrar dene.",

    /* Navigasyon */
    nav_home:"Ana Sayfa",nav_clips:"Klipler",nav_community:"Topluluk",nav_guide:"LvL Rehberi",nav_settings:"Ayarlar",nav_post:"Paylaş",nav_logout:"Çıkış yap",nav_messages:"Mesajlar",nav_alerts:"Bildirimler",nav_me:"Ben",nav_more:"Daha Fazla",
    /* Mesajlar */
    delete_for_me:"Benden sil",delete_for_everyone:"Herkes için sil",message_deleted:"Bu mesaj silindi",
    messages_new:"Yeni Mesaj",messages_search:"Konuşma ara",messages_empty:"Henüz konuşma yok.",messages_start:"Konuşma başlat",
    /* Hatalar */
    error_file_too_large:"Dosya boyutu 15 MB sınırını aşıyor.",error_unsupported_file:"Güvenlik nedeniyle bu dosya türü desteklenmiyor.",
    /* Giriş */
    auth_title:"Her bağlantıda seviye atla.",auth_desc:"Paylaşım yaparak, yorum yaparak, beğenerek ve yeni insanlarla tanışarak XP kazan.",auth_login_tab:"Giriş Yap",auth_register_tab:"Kayıt Ol",auth_or_email:"veya e-posta ile devam et",auth_nickname_email:"Kullanıcı adı veya e-posta",auth_password:"Şifre",auth_forgot:"Şifremi unuttum?",auth_remember_me:"Beni hatırla",auth_login_btn:"Giriş Yap",auth_first_name:"Ad",auth_last_name:"Soyad",auth_nickname:"Kullanıcı adı",auth_email:"E-posta",auth_birthday:"Doğum tarihi",auth_gender:"Cinsiyet",auth_male:"Erkek",auth_female:"Kadın",auth_create_btn:"Hesap oluştur",auth_continue_google:"Google ile devam et",auth_new_account_note:"Yeni hesaplar bağlantıdan sonra profil kurulumunu tamamlar.",
    /* Ayarlar */
    settings_title:"Profili Düzenle",settings_subtitle:"LvL'de diğer kullanıcılara nasıl göründüğünü güncelleyin.",settings_public_info:"Genel Bilgiler",settings_first_name:"Ad",settings_last_name:"Soyad",settings_username:"Kullanıcı Adı / Takma Ad",settings_username_hint:"3-24 karakter, harf, rakam veya alt çizgi.",settings_bio:"Hakkında",settings_bio_placeholder:"Kendinizden bahsedin...",settings_details:"Detaylar",settings_location:"Konum",settings_location_placeholder:"Şehir, Ülke",settings_website:"Web Sitesi",settings_gender:"Cinsiyet",settings_birthday:"Doğum Tarihi",settings_appearance:"Görünüm",settings_photo:"Profil Fotoğrafı",settings_photo_hint:"JPG, PNG, GIF veya WebP, maks. 5 MB.",settings_remove_photo:"Mevcut fotoğrafı kaldır ve varsayılan avatarı kullan",settings_banner_color:"Profil banner rengi",settings_banner_hint:"Profilinizdeki banner'ı ve sohbet başlığınızdaki rengi değiştirir.",settings_cancel:"Vazgeç",settings_save:"Değişiklikleri Kaydet",settings_project_setup:"Proje kurulumu",settings_project_hint:"Uygulama eski görünüyorsa kontrol edin.",settings_open_health:"Kurulum Sağlığını Aç",settings_delete_title:"Hesabı sil",settings_delete_desc:"Bu işlem hesabınızı kalıcı olarak kaldırır.",settings_current_password:"Mevcut Şifre",settings_delete_btn:"Hesabı sil",settings_language_title:"Language / Dil / اللغة",settings_language_subtitle:"Tercih ettiğiniz dili seçin. Bu cihazda yerel olarak kaydedilir.",settings_preferences:"Tercihler",settings_autoplay_next:"Sonraki klibi otomatik oynat",settings_notif_sounds:"Bildirim seslerini etkinleştir",
    /* Rehber */
    guide_tab_guide:"LvL Rehberi",guide_tab_contact:"İletişim",guide_tab_careers:"Kariyer",guide_hero_kicker:"🎮 İlerleme sistemi",guide_hero_title:"LvL'i sosyal uygulama gibi kullan. Oyun gibi seviye atla.",guide_hero_desc:"Paylaşım, yanıt, beğeni ve mesajlaşma; hepsi XP takibini besler.",guide_score_label:"⚡ Puan takibi",guide_score_value:"XP → LvL → Ödüller",guide_score_desc:"Başarılar şimdilik görüntüleme rozetleridir.",guide_how_title:"Nasıl çalışır",guide_how_desc:"Üç basit adım.",guide_step1_title:"1. Katıl",guide_step1_desc:"Paylaş, yanıtla, beğen, mesaj gönder.",guide_step2_title:"2. XP Kazan",guide_step2_desc:"Faydalı etkinlik LvL çubuğunuzu doldurur.",guide_step3_title:"3. Ödülleri Göster",guide_step3_desc:"Rozet, renk ve unvanların kilidini aç.",guide_earn_title:"XP Kazan",guide_earn_desc:"Küçük eylemler birikir.",guide_rewards_title:"LvL Ödülleri",guide_rewards_desc:"Tırmandıkça profiliniz daha tanınır.",guide_roadmap_title:"Ödül Yol Haritası",guide_roadmap_desc:"Her ödülün görsel değişimi.",guide_lvl_col:"LvL",guide_reward_col:"Ödül",guide_type_col:"Tür",guide_visual_col:"Görsel değişiklik",guide_why_col:"Neden var",guide_requirements_title:"Seviye Gereksinimleri",guide_requirements_desc:"Her LvL için gereken toplam XP.",guide_achievements_title:"Başarılar",guide_achievements_desc:"Bu rozetler profillerde görünür.",
    /* İletişim */
    contact_title:"Bizimle İletişime Geçin",contact_subtitle:"Bir sorunuz veya geri bildiriminiz mi var?",contact_name:"Ad Soyad",contact_email:"E-posta Adresi",contact_subject:"Konu",contact_subject_general:"Genel Soru",contact_subject_tech:"Teknik Destek",contact_subject_account:"Hesap Sorunu",contact_subject_verification:"Doğrulama Talebi",contact_subject_report:"Sorun Bildir",contact_subject_suggestion:"Öneri",contact_subject_partnership:"İşbirliği",contact_subject_other:"Diğer",contact_message:"Mesaj",contact_message_placeholder:"Mesajınızı buraya yazın...",contact_send:"Mesaj Gönder",contact_success:"Mesajınız gönderildi!",
    /* Doğrulama */
    verification_title:"Profil Doğrulama Talebi",verification_subtitle:"Profilinize cyan onaylı rozet almak için kimliğinizi doğrulayın.",verification_reason:"Doğrulama Nedeni",verification_reason_placeholder:"Profiliniz neden doğrulanmalı? (ör. kamuya mal olmuş kişi, kuruluş temsilcisi, içerik üreticisi...)",verification_links:"Sosyal Medya veya Resmi Web Sitesi Bağlantıları",verification_document:"Kanıt / Kimlik Belgesi (isteğe bağlı, Maks. 15 MB)",verification_document_hint:"Pasaport, kimlik kartı, resmi mektup veya diğer kanıtları yükleyin (PDF, JPG, PNG, DOCX).",verification_submit:"Talebi Gönder",verification_success:"Doğrulama talebiniz gönderildi! Yöneticiler yakında inceleyecek.",verification_status:"Talep Durumu",verification_submitted:"Gönderildi",verification_pending:"Talebiniz incelenmektedir. Bir yönetici işlem yaptığında bildirim alacaksınız.",verification_approved:"Tebrikler! Profiliniz doğrulandı. Cyan rozeti profil kartınızda aktif.",verification_admin_notes:"Yönetici Notları",
    /* Kariyer */
    careers_title:"Ekibimize Katılın",careers_subtitle:"Sosyal etkileşimin geleceğini inşa ediyoruz.",careers_open:"Açık Pozisyonlar",careers_no_positions:"Şu anda açık pozisyon bulunmuyor.",careers_no_positions_sub:"Aktif işe alım yapmıyoruz ama yetenekli insarlardan duymaktan mutluluk duyarız.",careers_apply_title:"Şimdi Başvur",careers_apply_subtitle:"LvL'e katılmak ister misiniz?",careers_position:"Pozisyon",careers_position_placeholder:"Hangi role başvuruyorsunuz?",careers_name:"Ad Soyad",careers_email:"E-posta Adresi",careers_message:"Ön Yazı / Mesaj",careers_message_placeholder:"Kendinizden ve neden LvL'e katılmak istediğinizden bahsedin...",careers_cv:"CV / Özgeçmiş",careers_cv_hint:"PDF, DOC veya DOCX, maks. 5 MB",careers_submit:"Başvuruyu Gönder",careers_success:"Başvurunuz iletildi!",careers_fulltime:"Tam Zamanlı",careers_internship:"Staj",careers_parttime:"Yarı Zamanlı",
    /* Bildirimler */
    notif_empty:"Henüz bildirim yok",notif_empty_sub:"İnsanlar sizinle veya gönderilerinizle etkileşime girdiğinde burada göreceksiniz.",notif_mark_read:"Okundu işaretle",notif_alerts_title:"Bildirimler",notif_alerts_desc:"Beğeniler, yorumlar, takipler, mesajlar ve beşlik çakmalar için kısa özet güncellemeler.",notif_like:"gönderinizi beğendi",notif_reel_like:"kliinizi beğendi",notif_repost:"gönderinizi paylaştı",notif_comment:"gönderinize yorum yaptı",notif_comment_reply:"yorumunuza yanıt verdi",notif_comment_like:"yorumunuzu beğendi",notif_comment_repost:"yorumunuzu paylaştı",notif_reel_comment:"kliinize yorum yaptı",notif_follow:"sizi takip etti",notif_friend_request:"size arkadaşlık isteği gönderdi",notif_friend_accept:"arkadaşlık isteğinizi kabul etti",notif_message:"size mesaj gönderdi",notif_high_five:"size beşlik çaktı",notif_open_post:"Gönderiyi aç",notif_open_clip:"Klibi aç",notif_open_message:"Mesajı aç",notif_accept:"Kabul Et",notif_decline:"Reddet",notif_total:"toplam",
    /* Profil */
    profile_posts:"Gönderiler",profile_following:"Takip Edilen",profile_followers:"Takipçiler",profile_friends:"Arkadaşlar",profile_no_bio:"Henüz bio yok.",profile_activity:"Aktivite",profile_edit_settings:"Ayarlar",profile_guide:"LvL Rehberi",profile_follow:"Takip Et",profile_unfollow:"Takibi Bırak",profile_message:"Mesaj",profile_mute:"Sustur",profile_muted:"Susturuldu",profile_block:"Engelle",profile_unblock:"Engeli Kaldır",profile_total_xp:"Toplam XP",profile_next_reward:"Sonraki ödül",profile_open_guide:"LvL Rehberini Aç",profile_streak_friend:"Arkadaşlık serisi aktif",profile_streak_keep:"Her gün canlı tutun.",profile_streak_days_left:"gün daha arkadaş olmak için etkileşin.",profile_streak_start:"Arkadaşlık bir seriyle başlar",profile_streak_hint:"7 gün boyunca günlük çarpık el verin veya mesajlaşın.",
    /* Gönderi kartı */
    post_copy_link:"Bağlantıyı kopyala",post_share_dm:"DM ile paylaş",post_delete:"Gönderiyi sil",post_report:"Gönderiyi şikayet et",post_mute_user:"Sustur",post_block_user:"Engelle",post_reposted_by:"yeniden paylaştı",post_edit:"Gönderiyi düzenle",comment_delete:"Yanıtı sil",
    /* GIF Seçici */
    gif_search_placeholder:"GIF ara…",gif_loading:"Yükleniyor…",gif_no_results:"GIF bulunamadı",gif_trending:"Trend",
    /* Arama */
    search_placeholder:"LvL'de ara",search_no_results:"Sonuç bulunamadı",search_results_for:"Arama sonuçları:",
    /* Genel */
    leaderboard_title:"Lider Tablosu",leaderboard_empty:"Henüz topluluk üyesi yok.",trending_title:"Trend Gönderiler",follow_btn:"Takip Et",unfollow_btn:"Takibi Bırak",back:"Geri dön",no_bio:"Henüz bio yok.",mobile_switch_account:"Hesap değiştir",mobile_add_account:"Hesap ekle",mobile_logout:"Çıkış yap",open_post:"Gönderiyi aç",open_clip:"Klibi aç",joined:"Katıldı",location_label:"Konum",website_label:"Web Sitesi",
    /* Güvenlik */
    unblock_to_interact:"Etkileşim için engeli kaldırın.",cant_interact:"Bu kullanıcıyla etkileşime giremezsiniz.",
    /* Added keys */
    feed_for_you:"Sizin için",feed_following:"Takip Edilenler",composer_placeholder:"Neler oluyor?",composer_add_image:"Görsel ekle",composer_post_btn:"Paylaş",composer_char_count_suffix:"kaldı",videos_kicker:"Videolar",see_all:"Hepsini gör →",see_home:"Ana sayfayı gör →",media_kicker:"Medya",open_btn:"Aç",keep_moving:"Devam edin",quick_loops:"Hızlı döngüler",quick_clips_desc:"İzleyin, beğenin ve yorum yapın.",quick_community_desc:"Gruplardan ve aktif kişilerden gönderiler bulun.",quick_activity_desc:"Beğenilerinizi, yanıtlarınızı, gönderilerinizi ve paylaşımlarınızı inceleyin.",quick_guide_desc:"Sıradaki ödülünüzün ne açtığını görün.",tab_verify_profile:"Profili Doğrula",community_desc_main:"LvL akışından çıkmadan takipçiler, takip edilenler ve grup başlıkları arasında geçiş yapın.",community_create_group:"Grup oluştur",timeline_hub:"Zaman tüneli merkezi",timeline_hub_title:"LvL'inizi hangi gönderilerin şekillendireceğini seçin",community_members_label:"üye",community_posts_label:"gönderi",community_and_label:"ve",community_groups_label:"topluluk bu zaman tünellerini besliyor.",community_lens_history:"Geçmiş",community_lens_history_desc:"Gönderileriniz, yanıtlarınız ve profil hareketleriniz.",community_lens_community_desc:"LvL genelindeki grup başlıkları ve konu odaları.",community_lens_trends:"Trendler",community_lens_trends_desc_part2:"takip keşfi şekillendiriyor.",community_lens_news:"Haberler",community_lens_news_desc:"Ödül değişiklikleri, XP kuralları ve kilit açmalar.",community_followers_eyebrow:"Sizi takip edenler",community_followers_title:"Sizi takip eden kişilerin gönderileri",community_followers_desc:"Zaten sizinle bağlantıda olan kişilerin neler paylaştığını görün.",community_followers_empty_title:"Henüz takipçi gönderisi yok",community_followers_empty_text:"Sizi takip eden biri paylaşım yaptığında burada görünecektir.",community_followers_empty_help:"Bu sekme hedef kitlenizi diğer taraftan görmek içindir: siz onları geri takip etmeseniz bile sizi takip eden kişiler.",community_following_eyebrow:"Seçimleriniz",community_following_title:"Takip ettiğiniz kişilerin gönderileri",community_following_desc:"Seçtiğiniz hesaplara odaklanan ana topluluk zaman tüneliniz.",community_following_empty_title:"Bu zaman tüneli ne anlama geliyor",community_following_empty_text:"Bu akışı oluşturmak için üyeleri arayın veya profilleri açıp onları takip edin.",community_following_empty_help:"Bu orta zaman tünelidir ve seçtiğiniz akış gibi hissettirmelidir: kasıtlı olarak takip ettiğiniz hesaplar.",community_group_eyebrow:"Gruplar ve başlıklar",community_group_title:"LvL genelindeki topluluk başlıkları",community_group_desc:"Etkinlik ve ilgi düzeyine göre sıralanmış grup gönderileri ve herkese açık başlıklar.",community_group_empty_title:"Henüz topluluk başlığı yok",community_group_empty_text:"Bir topluluğa katılın veya oluşturun, ardından bir başlık başlatın.",community_group_empty_help:"Bu sekme, kişisel takipçi/takip edilen akışlarından ayrı olarak paylaşılan odalar ve konu başlıkları içindir.",community_empty_explainer_title:"Bu zaman tüneli ne anlama geliyor",community_empty_action_search:"Üyeleri ara",community_spaces_kicker:"Alanlar",community_rooms_title:"Topluluk odaları",community_new_btn:"Yeni",community_no_groups:"Henüz grup yok. İlk topluluğu oluşturun.",community_default_desc:"LvL üzerinde bir topluluk.",messages_select_title:"Bir mesaj seçin",messages_select_desc:"Mevcut bir sohbeti seçin, aktif birini bulun veya yeni bir konuşma başlatın.",messages_suggested_groups:"Önerilen gruplar",messages_people_to_message:"Mesaj atılacak kişiler",messages_start_new:"Yeni bir konuşma başlat",search_users:"Kullanıcıları ara...",messages_no_suggested_groups:"Henüz önerilen grup yok.",messages_no_suggested_people:"Henüz kişi önerisi yok.",messages_no_users:"Henüz başka kullanıcı mevcut değil.",start_message_placeholder:"Yeni bir mesaj yazın",remove_btn:"Kaldır",community_join_desc:"انضم إلى المحادثة",profile_posts:"المنشورات",profile_likes:"الإعجابات",profile_no_posts:"لا توجد منشورات",profile_no_posts_desc:"هذا الملف الشخصي لم ينشر بعد.",profile_no_liked_posts:"لا توجد منشورات معجب بها",profile_no_liked_posts_desc:"هذا المستخدم لم يعجب بأي منشورات بعد.",timeline_hub:"محور الجدول الزمني",timeline_hub_title:"اختر من تشكل منشوراتهم الـ LvL الخاص بك",community_desc_main:"تنقل بين المتابعين، الذين تتابعهم، ومجموعات النقاش دون مغادرة موجز LvL.",community_create_group:"إنشاء مجموعة",profile_posts:"Gönderiler",profile_likes:"Beğeniler",profile_no_posts:"Gönderi yok",profile_no_posts_desc:"Bu profil henüz gönderi paylaşmadı.",profile_no_liked_posts:"Beğenilen gönderi yok",profile_no_liked_posts_desc:"Bu kullanıcı henüz hiçbir gönderiyi beğenmedi.",timeline_hub:"Zaman Tüneli",timeline_hub_title:"Kimin gönderilerinin LvL\'nizi şekillendireceğini seçin",community_desc_main:"LvL akışından ayrılmadan takipçiler, takip edilenler ve grup başlıkları arasında geçiş yapın.",community_create_group:"Grup oluştur",
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

      xp_reward_0_label: "Günlük giriş", xp_reward_0_desc: "LvL'i günde bir kez aç.",
      xp_reward_1_label: "Gönderi oluştur", xp_reward_1_desc: "Normal bir profil gönderisi paylaş.",
      xp_reward_2_label: "Topluluk gönderisi oluştur", xp_reward_2_desc: "Bir topluluk içinde gönderi başlat.",
      xp_reward_3_label: "Yorum yaz", xp_reward_3_desc: "Başka bir gönderiye yanıt ver.",
      xp_reward_4_label: "Yorum al", xp_reward_4_desc: "Biri gönderine yorum yapar.",
      xp_reward_5_label: "Beğeni ver", xp_reward_5_desc: "Başka bir gönderiyi beğen.",
      xp_reward_6_label: "Beğeni al", xp_reward_6_desc: "Biri gönderini beğenir.",
      xp_reward_7_label: "Paylaş", xp_reward_7_desc: "Başka bir gönderiyi tekrar paylaş.",
      lvl_reward_0_label: "Emoji Kiti",
      lvl_reward_1_label: "Yükselen Madalya",
      lvl_reward_2_label: "Avatar Çerçevesi",
      lvl_reward_3_label: "Profil Rengi",
      lvl_reward_4_label: "Mistik Rozet",
      lvl_reward_5_label: "Uygulama İkonu Rengi",
      lvl_roadmap_0_reward: "Varsayılan kimlik", lvl_roadmap_0_type: "Temel", lvl_roadmap_0_visual: "Siyah beyaz profil, standart avatar sınırı, varsayılan LvL rozeti.", lvl_roadmap_0_purpose: "Yeni hesapları temiz tutar ve sonraki renk ödüllerinin kazanılmış hissedilmesini sağlar.",
      lvl_roadmap_1_reward: "Emoji Kiti", lvl_roadmap_1_type: "İfade", lvl_roadmap_1_visual: "İlk emoji/profil ifade araçları ve cyan LvL rozet rengi.", lvl_roadmap_1_purpose: "Erken etkinlik için küçük görünür ödül.",
      lvl_roadmap_2_reward: "Yükselen Madalya", lvl_roadmap_2_type: "Rozet", lvl_roadmap_2_visual: "Mor madalya tasarımı ve daha güçlü bir genel rütbe unvanı.", lvl_roadmap_2_purpose: "Hesabın başlangıç seviyesini geçtiğini gösterir.",
      lvl_roadmap_3_reward: "Avatar Çerçevesi", lvl_roadmap_3_type: "Profil", lvl_roadmap_3_visual: "Profil ve akış kimliği için avatar sınırı stilleri.", lvl_roadmap_3_purpose: "Tüm temayı çok erken değiştirmeden tanınırlık ekler.",
      lvl_roadmap_4_reward: "Profil Rengi", lvl_roadmap_4_type: "Özelleştirme", lvl_roadmap_4_visual: "Afişler, sohbet başlıkları ve profil vurguları için özel profil rengi.", lvl_roadmap_4_purpose: "Kişisel rengin kilidini yalnızca yeterli görünür katılım sağlandıktan sonra açar.",
      lvl_roadmap_5_reward: "Mistik Rozet", lvl_roadmap_5_type: "Prestij", lvl_roadmap_5_visual: "Altın genel rozet görünümü ve premium statü görselleri.", lvl_roadmap_5_purpose: "Uzun süreli aktiviteyi nadir görünen bir ödülle ödüllendirir.",
      lvl_roadmap_6_reward: "Uygulama İkonu Rengi", lvl_roadmap_6_type: "Prestij", lvl_roadmap_6_visual: "Çok aktif üyeler için ilk özel LvL ikon rengi seviyesi.", lvl_roadmap_6_purpose: "Temel kullanılabilirliği etkilemeden uzun vadeli bir takip ödülü oluşturur.",

      profile_xp_this_level: "Bu seviyede XP",
      profile_xp_to_lvl: "Sonraki LvL için XP",
      profile_public_progress: "Genel İlerleme",
      profile_unlocked: "Açık",
      profile_locked: "Kilitli",
      achievement_first_post_name: "İlk Gönderi", achievement_first_post_desc: "İlk gönderini paylaş.",
      achievement_active_poster_name: "Aktif Paylaşımcı", achievement_active_poster_desc: "5 gönderi paylaş.",
      achievement_conversation_starter_name: "Sohbet Başlatıcı", achievement_conversation_starter_desc: "10 yorum yaz.",
      achievement_known_member_name: "Tanınan Üye", achievement_known_member_desc: "5 takipçiye ulaş.",
      achievement_squad_builder_name: "Ekip Kurucu", achievement_squad_builder_desc: "3 arkadaş edin.",
      achievement_xp_collector_name: "XP Toplayıcı", achievement_xp_collector_desc: "Toplam 1.000 XP kazan.",
      achievement_rising_member_name: "Yükselen Üye", achievement_rising_member_desc: "LvL 5'e ulaş.",
      achievement_hero_status_name: "Kahraman", achievement_hero_status_desc: "LvL 10'a ulaş.",

      guide_header_desc: "Kuralları okumadan XP kazanın, profil stillerini açın ve ilerlemenizi gösterin.",
      verification_submit_title: "Doğrulama İsteği Gönder",
      verification_submit_desc: "Lütfen resmi websiteleri veya belgeler gibi kimlik kanıtları sağlayın ve neden onaylanmanız gerektiğini belirtin.",
      settings_username_hint: "3-24 harf, sayı veya alt çizgi. Kullanıcı adları küçük harfle kaydedilir.",
      settings_bio_placeholder: "Bize kendinizden bahsedin...",
      settings_location_placeholder: "Şehir, Ülke",
      settings_photo_hint: "5 MB'a kadar JPG, PNG, GIF veya WebP yükleyin.",
      settings_remove_photo: "Mevcut fotoğrafı kaldır ve varsayılan avatarı kullan",
      settings_banner_hint: "Profilinizdeki afişi ve sohbet başlığınızda kullanılan rengi değiştirir.",
      settings_banner_locked_hint: "Profil renkleri LvL 20'de açılır. O zamana kadar ödül renklerinin anlamlı kalması için hesaplar siyah beyaz kalır.",
      settings_banner_earn_xp: "Gönderi paylaşarak, yorum yaparak, beğenerek ve sohbetlere katılarak XP kazanın.",
      settings_banner_see_table: "LvL ödül tablosuna göz atın.",
      settings_delete_prefix: "Onaylamak için",
      settings_delete_suffix: "yazın",
      achievement_elite_champion_name: "Elit Şampiyon", achievement_elite_champion_desc: "LvL 20'ye ulaş.",
      achievement_mythic_legend_name: "Efsane", achievement_mythic_legend_desc: "LvL 30'a ulaş.",
      activity_kicker: "Geçmişiniz",
      activity_title: "Aktivite",
      activity_desc: "Yakın zamanda etkileşime girdiğiniz gönderiler, yanıtlar, beğeniler, paylaşımlar ve klipler.",
      activity_empty_title: "Henüz burada bir şey yok",
      activity_empty_desc: "LvL geçmişinizi oluşturmak için gönderi paylaşın, yorum yapın, beğenin, yeniden paylaşın veya klip yükleyin.",
      activity_type_post: "Gönderi",
      activity_type_comment: "Yorum",
      activity_type_like: "Beğeni",
      activity_type_repost: "Paylaşım",
      activity_type_reel: "Klip",
      activity_desc_picture: "Görsel gönderisi",
      activity_desc_like: "Bir gönderiyi beğendiniz.",
      activity_desc_repost: "Ağınızla bir şey paylaştınız.",
      activity_desc_reel: "Bir klip yüklediniz.",

      level_title_new_adventurer: "Yeni Maceracı",
      level_title_rising_star: "Yükselen Yıldız",
      level_title_lvl_pro: "LvL Uzmanı",
      level_title_elite_champion: "Elit Şampiyon",
      level_title_mythic_legend: "Efsane",
      level_title_server_icon: "Sunucu İkonu",
},
  ar: {
      reel_share_send_to: "إرسال إلى",
      reel_share_search: "بحث...",
      reel_share_loading_friends: "جاري تحميل الأصدقاء...",
      reel_share_send: "إرسال",
      reel_share_sending: "جاري الإرسال...",
      reel_share_sent: "تم الإرسال",
      reel_share_failed: "فشل",
      banner_level_1_label: "الخطوة الأولى",
      banner_level_1_desc: "الشعار المبدئي لملفات LvL الجديدة.",
      banner_level_2_label: "صعود النيون",
      banner_level_2_desc: "أول شعار LvL تمت ترقيته لك.",
      banner_level_3_label: "قوة صاعدة",
      banner_level_3_desc: "شعار أقوى للأعضاء النشطين الذين يكتسبون زخمًا.",
      banner_level_4_label: "نبض البطل",
      banner_level_4_desc: "مرحلة ملف شخصي أكثر إشراقًا لطاقة المجتمع المثبتة.",
      reward_lvl_5_label: "مجموعة الرموز التعبيرية",
      reward_lvl_5_desc: "افتح أدوات التعبير الأولى للملف الشخصي وشارة LvL السماوية.",
      reward_lvl_10_label: "الميدالية الصاعدة",
      reward_lvl_10_desc: "افتح شارة ميدالية أرجوانية وترقية للقب وحالة ملف شخصي أقوى.",
      reward_lvl_15_label: "إطار الصورة الرمزية",
      reward_lvl_15_desc: "افتح أنماط حدود الصورة الرمزية التي تجعل ملفك الشخصي يبرز.",
      reward_lvl_20_label: "لون الملف الشخصي",
      reward_lvl_20_desc: "افتح ألوان الملف الشخصي المخصصة ولقب بطل النخبة.",
      reward_lvl_30_label: "الشارة الأسطورية",
      reward_lvl_30_desc: "افتح شارة ميدالية ذهبية وحالة عامة مميزة.",
      reward_lvl_50_label: "تلوين أيقونة التطبيق",
      reward_lvl_50_desc: "افتح مستوى إعادة تلوين أيقونة الهيبة الأول للاعبين على المدى الطويل.",
      achievement_first_post_name: "المنشور الأول",
      achievement_first_post_desc: "شارك منشورك الأول.",
      achievement_active_poster_name: "ناشر نشط",
      achievement_active_poster_desc: "شارك 5 منشورات.",
      achievement_conversation_starter_name: "مُطلق المحادثة",
      achievement_conversation_starter_desc: "تلقى تعليقك الأول.",
      achievement_popular_voice_name: "صوت مشهور",
      achievement_popular_voice_desc: "تلقى 10 تعليقات على منشوراتك.",
      achievement_liked_name: "محبوب",
      achievement_liked_desc: "تلقى إعجابك الأول.",
      achievement_rising_star_name: "نجم صاعد",
      achievement_rising_star_desc: "تلقى 20 إعجاباً.",
      achievement_community_builder_name: "باني المجتمع",
      achievement_community_builder_desc: "تابع 5 أشخاص.",
      achievement_influencer_name: "مؤثر",
      achievement_influencer_desc: "اكسب 5 متابعين.",
      achievement_streak_starter_name: "مُطلق السلسلة",
      achievement_streak_starter_desc: "ابدأ سلسلة تفاعل لمدة 3 أيام.",
      achievement_community_voice_name: "صوت المجتمع",
      achievement_community_voice_desc: "شارك 3 منشورات داخل مجتمع.",
      achievement_top_contributor_name: "أفضل مساهم",
      achievement_top_contributor_desc: "الوصول إلى LvL 10.",
      achievement_elite_champion_name: "بطل النخبة",
      achievement_elite_champion_desc: "الوصول إلى LvL 20.",
      error_500_title: "حدث خطأ ما",
      error_500_desc: "واجه التطبيق مشكلة أثناء تحميل هذه الصفحة. حاول مرة أخرى بعد لحظات.",

    /* التنقل */
    nav_home:"الرئيسية",nav_clips:"مقاطع",nav_community:"المجتمع",nav_guide:"دليل LvL",nav_settings:"الإعدادات",nav_post:"نشر",nav_logout:"تسجيل الخروج",nav_messages:"الرسائل",nav_alerts:"التنبيهات",nav_me:"أنا",nav_more:"المزيد",
    /* الرسائل */
    delete_for_me:"حذف لدي",delete_for_everyone:"حذف للجميع",message_deleted:"تم حذف هذه الرسالة",
    messages_new:"رسالة جديدة",messages_search:"بحث في المحادثات",messages_empty:"لا توجد محادثات بعد.",messages_start:"ابدأ محادثة",
    /* الأخطاء */
    error_file_too_large:"حجم الملف يتجاوز 15 ميجابايت",error_unsupported_file:"نوع الملف غير مدعوم لأسباب أمنية",
    /* تسجيل الدخول */
    auth_title:"ارتقِ بكل تواصل.",auth_desc:"اكسب XP بالنشر والتعليق والإعجاب.",auth_login_tab:"تسجيل الدخول",auth_register_tab:"إنشاء حساب",auth_or_email:"أو المتابعة بالبريد الإلكتروني",auth_nickname_email:"اسم المستخدم أو البريد",auth_password:"كلمة المرور",auth_forgot:"نسيت كلمة المرور؟",auth_remember_me:"تذكرني",auth_login_btn:"تسجيل الدخول",auth_first_name:"الاسم الأول",auth_last_name:"اسم العائلة",auth_nickname:"اسم المستخدم",auth_email:"البريد الإلكتروني",auth_birthday:"تاريخ الميلاد",auth_gender:"الجنس",auth_male:"ذكر",auth_female:"أنثى",auth_create_btn:"إنشاء الحساب",auth_continue_google:"المتابعة عبر Google",auth_new_account_note:"ستكمل الحسابات الجديدة الإعداد بعد الاتصال.",
    /* الإعدادات */
    settings_title:"تعديل الملف الشخصي",settings_subtitle:"تحديث كيفية ظهور حسابك.",settings_public_info:"المعلومات العامة",settings_first_name:"الاسم الأول",settings_last_name:"اسم العائلة",settings_username:"اسم المستخدم",settings_username_hint:"٣-٢٤ حرفاً.",settings_bio:"نبذة",settings_bio_placeholder:"أخبرنا عن نفسك...",settings_details:"التفاصيل",settings_location:"الموقع",settings_location_placeholder:"المدينة، البلد",settings_website:"الموقع الإلكتروني",settings_gender:"الجنس",settings_birthday:"تاريخ الميلاد",settings_appearance:"المظهر",settings_photo:"صورة الملف",settings_photo_hint:"ارفع صورة بحجم 5MB.",settings_remove_photo:"إزالة الصورة",settings_banner_color:"لون البانر",settings_banner_hint:"يغير البانر ولون المحادثة.",settings_cancel:"إلغاء",settings_save:"حفظ التغييرات",settings_project_setup:"إعداد المشروع",settings_project_hint:"تحقق عندما يبدو التطبيق قديماً.",settings_open_health:"فتح صحة الإعداد",settings_delete_title:"حذف الحساب",settings_delete_desc:"هذا الإجراء لا يمكن التراجع عنه.",settings_current_password:"كلمة المرور الحالية",settings_delete_btn:"حذف الحساب",settings_language_title:"Language / Dil / اللغة",settings_language_subtitle:"اختر لغتك المفضلة.",settings_preferences:"التفضيلات",settings_autoplay_next:"تشغيل المقطع التالي تلقائياً",settings_notif_sounds:"تفعيل أصوات الإشعارات",
    /* الدليل */
    guide_tab_guide:"دليل LvL",guide_tab_contact:"تواصل",guide_tab_careers:"وظائف",guide_hero_kicker:"🎮 نظام التقدم",guide_hero_title:"استخدم LvL كتطبيق اجتماعي.",guide_hero_desc:"كل تفاعل يغذي XP.",guide_score_label:"⚡ مسار النقاط",guide_score_value:"XP → LvL → مكافآت",guide_score_desc:"الإنجازات شارات عرض.",guide_how_title:"كيف يعمل",guide_how_desc:"ثلاث خطوات.",guide_step1_title:"١. انضمّ",guide_step1_desc:"انشر، ردّ، أعجب.",guide_step2_title:"٢. اكسب XP",guide_step2_desc:"تملأ الأنشطة الشريط.",guide_step3_title:"٣. المكافآت",guide_step3_desc:"افتح الشارات والألوان.",guide_earn_title:"كيفية كسب XP",guide_earn_desc:"الإجراءات الصغيرة تتراكم.",guide_rewards_title:"مكافآت LvL",guide_rewards_desc:"ملفك أكثر تميزاً.",guide_roadmap_title:"خارطة المكافآت",guide_roadmap_desc:"جدول المكافآت.",guide_lvl_col:"LvL",guide_reward_col:"المكافأة",guide_type_col:"النوع",guide_visual_col:"تغيير",guide_why_col:"سبب",guide_requirements_title:"متطلبات",guide_requirements_desc:"XP لكل LvL.",guide_achievements_title:"إنجازات",guide_achievements_desc:"شارات على الملفات.",
    /* التواصل */
    contact_title:"تواصل معنا",contact_subtitle:"هل لديك سؤال؟",contact_name:"الاسم الكامل",contact_email:"البريد الإلكتروني",contact_subject:"الموضوع",contact_subject_general:"سؤال عام",contact_subject_tech:"الدعم الفني",contact_subject_account:"مشكلة في الحساب",contact_subject_verification:"طلب توثيق",contact_subject_report:"الإبلاغ عن مشكلة",contact_subject_suggestion:"اقتراح",contact_subject_partnership:"شراكة",contact_subject_other:"أخرى",contact_message:"الرسالة",contact_message_placeholder:"اكتب رسالتك...",contact_send:"إرسال",contact_success:"تم الإرسال!",
    /* التحقق */
    verification_title:"طلب توثيق الملف الشخصي",verification_subtitle:"وثّق هويتك للحصول على شارة التحقق.",verification_reason:"سبب التوثيق",verification_reason_placeholder:"لماذا يجب توثيق ملفك الشخصي؟",verification_links:"روابط وسائل التواصل أو الموقع الرسمي",verification_document:"إثبات / وثيقة هوية (اختياري، حتى 15 MB)",verification_document_hint:"ارفع جواز سفر أو بطاقة هوية أو خطاب رسمي (PDF، JPG، PNG، DOCX).",verification_submit:"تقديم الطلب",verification_success:"تم تقديم طلب التوثيق! سيراجعه المشرفون قريباً.",verification_status:"حالة الطلب",verification_submitted:"تم التقديم في",verification_pending:"طلبك قيد المراجعة. ستُشعَر عند اتخاذ إجراء.",verification_approved:"تهانينا! تم توثيق ملفك الشخصي. الشارة الزرقاء نشطة.",verification_admin_notes:"ملاحظات المشرف",
    /* الوظائف */
    careers_title:"انضم إلينا",careers_subtitle:"نبني مستقبل LvL.",careers_open:"وظائف متاحة",careers_no_positions:"لا توجد وظائف.",careers_no_positions_sub:"نرحب بطلباتكم دائماً.",careers_apply_title:"قدّم طلبك",careers_apply_subtitle:"أكمل النموذج.",careers_position:"الوظيفة",careers_position_placeholder:"الدور المطلوب",careers_name:"الاسم",careers_email:"البريد الإلكتروني",careers_message:"خطاب تعريفي",careers_message_placeholder:"أخبرنا عن نفسك...",careers_cv:"السيرة الذاتية",careers_cv_hint:"PDF/DOC/DOCX 5MB",careers_submit:"تقديم",careers_success:"تم التقديم!",careers_fulltime:"دوام كامل",careers_internship:"تدريب",careers_parttime:"دوام جزئي",
    /* الإشعارات */
    notif_empty:"لا توجد إشعارات",notif_empty_sub:"عندما يتفاعل أحدهم معك، سترى ذلك هنا.",notif_mark_read:"وضع علامة مقروء",notif_alerts_title:"التنبيهات",notif_alerts_desc:"تحديثات مجمعة للإعجابات والتعليقات والمتابعات.",notif_like:"أعجب بمنشورك",notif_reel_like:"أعجب بمقطعك",notif_repost:"أعاد نشر منشورك",notif_comment:"علّق على منشورك",notif_comment_reply:"ردّ على تعليقك",notif_comment_like:"أعجب بتعليقك",notif_comment_repost:"أعاد نشر تعليقك",notif_reel_comment:"علّق على مقطعك",notif_follow:"تابعك",notif_friend_request:"أرسل إليك طلب صداقة",notif_friend_accept:"قبل طلب صداقتك",notif_message:"أرسل إليك رسالة",notif_high_five:"صافحك",notif_open_post:"فتح المنشور",notif_open_clip:"فتح المقطع",notif_open_message:"فتح الرسالة",notif_accept:"قبول",notif_decline:"رفض",notif_total:"إجمالي",
    /* الملف الشخصي */
    profile_posts:"المنشورات",profile_following:"يتابع",profile_followers:"المتابعون",profile_friends:"الأصدقاء",profile_no_bio:"لا توجد نبذة.",profile_activity:"النشاط",profile_edit_settings:"الإعدادات",profile_guide:"دليل LvL",profile_follow:"متابعة",profile_unfollow:"إلغاء",profile_message:"مراسلة",profile_mute:"كتم",profile_muted:"مكتوم",profile_block:"حجب",profile_unblock:"إلغاء الحجب",profile_total_xp:"إجمالي XP",profile_next_reward:"المكافأة التالية",profile_open_guide:"فتح دليل LvL",profile_streak_friend:"سلسلة صداقة نشطة",profile_streak_keep:"حافظ عليها يومياً.",profile_streak_days_left:"تفاعلات يومية إضافية لتصبحوا أصدقاء.",profile_streak_start:"الصداقة تبدأ بسلسلة",profile_streak_hint:"تبادلوا المصافحات أو الرسائل يومياً لمدة 7 أيام.",
    /* بطاقة المنشور */
    post_copy_link:"نسخ الرابط",post_share_dm:"مشاركة عبر DM",post_delete:"حذف المنشور",post_report:"الإبلاغ عن المنشور",post_mute_user:"كتم",post_block_user:"حجب",post_reposted_by:"أعاد النشر",
    /* البحث */
    search_placeholder:"بحث...",search_no_results:"لا توجد نتائج",search_results_for:"نتائج البحث عن",
    /* عام */
    leaderboard_title:"المتصدرون",leaderboard_empty:"لا يوجد أعضاء.",trending_title:"الرائجة",follow_btn:"متابعة",unfollow_btn:"إلغاء",back:"رجوع",no_bio:"لا توجد نبذة.",mobile_switch_account:"تبديل",mobile_add_account:"إضافة حساب",mobile_logout:"خروج",open_post:"فتح المنشور",open_clip:"فتح المقطع",joined:"انضم",location_label:"الموقع",website_label:"الموقع الإلكتروني",
    /* الأمان */
    unblock_to_interact:"أزل الحجب للتفاعل.",cant_interact:"لا يمكنك التفاعل مع هذا المستخدم.",
    /* Added keys */
    feed_for_you:"لك",feed_following:"المتابَعون",composer_placeholder:"ماذا يحدث؟",composer_add_image:"إضافة صورة",composer_post_btn:"نشر",composer_char_count_suffix:"متبقية",videos_kicker:"فيديو",see_all:"عرض الكل ←",see_home:"الرئيسية ←",media_kicker:"وسائط",open_btn:"فتح",keep_moving:"تابع التحرك",quick_loops:"حلقات سريعة",quick_clips_desc:"شاهد، تفاعل، وعلّق.",quick_community_desc:"ابحث عن منشورات المجموعات والأشخاص النشطين.",quick_activity_desc:"راجع الإعجابات والردود والمنشورات.",quick_guide_desc:"تعرف على ما ستفتحه المكافأة التالية.",tab_verify_profile:"توثيق الحساب",community_desc_main:"تنقل بين المتابعين والمتابَعين دون مغادرة الموجز.",community_create_group:"إنشاء مجموعة",timeline_hub:"مركز الجداول الزمنية",timeline_hub_title:"اختر المنشورات التي تشكل مستواك",community_members_label:"أعضاء",community_posts_label:"منشورات",community_and_label:"و",community_groups_label:"مجتمعات تغذي هذه الجداول الزمنية.",community_lens_history:"السجل",community_lens_history_desc:"منشوراتك، ردودك، ونشاطك.",community_lens_community_desc:"خيوط المجموعة وغرف المواضيع.",community_lens_trends:"الشائعة",community_lens_trends_desc_part2:"متابعات تشكل الاكتشاف.",community_lens_news:"الأخبار",community_lens_news_desc:"تغييرات المكافآت، قواعد XP.",community_followers_eyebrow:"يتابعونك",community_followers_title:"منشورات من أشخاص يتابعونك",community_followers_desc:"شاهد ما يشاركه الأشخاص المتصلون بك بالفعل.",community_followers_empty_title:"لا توجد منشورات متابعين بعد",community_followers_empty_text:"عندما ينشر شخص يتابعك، سيظهر هنا.",community_followers_empty_help:"هذه التبويب لرؤية جمهورك من الطرف الآخر.",community_following_eyebrow:"اختياراتك",community_following_title:"منشورات من أشخاص تتابعهم",community_following_desc:"جدولك الزمني الرئيسي، يركز على الحسابات التي اخترتها.",community_following_empty_title:"تابع الأشخاص لملء هذا الجدول الزمني",community_following_empty_text:"ابحث عن الأعضاء أو افتح الملفات الشخصية وتابعهم.",community_following_empty_help:"هذا هو الجدول الزمني الأوسط.",community_group_eyebrow:"مجموعات ومواضيع",community_group_title:"مواضيع المجتمع عبر التطبيق",community_group_desc:"منشورات المجموعة والمواضيع العامة.",community_group_empty_title:"لا توجد مواضيع مجتمعية بعد",community_group_empty_text:"انضم إلى مجتمع أو أنشئه، ثم ابدأ موضوعاً.",community_group_empty_help:"هذا التبويب للغرف المشتركة ومواضيع النقاش.",community_empty_explainer_title:"ماذا يعني هذا الجدول الزمني",community_empty_action_search:"البحث عن الأعضاء",community_spaces_kicker:"مساحات",community_rooms_title:"غرف المجتمع",community_new_btn:"جديد",community_no_groups:"لا توجد مجموعات بعد. أنشئ أول مجتمع.",community_default_desc:"مجتمع على LvL.",messages_select_title:"اختر رسالة",messages_select_desc:"اختر محادثة موجودة، أو ابحث عن شخص نشط، أو ابدأ محادثة جديدة.",messages_suggested_groups:"مجموعات مقترحة",messages_people_to_message:"أشخاص لمراسلتهم",messages_start_new:"بدء محادثة جديدة",search_users:"البحث عن مستخدمين...",messages_no_suggested_groups:"لا توجد مجموعات مقترحة بعد.",messages_no_suggested_people:"لا توجد مقترحات أشخاص بعد.",messages_no_users:"لا يوجد مستخدمون آخرون متاحون بعد.",start_message_placeholder:"بدء رسالة جديدة",remove_btn:"إزالة",community_join_desc:"انضم إلى المحادثة",profile_posts:"المنشورات",profile_likes:"الإعجابات",profile_no_posts:"لا توجد منشورات",profile_no_posts_desc:"هذا الملف الشخصي لم ينشر بعد.",profile_no_liked_posts:"لا توجد منشورات معجب بها",profile_no_liked_posts_desc:"هذا المستخدم لم يعجب بأي منشورات بعد.",timeline_hub:"محور الجدول الزمني",timeline_hub_title:"اختر من تشكل منشوراتهم الـ LvL الخاص بك",community_desc_main:"تنقل بين المتابعين، الذين تتابعهم، ومجموعات النقاش دون مغادرة موجز LvL.",community_create_group:"إنشاء مجموعة",
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
      xp_reward_0_label: "تسجيل الدخول اليومي", xp_reward_0_desc: "افتح تطبيق LvL مرة واحدة يومياً.",
      xp_reward_1_label: "إنشاء منشور", xp_reward_1_desc: "شارك منشور شخصي عادي.",
      xp_reward_2_label: "إنشاء منشور في مجتمع", xp_reward_2_desc: "ابدأ منشوراً داخل مجتمع.",
      xp_reward_3_label: "كتابة تعليق", xp_reward_3_desc: "قم بالرد على منشور آخر.",
      xp_reward_4_label: "تلقي تعليق", xp_reward_4_desc: "شخص ما يعلق على منشورك.",
      xp_reward_5_label: "إعطاء إعجاب", xp_reward_5_desc: "أعجب بمنشور آخر.",
      xp_reward_6_label: "تلقي إعجاب", xp_reward_6_desc: "شخص ما يعجب بمنشورك.",
      xp_reward_7_label: "إعادة نشر", xp_reward_7_desc: "شارك منشور شخص آخر مرة أخرى.",
      lvl_reward_0_label: "مجموعة الرموز التعبيرية",
      lvl_reward_1_label: "ميدالية الصعود",
      lvl_reward_2_label: "إطار الصورة الرمزية",
      lvl_reward_3_label: "لون الملف الشخصي",
      lvl_reward_4_label: "شارة أسطورية",
      lvl_reward_5_label: "تلوين أيقونة التطبيق",
      lvl_roadmap_0_reward: "الهوية الافتراضية", lvl_roadmap_0_type: "أساسي", lvl_roadmap_0_visual: "ملف شخصي أبيض وأسود، حد قياسي للصورة الرمزية، شارة LvL افتراضية.", lvl_roadmap_0_purpose: "يحافظ على نظافة الحسابات الجديدة ويجعل مكافآت الألوان اللاحقة تبدو وكأنها مكتسبة.",
      lvl_roadmap_1_reward: "مجموعة الرموز التعبيرية", lvl_roadmap_1_type: "تعبير", lvl_roadmap_1_visual: "أدوات التعبير عن الرموز التعبيرية / الملف الشخصي الأولى بالإضافة إلى لون شارة سماوي.", lvl_roadmap_1_purpose: "مكافأة صغيرة مرئية للنشاط المبكر.",
      lvl_roadmap_2_reward: "ميدالية الصعود", lvl_roadmap_2_type: "شارة", lvl_roadmap_2_visual: "تصميم ميدالية أرجواني وعنوان رتبة عام أقوى.", lvl_roadmap_2_purpose: "يُظهر أن الحساب قد تجاوز حالة المبتدئ.",
      lvl_roadmap_3_reward: "إطار الصورة الرمزية", lvl_roadmap_3_type: "الملف الشخصي", lvl_roadmap_3_visual: "أنماط حدود الصورة الرمزية لهوية الملف الشخصي والخلاصة.", lvl_roadmap_3_purpose: "يضيف التمييز دون تغيير المظهر بالكامل في وقت مبكر جداً.",
      lvl_roadmap_4_reward: "لون الملف الشخصي", lvl_roadmap_4_type: "التخصيص", lvl_roadmap_4_visual: "لون ملف شخصي مخصص للافتات ورؤوس الدردشة ولمسات الملف الشخصي.", lvl_roadmap_4_purpose: "يفتح اللون الشخصي فقط بعد مشاركة مرئية كافية.",
      lvl_roadmap_5_reward: "شارة أسطورية", lvl_roadmap_5_type: "هيبة", lvl_roadmap_5_visual: "معالجة شارة عامة ذهبية ومرئيات الحالة المميزة.", lvl_roadmap_5_purpose: "يكافئ النشاط طويل الأمد بمظهر نادر بوضوح.",
      lvl_roadmap_6_reward: "تلوين أيقونة التطبيق", lvl_roadmap_6_type: "هيبة", lvl_roadmap_6_visual: "أول مستوى خاص لتلوين أيقونة للأعضاء النشطين جداً.", lvl_roadmap_6_purpose: "يخلق مكافأة مطاردة طويلة الأجل دون التأثير على قابلية الاستخدام الأساسية.",

      profile_xp_this_level: "نقاط هذا المستوى",
      profile_xp_to_lvl: "للمستوى",
      profile_public_progress: "التقدم العام",
      profile_unlocked: "مفتوح",
      profile_locked: "مغلق",
      achievement_first_post_name: "المنشور الأول", achievement_first_post_desc: "شارك أول منشور لك.",
      achievement_active_poster_name: "ناشر نشط", achievement_active_poster_desc: "شارك 5 منشورات.",
      achievement_conversation_starter_name: "مبتدئ المحادثات", achievement_conversation_starter_desc: "اكتب 10 تعليقات.",
      achievement_known_member_name: "عضو معروف", achievement_known_member_desc: "احصل على 5 متابعين.",
      achievement_squad_builder_name: "باني الفريق", achievement_squad_builder_desc: "تواصل مع 3 أصدقاء.",
      achievement_xp_collector_name: "جامع النقاط", achievement_xp_collector_desc: "اربح 1,000 نقطة.",
      achievement_rising_member_name: "عضو صاعد", achievement_rising_member_desc: "صل إلى المستوى 5.",
      achievement_hero_status_name: "بطل", achievement_hero_status_desc: "صل إلى المستوى 10.",

      guide_header_desc: "اربح النقاط وافتح أنماط الملف الشخصي واجعل تقدمك مرئياً بدون قراءة كتاب القواعد.",
      verification_submit_title: "إرسال طلب التوثيق",
      verification_submit_desc: "يرجى تقديم إثبات الهوية، مثل روابط للمواقع الرسمية أو تحميل المستندات، واذكر سبب وجوب توثيق حسابك.",
      settings_username_hint: "3-24 حرفاً، أرقاماً، أو شرطات سفلية. تُحفظ بأسماء صغيرة.",
      settings_bio_placeholder: "أخبرنا عن نفسك...",
      settings_location_placeholder: "المدينة، البلد",
      settings_photo_hint: "قم بتحميل JPG أو PNG أو GIF أو WebP بحجم يصل إلى 5 ميغابايت.",
      settings_remove_photo: "إزالة الصورة الحالية واستخدام الصورة الافتراضية",
      settings_banner_hint: "يغير الغلاف في ملفك الشخصي واللون المستخدم في رأس الدردشة الخاصة بك.",
      settings_banner_locked_hint: "تُفتح ألوان الملف الشخصي في المستوى 20. حتى ذلك الحين، تبقى الحسابات باللونين الأبيض والأسود لتظل ألوان المكافآت ذات معنى.",
      settings_banner_earn_xp: "اربح النقاط من خلال النشر والتعليق والإعجاب والمشاركة في المحادثات.",
      settings_banner_see_table: "انظر إلى جدول مكافآت المستوى.",
      settings_delete_prefix: "اكتب",
      settings_delete_suffix: "للتأكيد",
      achievement_elite_champion_name: "بطل النخبة", achievement_elite_champion_desc: "صل إلى المستوى 20.",
      achievement_mythic_legend_name: "أسطورة", achievement_mythic_legend_desc: "صل إلى المستوى 30.",
      activity_kicker: "سجلك",
      activity_title: "النشاط",
      activity_desc: "المنشورات والردود والإعجابات والمشاركات والمقاطع التي تفاعلت معها مؤخراً.",
      activity_empty_title: "لا يوجد شيء هنا بعد",
      activity_empty_desc: "انشر، علق، أعجب، أعد النشر، أو ارفع مقطعاً لبناء سجل المستوى الخاص بك.",
      activity_type_post: "منشور",
      activity_type_comment: "تعليق",
      activity_type_like: "إعجاب",
      activity_type_repost: "مشاركة",
      activity_type_reel: "مقطع",
      activity_desc_picture: "منشور صورة",
      activity_desc_like: "أعجبت بمنشور.",
      activity_desc_repost: "قمت بمشاركة شيء لشبكتك.",
      activity_desc_reel: "قمت برفع مقطع.",

      level_title_new_adventurer: "مغامر جديد",
      level_title_rising_star: "نجم صاعد",
      level_title_lvl_pro: "محترف المستوى",
      level_title_elite_champion: "بطل النخبة",
      level_title_mythic_legend: "أسطورة",
      level_title_server_icon: "أيقونة السيرفر",





  }
};

const SUPPORTED_LANGS = ['en', 'tr', 'ar'];
const RTL_LANGS = ['ar'];
const STORAGE_KEY = 'lvl_lang';

const TURKISH_SERVER_MESSAGES = {
  "Security check failed. Refresh the page and try again.": "Güvenlik kontrolü başarısız oldu. Sayfayı yenileyip tekrar deneyin.",
  "Supabase connection failed. Add SUPABASE_URL and SUPABASE_SECRET to your .env file.": "Supabase bağlantısı başarısız oldu. .env dosyanıza SUPABASE_URL ve SUPABASE_SECRET ekleyin.",
  "Supabase connection failed. Check your Project URL/DNS and .env values.": "Supabase bağlantısı başarısız oldu. Proje URL'sini, DNS'i ve .env değerlerini kontrol edin.",
  "Supabase key appears to be invalid. Check your SUPABASE_SECRET value.": "Supabase anahtarı geçersiz görünüyor. SUPABASE_SECRET değerini kontrol edin.",
  "Database connection error.": "Veritabanı bağlantı hatası.",
  "An error occurred. Please try again.": "Bir hata oluştu. Lütfen tekrar deneyin.",
  "An error occurred during login.": "Giriş sırasında bir hata oluştu.",
  "Username and password are required.": "Kullanıcı adı ve şifre zorunludur.",
  "Invalid username or password.": "Kullanıcı adı veya şifre hatalı.",
  "Too many failed login attempts. Wait a few minutes and try again.": "Çok fazla başarısız giriş denemesi yapıldı. Birkaç dakika bekleyip tekrar deneyin.",
  "All fields are required.": "Tüm alanlar zorunludur.",
  "Password must be at least 8 characters.": "Şifre en az 8 karakter olmalıdır.",
  "Passwords do not match.": "Şifreler eşleşmiyor.",
  "Username must be 3-24 characters: letters, numbers, or underscores only.": "Kullanıcı adı 3-24 karakter olmalı ve yalnızca harf, rakam veya alt çizgi içermelidir.",
  "This username is already taken.": "Bu kullanıcı adı zaten kullanılıyor.",
  "This email is already registered.": "Bu e-posta zaten kayıtlı.",
  "If that account exists, a reset link has been sent.": "Bu hesap mevcutsa şifre sıfırlama bağlantısı gönderildi.",
  "That reset link is invalid or expired.": "Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.",
  "Password updated. Log in with your new password.": "Şifre güncellendi. Yeni şifrenizle giriş yapın.",
  "Password could not be updated.": "Şifre güncellenemedi.",
  "Post content cannot be empty.": "Gönderi içeriği boş olamaz.",
  "Post cannot exceed 280 characters.": "Gönderi 280 karakteri aşamaz.",
  "Post shared.": "Gönderi paylaşıldı.",
  "Post published.": "Gönderi yayımlandı.",
  "Post deleted.": "Gönderi silindi.",
  "Post not found.": "Gönderi bulunamadı.",
  "Could not delete that post.": "Gönderi silinemedi.",
  "Draft saved.": "Taslak kaydedildi.",
  "Draft deleted.": "Taslak silindi.",
  "Draft not found.": "Taslak bulunamadı.",
  "Write a comment first.": "Önce bir yorum yazın.",
  "Comment cannot exceed 280 characters.": "Yorum 280 karakteri aşamaz.",
  "Comment posted.": "Yorum gönderildi.",
  "Already commented.": "Bu yorum zaten gönderildi.",
  "Already posted.": "Bu gönderi zaten paylaşıldı.",
  "Already sent.": "Bu mesaj zaten gönderildi.",
  "Message cannot exceed 1000 characters.": "Mesaj 1000 karakteri aşamaz.",
  "Message not found.": "Mesaj bulunamadı.",
  "Message deleted.": "Mesaj silindi.",
  "You cannot send a message to yourself.": "Kendinize mesaj gönderemezsiniz.",
  "You cannot interact with this user.": "Bu kullanıcıyla etkileşim kuramazsınız.",
  "You can only delete your own posts.": "Yalnızca kendi gönderilerinizi silebilirsiniz.",
  "You can only delete your own messages.": "Yalnızca kendi mesajlarınızı silebilirsiniz.",
  "Delete for everyone time limit (15 minutes) exceeded.": "Herkesten silme süresi (15 dakika) aşıldı.",
  "Profile updated.": "Profil güncellendi.",
  "Profile not found.": "Profil bulunamadı.",
  "Current password is incorrect.": "Mevcut şifre yanlış.",
  "Your account has been deleted.": "Hesabınız silindi.",
  "Please enter a valid email address.": "Lütfen geçerli bir e-posta adresi girin.",
  "Please wait 30 seconds before sending another message.": "Yeni bir mesaj göndermeden önce 30 saniye bekleyin.",
  "Community created.": "Topluluk oluşturuldu.",
  "Community updated.": "Topluluk güncellendi.",
  "Joined community.": "Topluluğa katıldınız.",
  "Left community.": "Topluluktan ayrıldınız.",
  "Join this community before posting.": "Gönderi paylaşmadan önce bu topluluğa katılın.",
  "Community tables are not ready yet. Apply database/community_schema.sql in Supabase, then try again.": "Topluluk tabloları henüz hazır değil. Supabase'te database/community_schema.sql dosyasını uygulayıp tekrar deneyin.",
  "Reel uploaded.": "Klip yüklendi.",
  "Reel deleted.": "Klip silindi.",
  "Reel not found.": "Klip bulunamadı.",
  "Could not load reels.": "Klipler yüklenemedi.",
  "Could not upload that reel.": "Klip yüklenemedi.",
  "Could not delete that reel.": "Klip silinemedi.",
  "Choose a valid visibility setting.": "Geçerli bir görünürlük seçeneği seçin.",
  "Caption cannot exceed 220 characters.": "Açıklama 220 karakteri aşamaz.",
  "Comments are closed for this reel.": "Bu klipte yorumlar kapalı.",
  "Friend request accepted.": "Arkadaşlık isteği kabul edildi.",
  "Friend request declined.": "Arkadaşlık isteği reddedildi.",
  "File size too large.": "Dosya boyutu çok büyük.",
  "Unsupported file format.": "Desteklenmeyen dosya biçimi.",
  "Access denied.": "Erişim reddedildi.",
  "Action failed.": "İşlem başarısız oldu.",
  "Action failed. Please try again.": "İşlem başarısız oldu. Lütfen tekrar deneyin.",
  "Supabase is not configured.": "Supabase yapılandırılmamış.",
  "Client configured.": "İstemci yapılandırıldı.",
  "Social login identity columns are available.": "Sosyal giriş kimlik sütunları kullanılabilir.",
  "Attachments and deletion columns are available.": "Ek ve silme sütunları kullanılabilir."
};

Object.assign(TURKISH_SERVER_MESSAGES, {
  "Flask secret key": "Flask gizli anahtarı",
  "Admin token": "Yönetici belirteci",
  "App base URL": "Uygulama temel URL'si",
  "OAuth redirect base URL": "OAuth yönlendirme temel URL'si",
  "Supabase connection": "Supabase bağlantısı",
  "Users table": "Kullanıcılar tablosu",
  "Posts table": "Gönderiler tablosu",
  "Reels table": "Klipler tablosu",
  "Communities table": "Topluluklar tablosu",
  "Safety actions table": "Güvenlik işlemleri tablosu",
  "Job positions table": "İş pozisyonları tablosu",
  "Job applications table": "İş başvuruları tablosu",
  "Contact messages table": "İletişim mesajları tablosu",
  "Verification requests table": "Doğrulama talepleri tablosu",
  "OAuth identity columns": "OAuth kimlik sütunları",
  "Messages schema updates": "Mesaj şeması güncellemeleri",
  "Media storage bucket": "Medya depolama alanı",
  "Private attachment bucket": "Özel ek depolama alanı",
  "PWA manifest": "PWA manifest dosyası",
  "Service worker": "Servis çalışanı",
  "PWA 192 icon": "PWA 192 simgesi",
  "PWA 512 icon": "PWA 512 simgesi",
  "Set FLASK_SECRET_KEY in Vercel and local .env before shared testing.": "Ortak testten önce Vercel ve yerel .env içinde FLASK_SECRET_KEY değerini ayarlayın.",
  "Set LVL_ADMIN_TOKEN before using admin-only backend tools.": "Yalnızca yöneticilere özel backend araçlarını kullanmadan önce LVL_ADMIN_TOKEN değerini ayarlayın.",
  "Set APP_BASE_URL to the local, preview, or production app URL.": "APP_BASE_URL değerini yerel, önizleme veya üretim uygulaması URL'si olarak ayarlayın.",
  "OAuth redirects have a configured base URL.": "OAuth yönlendirmeleri için temel URL yapılandırıldı.",
  "Set OAUTH_REDIRECT_BASE_URL or APP_BASE_URL for Google OAuth callbacks.": "Google OAuth geri çağrıları için OAUTH_REDIRECT_BASE_URL veya APP_BASE_URL değerini ayarlayın.",
  "Add SUPABASE_URL and SUPABASE_SECRET to .env.": ".env dosyasına SUPABASE_URL ve SUPABASE_SECRET ekleyin."
});

Object.assign(TURKISH_SERVER_MESSAGES, {
  "Your email has been successfully verified! You can now log in and start leveling up.": "E-postanız başarıyla doğrulandı! Artık giriş yapıp seviye atlamaya başlayabilirsiniz.",
  "Invalid or expired verification link. Please request a new one.": "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı isteyin.",
  "An error occurred during verification.": "Doğrulama sırasında bir hata oluştu.",
  "That social login provider is not supported by LvL.": "Bu sosyal giriş sağlayıcısı LvL tarafından desteklenmiyor.",
  "Supabase connection is required for social login.": "Sosyal giriş için Supabase bağlantısı gereklidir.",
  "Social login did not return an authorization code.": "Sosyal giriş bir yetkilendirme kodu döndürmedi.",
  "Start with a social login provider first.": "Önce bir sosyal giriş sağlayıcısıyla başlayın.",
  "All fields are required to finish social registration.": "Sosyal kaydı tamamlamak için tüm alanlar zorunludur.",
  "Your social login is now connected to your existing LvL account.": "Sosyal girişiniz mevcut LvL hesabınıza bağlandı.",
  "The reply target was not found.": "Yanıtlanacak içerik bulunamadı.",
  "Enter a valid GIF URL.": "Geçerli bir GIF bağlantısı girin.",
  "Choose someone else to share with.": "Paylaşmak için başka birini seçin.",
  "You cannot share posts with this user.": "Bu kullanıcıyla gönderi paylaşamazsınız.",
  "Post shared via DM!": "Gönderi direkt mesajla paylaşıldı!",
  "Could not share post.": "Gönderi paylaşılamadı.",
  "Image upload failed. Try again.": "Görsel yüklenemedi. Tekrar deneyin.",
  "Write a post or add an image first.": "Önce bir gönderi yazın veya görsel ekleyin.",
  "Shared to community.": "Toplulukta paylaşıldı.",
  "There is no friend request for you to respond to.": "Yanıtlayabileceğiniz bir arkadaşlık isteği yok.",
  "First name, last name, and username are required.": "Ad, soyad ve kullanıcı adı zorunludur.",
  "Website must start with http:// or https://.": "Web sitesi http:// veya https:// ile başlamalıdır.",
  "Type your username exactly to delete your account.": "Hesabınızı silmek için kullanıcı adınızı eksiksiz yazın.",
  "Enter your current password to delete your account.": "Hesabınızı silmek için mevcut şifrenizi girin.",
  "Current password could not be verified.": "Mevcut şifre doğrulanamadı.",
  "Could not delete your account.": "Hesabınız silinemedi.",
  "Your profile is ready.": "Profiliniz hazır.",
  "Thank you for your valuable suggestion! We appreciate your feedback to help level up our platform.": "Değerli öneriniz için teşekkür ederiz! Platformumuzu geliştirmemize yardımcı olan geri bildiriminizi önemsiyoruz.",
  "Your message has been sent successfully! We'll get back to you soon.": "Mesajınız başarıyla gönderildi! En kısa sürede size döneceğiz.",
  "Your verification request has been submitted successfully! Admins will review it soon.": "Doğrulama talebiniz başarıyla gönderildi! Yöneticiler yakında inceleyecek.",
  "CV must be a PDF, DOC, or DOCX file.": "CV, PDF, DOC veya DOCX biçiminde olmalıdır.",
  "A CV / resume is required to submit your application.": "Başvurunuzu göndermek için CV / özgeçmiş gereklidir.",
  "Community name is required and must be 80 characters or less.": "Topluluk adı zorunludur ve en fazla 80 karakter olabilir.",
  "Community description cannot exceed 240 characters.": "Topluluk açıklaması 240 karakteri aşamaz.",
  "That community URL is already taken.": "Bu topluluk URL'si zaten kullanılıyor.",
  "Only the community owner can edit this community.": "Bu topluluğu yalnızca sahibi düzenleyebilir.",
  "Owners cannot leave their own community.": "Topluluk sahipleri kendi topluluklarından ayrılamaz.",
  "You cannot high-five yourself.": "Kendinize beşlik gönderemezsiniz.",
  "That safety action is not available.": "Bu güvenlik işlemi kullanılamıyor.",
  "File size too large.": "Dosya boyutu çok büyük.",
  "Unsupported file format.": "Desteklenmeyen dosya biçimi.",
  "Access denied.": "Erişim reddedildi.",
  "Action failed. Please try again.": "İşlem başarısız oldu. Lütfen tekrar deneyin.",
  "An error occurred. Please try again.": "Bir hata oluştu. Lütfen tekrar deneyin.",
  "Could not delete post.": "Gönderi silinemedi.",
  "Could not delete that post.": "Gönderi silinemedi.",
  "Post deleted.": "Gönderi silindi.",
  "Login required.": "Giriş yapmanız gerekiyor.",
  "Login successful.": "Giriş başarılı.",
  "Post not found.": "Gönderi bulunamadı.",
  "You can only delete your own posts.": "Yalnızca kendi gönderilerinizi silebilirsiniz.",
  "Could not post comment.": "Yorum paylaşılamadı.",
  "Reply not found.": "Yanıt bulunamadı.",
  "You can only delete your own replies.": "Yalnızca kendi yanıtlarınızı silebilirsiniz.",
  "Could not delete that reply.": "Yanıt silinemedi."
});

function translateServerMessage(message, lang) {
  const original = String(message || '').trim();
  if (!original || lang !== 'tr') return original;
  if (TURKISH_SERVER_MESSAGES[original]) return TURKISH_SERVER_MESSAGES[original];

  let match = original.match(/^Level up! You reached LvL (\d+)\.$/);
  if (match) return `Seviye atladınız! LvL ${match[1]} seviyesine ulaştınız.`;
  match = original.match(/^Welcome to LvL, (.+)! You've earned 20 XP for joining\.$/);
  if (match) return `LvL'ye hoş geldin, ${match[1]}! Katıldığın için 20 XP kazandın.`;
  match = original.match(/^Signed in with (.+?)\.?$/i);
  if (match) {
      let provider = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      return `${provider} ile giriş yapıldı.`;
  }
  match = original.match(/^The ([a-z0-9_]+) table is queryable\.$/i);
  if (match) return `${match[1]} tablosu sorgulanabiliyor.`;
  match = original.match(/^(.+) is configured\.$/);
  if (match) return `${match[1]} yapılandırıldı.`;
  match = original.match(/^(.+) is available\.$/);
  if (match) return `${match[1]} kullanılabilir.`;
  match = original.match(/^(.+) exists\.$/);
  if (match) return `${match[1]} mevcut.`;
  match = original.match(/^(.+) is missing\.$/);
  if (match) return `${match[1]} eksik.`;
  match = original.match(/^Run (.+) in Supabase\.$/);
  if (match) return `Supabase'te ${match[1]} dosyasını çalıştırın.`;
  match = original.match(/^Set (.+) before (.+)\.$/);
  if (match) return `${match[2]} öncesinde ${match[1]} değerini ayarlayın.`;
  match = original.match(/^Add (.+) to (.+)\.$/);
  if (match) return `${match[2]} içine ${match[1]} ekleyin.`;
  return original;
}

function formatRelativeTime(value, lang) {
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - target.getTime()) / 1000));
  let amount, unit;
  if (seconds < 60) { amount = seconds; unit = 'second'; }
  else if (seconds < 3600) { amount = Math.floor(seconds / 60); unit = 'minute'; }
  else if (seconds < 86400) { amount = Math.floor(seconds / 3600); unit = 'hour'; }
  else if (seconds < 2592000) { amount = Math.floor(seconds / 86400); unit = 'day'; }
  else if (seconds < 31536000) { amount = Math.floor(seconds / 2592000); unit = 'month'; }
  else { amount = Math.max(1, Math.floor(seconds / 31536000)); unit = 'year'; }
  const suffixes = lang === 'tr'
    ? {second:'sn', minute:'dk', hour:'sa', day:'g', month:'ay', year:'yıl'}
    : {second:'s', minute:'m', hour:'h', day:'d', month:'mo', year:'y'};
  return `${amount}${suffixes[unit]}`;
}
function getCurrentLang() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s && SUPPORTED_LANGS.includes(s)) return s; } catch(_){}
  const b = (navigator.language||'en').split('-')[0].toLowerCase();
  return SUPPORTED_LANGS.includes(b) ? b : 'en';
}
function applyLanguage(lang, save) {
  if (save===undefined) save=true;
  if (!SUPPORTED_LANGS.includes(lang)) lang='en';
  const t=TRANSLATIONS[lang], html=document.documentElement;
  html.setAttribute('lang',lang);
  html.setAttribute('dir', RTL_LANGS.includes(lang)?'rtl':'ltr');
  document.querySelectorAll('[data-i18n]').forEach(function(el){const k=el.getAttribute('data-i18n');if(t[k]!==undefined)el.textContent=t[k];});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){const k=el.getAttribute('data-i18n-placeholder');if(t[k]!==undefined)el.setAttribute('placeholder',t[k]);});
  document.querySelectorAll('[data-i18n-aria]').forEach(function(el){const k=el.getAttribute('data-i18n-aria');if(t[k]!==undefined)el.setAttribute('aria-label',t[k]);});
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){const k=el.getAttribute('data-i18n-title');if(t[k]!==undefined)el.setAttribute('title',t[k]);});
  document.querySelectorAll('[data-i18n-alt]').forEach(function(el){const k=el.getAttribute('data-i18n-alt');if(t[k]!==undefined)el.setAttribute('alt',t[k]);});
  document.querySelectorAll('[data-i18n-option]').forEach(function(el){const k=el.getAttribute('data-i18n-option');if(t[k]!==undefined)el.textContent=t[k];});
  document.querySelectorAll('[data-i18n-document]').forEach(function(el){const k=el.getAttribute('data-i18n-document');if(t[k]!==undefined)document.title=t[k]+' - LvL';});
  document.querySelectorAll('[data-server-message]').forEach(function(el){
    if (!el.dataset.serverMessageOriginal) el.dataset.serverMessageOriginal = el.textContent.trim();
    const target = el.querySelector('.flash-message-text') || el;
    target.textContent = translateServerMessage(el.dataset.serverMessageOriginal, lang);
  });
  document.querySelectorAll('[data-relative-time]').forEach(function(el){
    const formatted = formatRelativeTime(el.getAttribute('datetime') || el.dataset.relativeTime, lang);
    if (formatted) el.textContent = formatted;
  });
  document.querySelectorAll('[data-lang-btn]').forEach(function(btn){const l=btn.getAttribute('data-lang-btn');btn.classList.toggle('active',l===lang);btn.setAttribute('aria-pressed',l===lang?'true':'false');});
  document.querySelectorAll('svg[title="Official Account"], svg[title="Official account"]').forEach(function(el){
    el.setAttribute('title', t.official_account || (lang === 'tr' ? 'Resmî hesap' : 'Official account'));
  });
  document.querySelectorAll('[data-high-five-streak-title]').forEach(function(el){
    const count = el.dataset.streakCount || '0';
    const name = el.dataset.streakName || '';
    const label = lang === 'tr' ? `${count} günlük beşlik serisi` : `${count}-day high-five streak`;
    el.setAttribute('title', name ? (lang === 'tr' ? `${label} · ${name}` : `${label} with ${name}`) : label);
  });
  if(save){try{localStorage.setItem(STORAGE_KEY,lang);}catch(_){};}
  document.dispatchEvent(new CustomEvent('lvl:langchange',{detail:{lang:lang}}));
}
function initI18n(){applyLanguage(getCurrentLang(),false);}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initI18n);}else{initI18n();}
window.LvLI18n={applyLanguage:applyLanguage,getCurrentLang:getCurrentLang,translateServerMessage:translateServerMessage,formatRelativeTime:formatRelativeTime,TRANSLATIONS:TRANSLATIONS,STORAGE_KEY:STORAGE_KEY};

// Append post action translations
if (typeof TRANSLATIONS !== 'undefined') {
    Object.assign(TRANSLATIONS.en, {
      post_reply_aria: "Reply to post", post_reply_title: "Reply",
      post_repost_aria: "Repost", post_repost_title: "Repost",
      post_like_aria: "Like post", post_like_title: "Like"
    });
    Object.assign(TRANSLATIONS.tr, {
      post_reply_aria: "Gönderiye yanıt ver", post_reply_title: "Yanıtla",
      post_repost_aria: "Yeniden paylaş", post_repost_title: "Yeniden paylaş",
      post_like_aria: "Gönderiyi beğen", post_like_title: "Beğen"
    });
    Object.assign(TRANSLATIONS.ar, {
      post_reply_aria: "الرد على المنشور", post_reply_title: "رد",
      post_repost_aria: "إعادة نشر", post_repost_title: "إعادة نشر",
      post_like_aria: "الإعجاب بالمنشور", post_like_title: "إعجاب"
    });
}

// Frontend localization coverage for the public TR / EN product surfaces.
// These assignments intentionally override older duplicate keys above.
Object.assign(TRANSLATIONS.en, {
  nav_primary_aria: "Primary navigation",
  profile_posts: "Posts",
  profile_likes: "Likes",
  profile_no_posts: "No posts",
  profile_no_posts_desc: "This profile has not posted yet.",
  profile_no_liked_posts: "No liked posts",
  profile_no_liked_posts_desc: "This user hasn't liked any posts yet.",
  community_desc_main: "Move between followers, following, and group threads without leaving the LvL feed.",
  community_create_group: "Create group",
  community_join_desc: "Join the conversation",
  timeline_hub: "Timeline hub",
  timeline_hub_title: "Choose whose posts shape your LvL",
  settings_language_title: "Language",
  nav_mobile_primary_aria: "Mobile navigation",
  nav_page_tools_aria: "Page tools",
  nav_more_options_aria: "More options",
  nav_close: "Close",
  back: "Go back",
  avatar_alt: "Profile picture",
  official_account: "Official account",
  auth_login_page_title: "Login",
  auth_ranks: "Ranks",
  auth_badges: "Badges",
  drafts_title: "Drafts",
  drafts_description: "Finish an idea before publishing it.",
  drafts_back_to_feed: "Back to feed",
  draft_image_post: "Image post",
  draft_last_saved: "Last saved",
  draft_edit: "Edit",
  draft_delete: "Delete draft",
  drafts_empty_title: "No drafts yet",
  drafts_empty_desc: "Use “Save draft” in the home composer.",
  draft_save: "Save draft",
  draft_discard: "Discard draft",
  edit_post_title: "Edit post",
  edit_post_description: "Review your text before saving or publishing.",
  previous_btn: "Previous",
  more_btn: "More",
  more_posts_btn: "More posts",
  reel_upload_btn: "Upload",
  reel_upload_clip: "Upload clip",
  reel_empty_title: "No clips yet",
  reel_empty_desc: "Upload the first LvL clip or check Setup Health if uploads are not appearing.",
  reel_setup_health: "Setup Health",
  reel_no_more: "No more clips",
  reel_feed_aria: "Clips feed",
  reel_filter_aria: "Clips filter",
  reel_video_unsupported: "Your browser does not support short videos.",
  reel_play_pause_aria: "Play or pause clip",
  reel_play: "Play",
  reel_pause: "Pause",
  reel_demo: "Demo",
  reel_actions_aria: "Clip actions",
  reel_toggle_sound: "Toggle sound",
  reel_muted: "Muted",
  reel_sound_on: "Sound on",
  reel_like_aria: "Like clip",
  reel_view_comments: "View comments",
  reel_share_aria: "Share clip with friends",
  reel_download_aria: "Download clip",
  reel_delete_aria: "Delete clip",
  reel_comments: "Comments",
  reel_comments_aria: "Clip comments",
  reel_close_comments: "Close comments",
  reel_loading_comments: "Loading comments…",
  reel_comment_placeholder: "Add a comment…",
  reel_comment_post: "Post",
  reel_comments_unavailable: "Comments are not available.",
  reel_comments_load_error: "Could not load comments.",
  reel_comments_empty: "No comments yet. Be the first!",
  reel_upload_kicker: "Create video",
  reel_upload_title: "Upload Clip",
  reel_upload_desc: "Upload a short vertical video for the Clips feed. Public clips can appear in For You, follower clips stay close to your network, and community clips attach to a group.",
  reel_choose_video: "Choose video",
  reel_video_selected: "Video selected",
  reel_video_too_large: "This video is larger than the configured upload limit.",
  reel_video_type_error: "Choose an MP4, WebM, MOV, or M4V video.",
  reel_ready_upload: "Ready to upload.",
  reel_unmute_aria: "Unmute clips",
  reel_mute_aria: "Mute clips",
  reel_share_no_users: "No users found.",
  reel_share_searching: "Searching…",
  reel_share_search_error: "Could not search users.",
  reel_share_load_error: "Could not load friends.",
  reel_file_hint: "MP4, WebM, MOV, or M4V. Use short mobile clips for the cleanest feed fit.",
  reel_max_size_prefix: "Maximum",
  reel_caption: "Caption",
  reel_caption_placeholder: "Write a caption",
  reel_characters_left: "characters left",
  reel_visibility: "Visibility",
  reel_visibility_public: "Public",
  reel_visibility_followers: "Followers",
  reel_visibility_community: "Community",
  reel_visibility_private: "Private",
  reel_visibility_hint: "Choose where the clip can be discovered after upload.",
  reel_choose_community: "Choose community",
  reel_community_hint: "Required only when Visibility is set to Community.",
  reel_allow_comments: "Allow comments",
  reel_allow_downloads: "Allow downloads",
  reel_autoplay_next: "Autoplay next",
  reel_settings_aria: "Clip settings",
  reel_upload_submit: "Upload clip",
  community_detail_kicker: "Community",
  community_created_by: "Created by",
  community_default_owner: "owner",
  community_edit: "Edit",
  community_joined: "Joined",
  community_join: "Join",
  community_compose_placeholder: "Share something with this community",
  community_add_image: "Add image",
  community_remove_image: "Remove",
  community_join_to_post: "Join to post",
  community_join_to_post_desc: "Members can share posts, images, and replies in this community.",
  community_empty_posts_title: "No community posts yet",
  community_empty_posts_desc: "Start the conversation with a post, image, or reply.",
  community_members: "Members",
  community_no_members: "No members yet.",
  community_role_owner: "owner",
  community_role_member: "member",
  community_form_create_title: "Create Community",
  community_form_edit_title: "Edit Community",
  community_following_empty_title: "Follow people to fill this timeline",
  post_not_found_title: "Post not found",
  post_not_found_desc: "The post was deleted or never existed.",
  post_title: "Post",
  post_positive_desc: "Make someone's day better with positivity.",
  post_copy_link: "Copy link",
  post_share_dm: "Share via DM",
  post_edit: "Edit post",
  post_delete: "Delete post",
  post_report: "Report post",
  post_options: "Post options",
  post_photo: "Photo",
  post_sticker: "Sticker",
  post_gif_url: "GIF image URL",
  post_comment: "Comment",
  post_replies: "Replies",
  post_no_comments: "No comments yet",
  post_no_comments_desc: "Remember to be kind to everyone.",
  search_top: "Top",
  search_title: "Search",
  search_latest: "Latest",
  search_people: "People",
  search_anything_title: "Search for anything",
  search_anything_desc: "Find people, posts, and more on LvL.",
  search_discover_people: "People to discover",
  search_recent_posts: "Recent posts",
  search_no_results_for: "No results for",
  search_new_to_lvl: "New to LvL.",
  search_more_people: "More people",
  search_more_results: "More results",
  settings_crop_title: "Crop and zoom",
  settings_crop_description: "Drag the image to reposition it. The saved photo uses the square preview.",
  settings_language_aria: "Language selection",
  share_dm_title: "Share via DM",
  share_dm_description: "Select a person to send this post to.",
  share_dm_empty: "No users found to share with.",
  share_send_action: "Send",
  install_title: "Install LvL",
  install_desc: "Put LvL on your home screen for a faster app-like experience.",
  install_manual: "Use your browser menu and choose Install app or Add to Home Screen.",
  install_manual_fallback: "Install LvL from your browser menu when the native install button is not available.",
  install_ios_desc: "Install LvL from Safari using Share, then Add to Home Screen.",
  install_step_share: "Tap Share in Safari.",
  install_step_add: "Choose Add to Home Screen.",
  install_step_open: "Open LvL from the new icon.",
  install_action: "Install app",
  install_dismiss: "Not now",
  messages_shared_post: "Shared a post:",
  messages_shared_clip: "Shared a clip:",
  messages_load_older: "Load older messages",
  message_delete_options: "Delete options",
  profile_picture: "Profile picture",
  copied_label: "Copied",
  copy_prompt: "Copy this link",
  action_failed: "Action did not finish. Try again.",
  mobile_create_post: "Create post",
  unread_messages: "unread messages",
  unread_notifications: "unread notifications",
  unread_more: "unread items",
  onboarding_title: "Make LvL feel like yours",
  onboarding_desc: "Add a few details and follow people so your feed is not empty.",
  onboarding_profile_basics: "Profile basics",
  onboarding_bio: "Bio",
  onboarding_bio_placeholder: "One short line about you",
  onboarding_location: "Location",
  onboarding_interests: "Interests",
  onboarding_follow_people: "Follow a few people",
  onboarding_skip: "Skip",
  onboarding_finish: "Finish setup",
  interest_campus: "Campus",
  interest_study: "Study",
  interest_sports: "Sports",
  interest_music: "Music",
  interest_food: "Food",
  interest_gaming: "Gaming",
  interest_events: "Events",
  interest_tech: "Tech",
  oauth_page_title: "Finish Social Login",
  oauth_finish_title: "Finish your LvL profile.",
  oauth_finish_desc: "Your social provider approved your identity. LvL still needs your nickname, age check, and profile basics before the account opens.",
  oauth_social_login: "Social login",
  oauth_profile_ready: "Profile ready",
  oauth_step: "Step 2 of 2",
  oauth_create_title: "Create your LvL account",
  oauth_create_desc: "Sign-in worked. Complete these required LvL profile fields to create the account.",
  oauth_create_action: "Create account and enter LvL",
  oauth_selected_avatar: "Selected default avatar",
  reset_page_title: "Reset Password",
  forgot_page_title: "Forgot Password",
  reset_hero_title: "Set a new password.",
  forgot_hero_title: "Get back into LvL.",
  reset_hero_desc: "Choose a new password with at least 8 characters.",
  forgot_hero_desc: "Enter your nickname or email and we will send a reset link if the account exists.",
  reset_title: "Reset password",
  forgot_title: "Forgot password",
  reset_new_password: "New password",
  reset_confirm_password: "Confirm password",
  reset_update_action: "Update password",
  reset_send_action: "Send reset link",
  reset_back_login: "Back to login",
  social_back_profile: "Back to profile",
  social_friends_desc: "People with an active 7-day high-five or message streak.",
  social_connected_desc: "People connected to this profile.",
  social_empty_title: "No connections yet",
  social_empty_desc: "This list will update as people connect on LvL.",
  social_day_streak: "day streak",
  verification_no_notes: "No notes provided.",
  verification_status_approved: "Approved",
  verification_status_rejected: "Rejected",
  verification_status_pending: "Pending",
  verification_cooldown: "Reapplication cooldown is active. You can apply again in:",
  verification_links_placeholder: "e.g. https://example.com/username, https://mywebsite.com",
  guide_sections_aria: "LvL Guide sections"
  ,verification_login_required: "Please log in to submit a verification request."
  ,auth_login_action: "Log in"
  ,community_summary_aria: "Community timeline counts"
  ,community_shortcuts_aria: "Community shortcuts"
  ,community_timelines_aria: "Community timelines"
  ,community_feeds_aria: "LvL community feeds"
  ,community_join_aria: "Communities to join"
  ,brand_home_aria: "LvL home"
  ,timeline_aria: "Timeline"
  ,timeline_pagination_aria: "Timeline pagination"
  ,saved_drafts_aria: "Saved drafts"
  ,post_share_aria: "Share post"
  ,post_share_title: "Share via direct message"
  ,post_bookmark_aria: "Bookmark post"
  ,post_bookmark_title: "Bookmark"
  ,post_reply_tools_aria: "Reply media tools"
  ,comment_reply_aria: "Reply to comment"
  ,comment_repost_aria: "Repost comment"
  ,comment_like_aria: "Like comment"
  ,sticker_aria: "Sticker"
  ,profile_view_picture_aria: "View profile picture"
  ,profile_high_five_aria: "High-five profile"
  ,profile_xp_aria: "Profile XP summary"
  ,profile_xp_progress_aria: "XP progress to next level"
  ,profile_achievements_aria: "Profile achievements"
  ,profile_tabs_aria: "Profile tabs"
  ,profile_pagination_aria: "Profile post pagination"
  ,messages_back_people_aria: "Back to people"
  ,messages_cancel_upload_aria: "Cancel upload"
  ,messages_add_attachment_aria: "Add attachment"
  ,messages_send_aria: "Send message"
  ,messages_close_new_aria: "Close new conversation panel"
  ,guide_how_aria: "How LvL works"
  ,guide_roadmap_aria: "LvL reward roadmap"
  ,activity_recent_aria: "Recent activity"
  ,home_reels_aria: "Home clips"
  ,home_media_aria: "Non-clip media"
  ,cancel_btn: "Cancel"
  ,share_btn: "Share"
  profile_streak_days: "day streak",
  profile_streak_friend_prefix: "Friend streak with",
  profile_replies: "Replies",
  ,composer_image_selected: "Image selected"
  ,composer_saved_image: "Saved image attached"
  ,draft_image_label: "Image draft"
  ,draft_untitled_label: "Untitled draft"
  ,upload_failed: "Upload failed"
  ,upload_error: "Upload error"
  ,upload_wait: "Please wait for the file to finish uploading."
  ,profile_preview_your_name: "Your name"
  ,profile_preview_username: "username"
  ,home_unmute_aria: "Unmute"
  ,home_mute_aria: "Mute"
  ,reply_sticker_selected: "Sticker selected:"
  ,reply_photo_selected: "Photo selected:"
  ,reply_singular: "reply"
  ,reply_plural: "replies"
  ,reply_post_error: "Reply could not be posted."
  ,birthday_future_error: "Birthday cannot be in the future."
  ,birthday_min_age_error: "You must be at least 14 years old to use LvL."
  ,birthday_realistic_error: "Please enter a realistic birthday."
  ,notif_open_profile: "View profile"
  ,notif_update: "sent an update"
  ,notif_someone: "Someone"
  ,notif_just_now: "just now"
  ,message_send_error: "Message did not send. Try again."
  ,message_delete_error: "Failed to delete message. Try again."
  ,comment_post_error: "Comment did not post. Try again."
  ,settings_photo_size_error: "Profile photos must be 5 MB or smaller."
});

Object.assign(TRANSLATIONS.tr, {
  nav_primary_aria: "Ana gezinme",
  community_join_desc: "Sohbete katıl",
  settings_language_title: "Dil",
  profile_no_bio: "Henüz biyografi yok.",
  no_bio: "Henüz biyografi yok.",
  profile_posts: "Gönderiler",
  profile_replies: "Yanıtlar",
  profile_likes: "Beğeniler",
  profile_streak_hint: "Arkadaş olmak için 7 gün boyunca her gün beşlik çakın veya mesajlaşın.",
  notif_reel_like: "klibinizi beğendi",
  notif_reel_comment: "klibinize yorum yaptı",
  verification_subtitle: "Profilinizde camgöbeği doğrulanmış rozeti almak için kimliğinizi doğrulayın.",
  verification_approved: "Tebrikler! Profiliniz doğrulandı. Camgöbeği rozet profil kartınızda etkin.",
  verification_submit_desc: "Lütfen resmî web siteleri veya belge yüklemeleri gibi kimlik kanıtları sağlayın ve hesabınızın neden doğrulanması gerektiğini belirtin.",
  nav_mobile_primary_aria: "Mobil gezinme",
  nav_page_tools_aria: "Sayfa araçları",
  nav_more_options_aria: "Diğer seçenekler",
  nav_close: "Kapat",
  back: "Geri dön",
  avatar_alt: "Profil resmi",
  official_account: "Resmî hesap",
  auth_login_page_title: "Giriş Yap",
  auth_ranks: "Seviyeler",
  auth_badges: "Rozetler",
  drafts_title: "Taslaklar",
  drafts_description: "Bir fikri yayımlamadan önce tamamlayın.",
  drafts_back_to_feed: "Akışa dön",
  draft_image_post: "Görsel gönderisi",
  draft_last_saved: "Son kaydedilme",
  draft_edit: "Düzenle",
  draft_delete: "Taslağı Sil",
  drafts_empty_title: "Henüz taslak yok",
  drafts_empty_desc: "Ana sayfadaki oluşturucuda “Taslak Olarak Kaydet” seçeneğini kullanın.",
  draft_save: "Taslak Olarak Kaydet",
  draft_discard: "Taslağı Bırak",
  edit_post_title: "Gönderiyi düzenle",
  edit_post_description: "Kaydetmeden veya yayımlamadan önce metninizi gözden geçirin.",
  previous_btn: "Önceki",
  more_btn: "Daha fazla",
  more_posts_btn: "Daha fazla gönderi",
  reel_upload_btn: "Yükle",
  reel_upload_clip: "Klip yükle",
  reel_empty_title: "Henüz klip yok",
  reel_empty_desc: "İlk LvL klibini yükleyin veya yüklemeler görünmüyorsa Kurulum Durumu'nu kontrol edin.",
  reel_setup_health: "Kurulum Durumu",
  reel_no_more: "Başka klip yok",
  reel_feed_aria: "Klip akışı",
  reel_filter_aria: "Klip filtresi",
  reel_video_unsupported: "Tarayıcınız kısa videoları desteklemiyor.",
  reel_play_pause_aria: "Klibi oynat veya duraklat",
  reel_play: "Oynat",
  reel_pause: "Duraklat",
  reel_demo: "Demo",
  reel_actions_aria: "Klip işlemleri",
  reel_toggle_sound: "Sesi aç veya kapat",
  reel_muted: "Sessiz",
  reel_sound_on: "Ses açık",
  reel_like_aria: "Klibi beğen",
  reel_view_comments: "Yorumları görüntüle",
  reel_share_aria: "Klibi arkadaşlarla paylaş",
  reel_download_aria: "Klibi indir",
  reel_delete_aria: "Klibi sil",
  reel_comments: "Yorumlar",
  reel_comments_aria: "Klip yorumları",
  reel_close_comments: "Yorumları kapat",
  reel_loading_comments: "Yorumlar yükleniyor…",
  reel_comment_placeholder: "Yorum ekle…",
  reel_comment_post: "Paylaş",
  reel_comments_unavailable: "Yorumlar kullanılamıyor.",
  reel_comments_load_error: "Yorumlar yüklenemedi.",
  reel_comments_empty: "Henüz yorum yok. İlk yorumu siz yapın!",
  reel_upload_kicker: "Video oluştur",
  reel_upload_title: "Klip Yükle",
  reel_upload_desc: "Klip akışı için kısa ve dikey bir video yükleyin. Herkese açık klipler Sizin İçin bölümünde görünebilir; takipçi klipleri ağınıza yakın kalır ve topluluk klipleri bir gruba bağlanır.",
  reel_choose_video: "Video seç",
  reel_video_selected: "Video seçildi",
  reel_video_too_large: "Bu video, yapılandırılan yükleme sınırından büyük.",
  reel_video_type_error: "MP4, WebM, MOV veya M4V biçiminde bir video seçin.",
  reel_ready_upload: "Yüklemeye hazır.",
  reel_unmute_aria: "Kliplerin sesini aç",
  reel_mute_aria: "Klipleri sessize al",
  reel_share_no_users: "Kullanıcı bulunamadı.",
  reel_share_searching: "Aranıyor…",
  reel_share_search_error: "Kullanıcılar aranamadı.",
  reel_share_load_error: "Arkadaşlar yüklenemedi.",
  reel_file_hint: "MP4, WebM, MOV veya M4V. En temiz akış görünümü için kısa mobil klipler kullanın.",
  reel_max_size_prefix: "En fazla",
  reel_caption: "Açıklama",
  reel_caption_placeholder: "Bir açıklama yazın",
  reel_characters_left: "karakter kaldı",
  reel_visibility: "Görünürlük",
  reel_visibility_public: "Herkese açık",
  reel_visibility_followers: "Takipçiler",
  reel_visibility_community: "Topluluk",
  reel_visibility_private: "Özel",
  reel_visibility_hint: "Klibin yüklendikten sonra nerede keşfedilebileceğini seçin.",
  reel_choose_community: "Topluluk seç",
  reel_community_hint: "Yalnızca görünürlük Topluluk olarak ayarlandığında gereklidir.",
  reel_allow_comments: "Yorumlara izin ver",
  reel_allow_downloads: "İndirmelere izin ver",
  reel_autoplay_next: "Sonrakini otomatik oynat",
  reel_settings_aria: "Klip ayarları",
  reel_upload_submit: "Klip yükle",
  community_detail_kicker: "Topluluk",
  community_created_by: "Oluşturan",
  community_default_owner: "sahip",
  community_edit: "Düzenle",
  community_joined: "Katıldınız",
  community_join: "Katıl",
  community_compose_placeholder: "Bu toplulukta bir şey paylaşın",
  community_add_image: "Görsel ekle",
  community_remove_image: "Kaldır",
  community_join_to_post: "Gönderi paylaşmak için katılın",
  community_join_to_post_desc: "Üyeler bu toplulukta gönderi, görsel ve yanıt paylaşabilir.",
  community_empty_posts_title: "Henüz topluluk gönderisi yok",
  community_empty_posts_desc: "Bir gönderi, görsel veya yanıtla sohbeti başlatın.",
  community_members: "Üyeler",
  community_no_members: "Henüz üye yok.",
  community_role_owner: "sahip",
  community_role_member: "üye",
  community_form_create_title: "Topluluk Oluştur",
  community_form_edit_title: "Topluluğu Düzenle",
  community_following_empty_title: "Bu akışı doldurmak için kişileri takip edin",
  post_not_found_title: "Gönderi bulunamadı",
  post_not_found_desc: "Gönderi silinmiş veya hiç var olmamış olabilir.",
  post_title: "Gönderi",
  post_positive_desc: "Olumlu bir paylaşımla birinin gününü güzelleştirin.",
  post_copy_link: "Bağlantıyı kopyala",
  post_share_dm: "Direkt mesajla paylaş",
  post_edit: "Gönderiyi düzenle",
  post_delete: "Gönderiyi sil",
  post_report: "Gönderiyi bildir",
  post_options: "Gönderi seçenekleri",
  post_photo: "Fotoğraf",
  post_sticker: "Çıkartma",
  post_gif_url: "GIF görsel bağlantısı",
  post_comment: "Yorum Yap",
  post_replies: "Yanıtlar",
  post_no_comments: "Henüz yorum yok",
  post_no_comments_desc: "Herkese karşı nazik olmayı unutmayın.",
  search_top: "Öne çıkanlar",
  search_title: "Ara",
  search_latest: "En yeni",
  search_people: "Kişiler",
  search_anything_title: "LvL'de arayın",
  search_anything_desc: "Kişileri, gönderileri ve daha fazlasını bulun.",
  search_discover_people: "Keşfedilecek kişiler",
  search_recent_posts: "Son gönderiler",
  search_no_results_for: "Sonuç bulunamadı:",
  search_new_to_lvl: "LvL'e yeni katıldı.",
  search_more_people: "Daha fazla kişi",
  search_more_results: "Daha fazla sonuç",
  settings_crop_title: "Kırp ve yakınlaştır",
  settings_crop_description: "Görseli yeniden konumlandırmak için sürükleyin. Kaydedilen fotoğraf kare önizlemeyi kullanır.",
  settings_language_aria: "Dil seçimi",
  share_dm_title: "Direkt Mesajla Paylaş",
  share_dm_description: "Bu gönderiyi göndermek istediğiniz kişiyi seçin.",
  share_dm_empty: "Paylaşılabilecek kullanıcı bulunamadı.",
  share_send_action: "Gönder",
  install_title: "LvL'yi Yükle",
  install_desc: "Daha hızlı, uygulama benzeri bir deneyim için LvL'yi ana ekranınıza ekleyin.",
  install_manual: "Tarayıcı menüsünden Uygulamayı yükle veya Ana Ekrana Ekle seçeneğini kullanın.",
  install_manual_fallback: "Yerel yükleme düğmesi kullanılamıyorsa LvL'yi tarayıcı menüsünden yükleyin.",
  install_ios_desc: "Safari'de Paylaş'ı, ardından Ana Ekrana Ekle'yi kullanarak LvL'yi yükleyin.",
  install_step_share: "Safari'de Paylaş'a dokunun.",
  install_step_add: "Ana Ekrana Ekle'yi seçin.",
  install_step_open: "Yeni simgeden LvL'yi açın.",
  install_action: "Uygulamayı yükle",
  install_dismiss: "Şimdi değil",
  messages_shared_post: "Bir gönderi paylaştı:",
  messages_shared_clip: "Bir klip paylaştı:",
  messages_load_older: "Eski mesajları yükle",
  message_delete_options: "Silme seçenekleri",
  profile_picture: "Profil resmi",
  copied_label: "Kopyalandı",
  copy_prompt: "Bu bağlantıyı kopyalayın",
  action_failed: "İşlem tamamlanamadı. Tekrar deneyin.",
  mobile_create_post: "Gönderi oluştur",
  unread_messages: "okunmamış mesaj",
  unread_notifications: "okunmamış bildirim",
  unread_more: "okunmamış öğe",
  onboarding_title: "LvL'yi kendinize göre şekillendirin",
  onboarding_desc: "Akışınız boş kalmasın diye birkaç bilgi ekleyin ve kişileri takip edin.",
  onboarding_profile_basics: "Profil bilgileri",
  onboarding_bio: "Hakkında",
  onboarding_bio_placeholder: "Kendiniz hakkında kısa bir cümle",
  onboarding_location: "Konum",
  onboarding_interests: "İlgi alanları",
  onboarding_follow_people: "Birkaç kişiyi takip edin",
  onboarding_skip: "Atla",
  onboarding_finish: "Kurulumu tamamla",
  interest_campus: "Kampüs",
  interest_study: "Eğitim",
  interest_sports: "Spor",
  interest_music: "Müzik",
  interest_food: "Yemek",
  interest_gaming: "Oyun",
  interest_events: "Etkinlikler",
  interest_tech: "Teknoloji",
  oauth_page_title: "Sosyal Girişi Tamamla",
  oauth_finish_title: "LvL profilinizi tamamlayın.",
  oauth_finish_desc: "Sosyal sağlayıcınız kimliğinizi onayladı. Hesabınız açılmadan önce LvL'nin kullanıcı adı, yaş kontrolü ve temel profil bilgilerine ihtiyacı var.",
  oauth_social_login: "Sosyal giriş",
  oauth_profile_ready: "Profil hazır",
  oauth_step: "2 adımın 2.'si",
  oauth_create_title: "LvL hesabınızı oluşturun",
  oauth_create_desc: "Giriş başarılı. Hesabı oluşturmak için zorunlu LvL profil alanlarını tamamlayın.",
  oauth_create_action: "Hesabı oluştur ve LvL'ye gir",
  oauth_selected_avatar: "Seçilen varsayılan profil resmi",
  reset_page_title: "Şifreyi Sıfırla",
  forgot_page_title: "Şifremi Unuttum",
  reset_hero_title: "Yeni bir şifre belirleyin.",
  forgot_hero_title: "LvL hesabınıza geri dönün.",
  reset_hero_desc: "En az 8 karakterden oluşan yeni bir şifre seçin.",
  forgot_hero_desc: "Kullanıcı adınızı veya e-postanızı girin; hesap varsa sıfırlama bağlantısı gönderelim.",
  reset_title: "Şifreyi sıfırla",
  forgot_title: "Şifremi unuttum",
  reset_new_password: "Yeni şifre",
  reset_confirm_password: "Şifreyi doğrula",
  reset_update_action: "Şifreyi güncelle",
  reset_send_action: "Sıfırlama bağlantısı gönder",
  reset_back_login: "Girişe dön",
  social_back_profile: "Profile dön",
  social_friends_desc: "Etkin 7 günlük beşlik veya mesaj serisi bulunan kişiler.",
  social_connected_desc: "Bu profile bağlı kişiler.",
  social_empty_title: "Henüz bağlantı yok",
  social_empty_desc: "Kişiler LvL'de bağlantı kurdukça bu liste güncellenecek.",
  social_day_streak: "günlük seri",
  verification_no_notes: "Not eklenmemiş.",
  verification_status_approved: "Onaylandı",
  verification_status_rejected: "Reddedildi",
  verification_status_pending: "Beklemede",
  verification_cooldown: "Yeniden başvuru bekleme süresi etkin. Tekrar başvurabileceğiniz süre:",
  verification_links_placeholder: "ör. https://example.com/kullanici, https://sitem.com",
  guide_sections_aria: "LvL Rehberi bölümleri"
  ,verification_login_required: "Doğrulama talebi göndermek için giriş yapın."
  ,auth_login_action: "Giriş yap"
  ,community_summary_aria: "Topluluk zaman tüneli sayıları"
  ,community_shortcuts_aria: "Topluluk kısayolları"
  ,community_timelines_aria: "Topluluk zaman tünelleri"
  ,community_feeds_aria: "LvL topluluk akışları"
  ,community_join_aria: "Katılabileceğiniz topluluklar"
  ,brand_home_aria: "LvL ana sayfa"
  ,timeline_aria: "Zaman tüneli"
  ,timeline_pagination_aria: "Zaman tüneli sayfaları"
  ,saved_drafts_aria: "Kaydedilmiş taslaklar"
  ,post_share_aria: "Gönderiyi paylaş"
  ,post_share_title: "Direkt mesajla paylaş"
  ,post_bookmark_aria: "Gönderiyi yer imlerine ekle"
  ,post_bookmark_title: "Yer imlerine ekle"
  ,post_reply_tools_aria: "Yanıt medya araçları"
  ,comment_reply_aria: "Yoruma yanıt ver"
  ,comment_repost_aria: "Yorumu yeniden paylaş"
  ,comment_like_aria: "Yorumu beğen"
  ,sticker_aria: "Çıkartma"
  ,profile_view_picture_aria: "Profil resmini görüntüle"
  ,profile_high_five_aria: "Profile çak bir beşlik gönder"
  ,profile_xp_aria: "Profil XP özeti"
  ,profile_xp_progress_aria: "Sonraki seviyeye XP ilerlemesi"
  ,profile_achievements_aria: "Profil başarıları"
  ,profile_tabs_aria: "Profil sekmeleri"
  ,profile_pagination_aria: "Profil gönderi sayfaları"
  ,messages_back_people_aria: "Kişilere dön"
  ,messages_cancel_upload_aria: "Yüklemeyi iptal et"
  ,messages_add_attachment_aria: "Ek ekle"
  ,messages_send_aria: "Mesaj gönder"
  ,messages_close_new_aria: "Yeni konuşma panelini kapat"
  ,guide_how_aria: "LvL nasıl çalışır"
  ,guide_roadmap_aria: "LvL ödül yol haritası"
  ,activity_recent_aria: "Son etkinlik"
  ,home_reels_aria: "Ana sayfa klipleri"
  ,home_media_aria: "Klip dışı medya"
  ,cancel_btn: "İptal"
  ,share_btn: "Paylaş"
  ,profile_streak_days: "günlük seri"
  ,profile_streak_friend_prefix: "Arkadaşlık serisi:"
  ,composer_image_selected: "Görsel seçildi"
  ,composer_saved_image: "Kaydedilmiş görsel eklendi"
  ,draft_image_label: "Görsel taslağı"
  ,draft_untitled_label: "Adsız taslak"
  ,upload_failed: "Yükleme başarısız"
  ,upload_error: "Yükleme hatası"
  ,upload_wait: "Lütfen dosyanın yüklenmesinin tamamlanmasını bekleyin."
  ,profile_preview_your_name: "Adınız"
  ,profile_preview_username: "kullaniciadi"
  ,home_unmute_aria: "Sesi aç"
  ,home_mute_aria: "Sessize al"
  ,reply_sticker_selected: "Çıkartma seçildi:"
  ,reply_photo_selected: "Fotoğraf seçildi:"
  ,reply_singular: "yanıt"
  ,reply_plural: "yanıt"
  ,reply_post_error: "Yanıt gönderilemedi."
  ,birthday_future_error: "Doğum tarihi gelecekte olamaz."
  ,birthday_min_age_error: "LvL'yi kullanmak için en az 14 yaşında olmalısınız."
  ,birthday_realistic_error: "Lütfen geçerli bir doğum tarihi girin."
  ,notif_open_profile: "Profili görüntüle"
  ,notif_update: "bir güncelleme gönderdi"
  ,notif_someone: "Birisi"
  ,notif_just_now: "az önce"
  ,message_send_error: "Mesaj gönderilemedi. Tekrar deneyin."
  ,message_delete_error: "Mesaj silinemedi. Tekrar deneyin."
  ,comment_post_error: "Yorum gönderilemedi. Tekrar deneyin."
  ,settings_photo_size_error: "Profil fotoğrafları en fazla 5 MB olabilir."
});

Object.assign(TRANSLATIONS.en, {
  error_404_page_title: "Page not found",
  error_404_title: "This page doesn't exist",
  error_404_desc: "The link may be incorrect, expired, or the page may have moved.",
  error_back_home: "Back home",
  setup_page_title: "Setup Health",
  setup_kicker: "Project checks",
  setup_title: "Setup Health",
  setup_desc: "Quick checks for the app services, tables, storage, and PWA files.",
  setup_ready: "Ready",
  setup_needs_attention: "Needs attention",
  flash_close: "Close message",
  profile_official_account: "Official account",
  streak_day_high_five: "day high-five streak",
  streak_days_high_five: "day high-five streak",
  guide_more_tabs_hint: "More sections"
});

Object.assign(TRANSLATIONS.tr, {
  error_404_page_title: "Sayfa bulunamadı",
  error_404_title: "Bu sayfa mevcut değil",
  error_404_desc: "Bağlantı hatalı, süresi dolmuş veya sayfa taşınmış olabilir.",
  error_back_home: "Ana sayfaya dön",
  setup_page_title: "Kurulum Durumu",
  setup_kicker: "Proje kontrolleri",
  setup_title: "Kurulum Durumu",
  setup_desc: "Uygulama servisleri, tablolar, depolama ve PWA dosyaları için hızlı kontroller.",
  setup_ready: "Hazır",
  setup_needs_attention: "Kontrol gerekli",
  flash_close: "Mesajı kapat",
  profile_official_account: "Resmî hesap",
  streak_day_high_five: "günlük beşlik serisi",
  streak_days_high_five: "günlük beşlik serisi",
  guide_more_tabs_hint: "Diğer bölümler"
});
