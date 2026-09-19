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
    nav_home:"Home",nav_clips:"Clips",nav_community:"Community",nav_guide:"LvL Guide",nav_settings:"Settings",nav_post:"Post",nav_logout:"Log out",nav_messages:"Messages",nav_alerts:"Alerts",nav_bookmarks:"Bookmarks",nav_me:"Me",nav_more:"More",
    bookmarks_title:"Bookmarks",bookmarks_desc:"All the posts and clips you saved for later.",bookmarks_tab_posts:"Posts",bookmarks_tab_clips:"Clips",bookmarks_empty_posts:"No saved posts",bookmarks_empty_posts_desc:"Save interesting posts you see on your feed to find them here.",bookmarks_empty_clips:"No saved clips",bookmarks_empty_clips_desc:"Save clips you love while browsing to watch them here.",profile_no_saved_posts:"No saved posts",profile_no_saved_posts_desc:"You haven't bookmarked any posts yet.",
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
    nav_home:"Ana Sayfa",nav_clips:"Klipler",nav_community:"Topluluk",nav_guide:"LvL Rehberi",nav_settings:"Ayarlar",nav_post:"Paylaş",nav_logout:"Çıkış yap",nav_messages:"Mesajlar",nav_alerts:"Bildirimler",nav_bookmarks:"Kaydedilenler",nav_me:"Ben",nav_more:"Daha Fazla",
    bookmarks_title:"Kaydedilenler",bookmarks_desc:"Daha sonra tekrar göz atmak için kaydettiğin tüm gönderiler ve klipler.",bookmarks_tab_posts:"Gönderiler",bookmarks_tab_clips:"Klipler",bookmarks_empty_posts:"Kaydedilen gönderi yok",bookmarks_empty_posts_desc:"Akışta gördüğün ilginç paylaşımları yer imlerine ekleyerek burada saklayabilirsin.",bookmarks_empty_clips:"Kaydedilen klip yok",bookmarks_empty_clips_desc:"Kliplerde beğendiğin videoları kaydet butonuna basarak burada saklayabilirsin.",profile_no_saved_posts:"Kaydedilen gönderi yok",profile_no_saved_posts_desc:"Henüz hiçbir gönderiyi yer imlerine eklemediniz.",
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
    nav_home:"الرئيسية",nav_clips:"مقاطع",nav_community:"المجتمع",nav_guide:"دليل LvL",nav_settings:"الإعدادات",nav_post:"نشر",nav_logout:"تسجيل الخروج",nav_messages:"الرسائل",nav_alerts:"التنبيهات",nav_bookmarks:"العناصر المحفوظة",nav_me:"أنا",nav_more:"المزيد",
    bookmarks_title:"العناصر المحفوظة",bookmarks_desc:"جميع المنشورات والمقاطع التي حفظتها لاحقاً.",bookmarks_tab_posts:"المنشورات",bookmarks_tab_clips:"المقاطع",bookmarks_empty_posts:"لا توجد منشورات محفوظة",bookmarks_empty_posts_desc:"احفظ المنشورات التي تعجبك لتجدها هنا.",bookmarks_empty_clips:"لا توجد مقاطع محفوظة",bookmarks_empty_clips_desc:"احفظ المقاطع التي تعجبك لتشاهدها هنا.",profile_no_saved_posts:"لا توجد منشورات محفوظة",profile_no_saved_posts_desc:"لم تقم بحفظ أي منشورات بعد.",
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
    const target = el.querySelector('.feedback-text') || el.querySelector('.flash-message-text') || el;
    target.textContent = translateServerMessage(el.dataset.serverMessageOriginal, lang);
  });
  document.querySelectorAll('[data-relative-time]').forEach(function(el){
    const formatted = formatRelativeTime(el.getAttribute('datetime') || el.dataset.relativeTime, lang);
    if (formatted) el.textContent = formatted;
  });
  document.querySelectorAll('[data-lang-btn]').forEach(function(btn){const l=btn.getAttribute('data-lang-btn');btn.classList.toggle('active',l===lang);btn.setAttribute('aria-pressed',l===lang?'true':'false');});
  document.querySelectorAll('[data-high-five-streak-title]').forEach(function(el){
    const count = el.dataset.streakCount || '0';
    const name = el.dataset.streakName || '';
    const label = lang === 'tr' ? `${count} günlük beşlik serisi` : `${count}-day high-five streak`;
    el.setAttribute('title', name ? (lang === 'tr' ? `${label} · ${name}` : `${label} with ${name}`) : label);
  });
  // Persisting the language is an optional preference (see LvLConsent).
  if(save && (!window.LvLConsent || window.LvLConsent.allowsPreferences())){
    try{localStorage.setItem(STORAGE_KEY,lang);}catch(_){}
  }
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
  ,profile_streak_days: "day streak"
  ,profile_streak_friend_prefix: "Friend streak with"
  ,profile_replies: "Replies"
  ,pprogress_unlocked: "✓ Unlocked"
  ,pprogress_locked: "Locked"
  ,pprogress_kicker: "PUBLIC PROGRESS"
  ,pprogress_title: "Achievements"
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
  ,birthday_min_age_error: "You must be at least 16 years old to use LvL."
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
  pprogress_unlocked: "✓ Açıldı",
  pprogress_locked: "Kilitli",
  pprogress_kicker: "GENEL İLERLEME",
  pprogress_title: "Başarımlar",
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
  ,birthday_min_age_error: "LvL'yi kullanmak için en az 16 yaşında olmalısınız."
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

// --- Final implementation pass: registration, legal, consent, feedback ---

Object.assign(TRANSLATIONS.en, {
  auth_password_confirm: "Confirm password",
  auth_age_hint: "You must be at least 16 years old.",
  auth_terms_prefix: "I agree to the",
  auth_terms_link: "Terms & Conditions",
  auth_terms_and: "and",
  auth_privacy_link: "Privacy & Cookies",
  terms_required: "You must accept the Terms & Conditions to create an account.",
  password_mismatch: "Passwords do not match.",
  password_match: "Passwords match.",
  username_checking: "Checking availability...",
  username_available: "Username is available.",
  username_taken: "That username is taken.",
  username_invalid: "Use 3-24 letters, numbers or underscores.",
  username_current: "This is your current username.",
  error_access_denied: "Access denied.",
  verified_account: "Verified account",
  cookie_title: "Cookies on LvL",
  cookie_text: "LvL needs one session cookie to keep you signed in. We can also remember interface choices like your language and autoplay setting in your browser. No analytics, advertising or third-party tracking.",
  cookie_learn_more: "Read what we store",
  cookie_accept: "Accept all",
  cookie_essential_only: "Essential only",
  cookie_manage: "Manage cookie choices",
  terms_page_title: "Terms & Conditions",
  terms_title: "Terms & Conditions",
  terms_updated: "Version",
  terms_h_eligibility: "1. Who can use LvL",
  terms_p_eligibility: "You must be at least 16 years old to create an LvL account. If we learn that an account belongs to someone younger, we may suspend or remove it.",
  terms_h_account: "2. Your account",
  terms_p_account: "You are responsible for the accuracy of the details you register with and for keeping your password private. Usernames are unique and stored in lowercase, so one name cannot be claimed twice. Do not share your account or impersonate other people.",
  terms_h_content: "3. Your content",
  terms_p_content: "You keep ownership of the posts, clips, comments and images you upload. By publishing them on LvL you allow us to store and display them inside the product so other members can see them. You are responsible for having the right to share whatever you upload.",
  terms_h_conduct: "4. Acceptable use",
  terms_p_conduct: "Do not post content that is illegal, hateful, harassing, sexually explicit involving minors, or that infringes someone else's rights. Do not attempt to break, overload or gain unauthorised access to the service. We provide reporting, muting and blocking tools, and we may remove content or restrict accounts that break these rules.",
  terms_h_xp: "5. XP, levels and rewards",
  terms_p_xp: "XP, levels, badges and unlocks are features of the product, not currency. They have no monetary value, cannot be traded or cashed out, and we may adjust how they are earned or what they unlock as the product changes.",
  terms_h_verification: "6. Verification",
  terms_p_verification: "The verified badge is granted through manual review of a verification request. It is not tied to your level and cannot be purchased. We may withdraw it if the information behind the request turns out to be inaccurate.",
  terms_h_termination: "7. Ending your account",
  terms_p_termination: "You can delete your account at any time from Settings. We may suspend or close an account that repeatedly breaks these terms.",
  terms_h_changes: "8. Changes to these terms",
  terms_p_changes: "We may update these terms as LvL develops. The version identifier at the top changes when the text changes, and we record which version each account accepted.",
  terms_h_contact: "9. Contact",
  terms_p_contact: "Questions about these terms can be sent through the contact form.",
  legal_disclaimer: "This page describes how the product works. It is not legal advice and does not create guarantees beyond what is written here.",
  privacy_page_title: "Privacy & Cookies",
  privacy_title: "Privacy & Cookies",
  privacy_subtitle: "What LvL stores in your browser, and why.",
  privacy_h_essential: "Essential — always on",
  privacy_p_essential: "LvL sets one first-party session cookie when you sign in. It keeps you logged in as you move between pages and carries the token that protects forms against cross-site request forgery. It is HttpOnly, so scripts cannot read it. Without it you cannot stay signed in, so it is not something consent can switch off.",
  privacy_cookie_session: "sign-in state and CSRF protection",
  privacy_h_preferences: "Preferences — optional",
  privacy_p_preferences: "If you allow it, LvL remembers a few interface choices in your browser's local storage. These never leave your device and are not sent to our servers. Decline and the app still works; it just forgets these between visits.",
  privacy_pref_lang: "your chosen language",
  privacy_pref_autoplay: "whether clips continue automatically",
  privacy_pref_sound: "notification sound setting",
  privacy_pref_sidebar: "whether the desktop menu is expanded",
  privacy_pref_consent: "your answer on this page, so we stop asking",
  privacy_h_none: "What LvL does not use",
  privacy_p_none: "LvL does not load analytics, advertising or third-party tracking scripts, and does not set cookies for those purposes. If that ever changes, this page and the consent notice will change with it, and the new category will be off until you turn it on.",
  privacy_h_account: "Account data",
  privacy_p_account: "The details you enter — name, username, email, birthday, profile information — and the content you publish are stored in our database so the product can work. Deleting your account from Settings removes your account record.",
  privacy_h_change: "Changing your answer",
  privacy_p_change: "You can update your choice at any time from the button below.",
  careers_page_title: "Careers",
  contact_page_title: "Contact Us",
  settings_legal_title: "Legal",
  settings_legal_hint: "The terms you accepted and what LvL stores in your browser.",
  quick_bookmarks_desc: "Revisit the posts and clips you saved.",
  community_lens_clips_desc: "Short videos from people and groups you follow.",
  verification_subtitle: "Verified accounts are reviewed manually. Verification is not tied to your level.",
  verification_approved: "Your profile is verified. The badge is active next to your name.",
  bookmarks_tab_posts: "Posts",
  bookmarks_tab_clips: "Clips",
  bookmarks_empty_posts: "Nothing saved yet",
  bookmarks_empty_posts_desc: "Tap the bookmark icon on a post to keep it here.",
  bookmarks_empty_clips: "No saved clips",
  bookmarks_empty_clips_desc: "Save a clip and it will appear in this tab."
});

Object.assign(TRANSLATIONS.tr, {
  auth_password_confirm: "Şifre tekrarı",
  auth_age_hint: "En az 16 yaşında olmalısınız.",
  auth_terms_prefix: "Şunları kabul ediyorum:",
  auth_terms_link: "Kullanım Koşulları",
  auth_terms_and: "ve",
  auth_privacy_link: "Gizlilik ve Çerezler",
  terms_required: "Hesap oluşturmak için Kullanım Koşulları'nı kabul etmelisiniz.",
  password_mismatch: "Şifreler eşleşmiyor.",
  password_match: "Şifreler eşleşiyor.",
  username_checking: "Uygunluk kontrol ediliyor...",
  username_available: "Bu kullanıcı adı uygun.",
  username_taken: "Bu kullanıcı adı alınmış.",
  username_invalid: "3-24 harf, rakam veya alt çizgi kullanın.",
  username_current: "Bu zaten sizin kullanıcı adınız.",
  error_access_denied: "Erişim reddedildi.",
  verified_account: "Doğrulanmış hesap",
  cookie_title: "LvL'de çerezler",
  cookie_text: "LvL, oturumunuzu açık tutmak için tek bir oturum çerezi kullanır. İzin verirseniz dil ve otomatik oynatma gibi arayüz tercihlerinizi de tarayıcınızda hatırlayabiliriz. Analitik, reklam veya üçüncü taraf takip yok.",
  cookie_learn_more: "Ne sakladığımızı okuyun",
  cookie_accept: "Tümünü kabul et",
  cookie_essential_only: "Yalnızca gerekli",
  cookie_manage: "Çerez tercihlerini yönet",
  terms_page_title: "Kullanım Koşulları",
  terms_title: "Kullanım Koşulları",
  terms_updated: "Sürüm",
  terms_h_eligibility: "1. LvL'yi kimler kullanabilir",
  terms_p_eligibility: "LvL hesabı oluşturmak için en az 16 yaşında olmalısınız. Bir hesabın daha küçük birine ait olduğunu öğrenirsek hesabı askıya alabilir veya kaldırabiliriz.",
  terms_h_account: "2. Hesabınız",
  terms_p_account: "Kayıt olurken verdiğiniz bilgilerin doğruluğundan ve şifrenizi gizli tutmaktan siz sorumlusunuz. Kullanıcı adları benzersizdir ve küçük harfle saklanır; aynı ad iki kez alınamaz. Hesabınızı paylaşmayın ve başkalarının kimliğine bürünmeyin.",
  terms_h_content: "3. İçerikleriniz",
  terms_p_content: "Yüklediğiniz gönderi, klip, yorum ve görsellerin sahibi sizsiniz. Bunları LvL'de yayımlayarak, diğer üyelerin görebilmesi için ürün içinde saklamamıza ve göstermemize izin vermiş olursunuz. Yüklediğiniz içeriği paylaşma hakkına sahip olmaktan siz sorumlusunuz.",
  terms_h_conduct: "4. Kabul edilebilir kullanım",
  terms_p_conduct: "Yasa dışı, nefret içeren, taciz edici, küçükleri içeren cinsel içerikli veya başkalarının haklarını ihlal eden içerik paylaşmayın. Servisi bozmaya, aşırı yüklemeye veya yetkisiz erişim sağlamaya çalışmayın. Bildirme, sessize alma ve engelleme araçları sunuyoruz; bu kuralları ihlal eden içerikleri kaldırabilir veya hesapları kısıtlayabiliriz.",
  terms_h_xp: "5. XP, seviyeler ve ödüller",
  terms_p_xp: "XP, seviyeler, rozetler ve kilit açılımları ürünün özellikleridir, para birimi değildir. Parasal değerleri yoktur, takas edilemez veya nakde çevrilemez; ürün geliştikçe nasıl kazanıldıklarını veya neyin kilidini açtıklarını değiştirebiliriz.",
  terms_h_verification: "6. Doğrulama",
  terms_p_verification: "Doğrulama rozeti, doğrulama talebinin manuel incelenmesiyle verilir. Seviyenize bağlı değildir ve satın alınamaz. Talebin dayandığı bilgiler hatalı çıkarsa rozeti geri alabiliriz.",
  terms_h_termination: "7. Hesabınızı kapatma",
  terms_p_termination: "Hesabınızı istediğiniz zaman Ayarlar'dan silebilirsiniz. Bu koşulları tekrar tekrar ihlal eden hesapları askıya alabilir veya kapatabiliriz.",
  terms_h_changes: "8. Koşullardaki değişiklikler",
  terms_p_changes: "LvL geliştikçe bu koşulları güncelleyebiliriz. Metin değiştiğinde üstteki sürüm bilgisi de değişir ve her hesabın hangi sürümü kabul ettiğini kaydederiz.",
  terms_h_contact: "9. İletişim",
  terms_p_contact: "Bu koşullarla ilgili sorularınızı iletişim formundan gönderebilirsiniz.",
  legal_disclaimer: "Bu sayfa ürünün nasıl çalıştığını anlatır. Hukuki tavsiye değildir ve burada yazılanların ötesinde bir garanti oluşturmaz.",
  privacy_page_title: "Gizlilik ve Çerezler",
  privacy_title: "Gizlilik ve Çerezler",
  privacy_subtitle: "LvL tarayıcınızda neyi, neden saklıyor.",
  privacy_h_essential: "Gerekli — her zaman açık",
  privacy_p_essential: "Giriş yaptığınızda LvL tek bir birinci taraf oturum çerezi ayarlar. Sayfalar arasında gezinirken oturumunuzu açık tutar ve formları siteler arası istek sahteciliğine karşı koruyan belirteci taşır. HttpOnly'dir, yani betikler okuyamaz. O olmadan oturumunuz açık kalamaz; bu yüzden onay ile kapatılabilecek bir şey değildir.",
  privacy_cookie_session: "oturum durumu ve CSRF koruması",
  privacy_h_preferences: "Tercihler — isteğe bağlı",
  privacy_p_preferences: "İzin verirseniz LvL bazı arayüz tercihlerinizi tarayıcınızın yerel deposunda hatırlar. Bunlar cihazınızdan çıkmaz ve sunucularımıza gönderilmez. Reddederseniz uygulama yine çalışır; yalnızca bunları ziyaretler arasında unutur.",
  privacy_pref_lang: "seçtiğiniz dil",
  privacy_pref_autoplay: "kliplerin otomatik devam edip etmeyeceği",
  privacy_pref_sound: "bildirim sesi ayarı",
  privacy_pref_sidebar: "masaüstü menüsünün açık olup olmadığı",
  privacy_pref_consent: "bu sayfadaki yanıtınız, tekrar sormamamız için",
  privacy_h_none: "LvL'nin kullanmadıkları",
  privacy_p_none: "LvL analitik, reklam veya üçüncü taraf takip betikleri yüklemez ve bu amaçlarla çerez ayarlamaz. Bu durum değişirse bu sayfa ve onay bildirimi de değişir; yeni kategori siz açana kadar kapalı kalır.",
  privacy_h_account: "Hesap verileri",
  privacy_p_account: "Girdiğiniz bilgiler — ad, kullanıcı adı, e-posta, doğum tarihi, profil bilgileri — ve yayımladığınız içerik, ürünün çalışabilmesi için veritabanımızda saklanır. Ayarlar'dan hesabınızı silmek hesap kaydınızı kaldırır.",
  privacy_h_change: "Yanıtınızı değiştirme",
  privacy_p_change: "Seçiminizi istediğiniz zaman aşağıdaki düğmeden güncelleyebilirsiniz.",
  careers_page_title: "Kariyer",
  contact_page_title: "İletişim",
  settings_legal_title: "Yasal",
  settings_legal_hint: "Kabul ettiğiniz koşullar ve LvL'nin tarayıcınızda sakladıkları.",
  quick_bookmarks_desc: "Kaydettiğiniz gönderi ve kliplere geri dönün.",
  community_lens_clips_desc: "Takip ettiğiniz kişi ve gruplardan kısa videolar.",
  verification_subtitle: "Doğrulanmış hesaplar elle incelenir. Doğrulama seviyenize bağlı değildir.",
  verification_approved: "Profiliniz doğrulandı. Rozet adınızın yanında aktif.",
  bookmarks_tab_posts: "Gönderiler",
  bookmarks_tab_clips: "Klipler",
  bookmarks_empty_posts: "Henüz kayıt yok",
  bookmarks_empty_posts_desc: "Bir gönderideki yer imi simgesine dokunarak burada saklayın.",
  bookmarks_empty_clips: "Kayıtlı klip yok",
  bookmarks_empty_clips_desc: "Bir klip kaydedin, bu sekmede görünsün."
});

Object.assign(TRANSLATIONS.ar, {
  auth_password_confirm: "تأكيد كلمة المرور",
  auth_age_hint: "يجب أن يكون عمرك 16 عامًا على الأقل.",
  auth_terms_prefix: "أوافق على",
  auth_terms_link: "الشروط والأحكام",
  auth_terms_and: "و",
  auth_privacy_link: "الخصوصية وملفات تعريف الارتباط",
  terms_required: "يجب قبول الشروط والأحكام لإنشاء حساب.",
  password_mismatch: "كلمتا المرور غير متطابقتين.",
  password_match: "كلمتا المرور متطابقتان.",
  username_checking: "جارٍ التحقق من التوفّر...",
  username_available: "اسم المستخدم متاح.",
  username_taken: "اسم المستخدم محجوز.",
  username_invalid: "استخدم من 3 إلى 24 حرفًا أو رقمًا أو شرطة سفلية.",
  username_current: "هذا هو اسم المستخدم الحالي لك.",
  error_access_denied: "تم رفض الوصول.",
  verified_account: "حساب موثّق",
  cookie_title: "ملفات تعريف الارتباط في LvL",
  cookie_text: "يحتاج LvL إلى ملف تعريف ارتباط واحد للجلسة لإبقائك مسجّلاً للدخول. وبإذنك يمكننا أيضًا تذكّر تفضيلات الواجهة مثل اللغة والتشغيل التلقائي في متصفحك. لا تحليلات ولا إعلانات ولا تتبّع من أطراف ثالثة.",
  cookie_learn_more: "اقرأ ما نخزّنه",
  cookie_accept: "قبول الكل",
  cookie_essential_only: "الضرورية فقط",
  cookie_manage: "إدارة خيارات ملفات تعريف الارتباط",
  terms_page_title: "الشروط والأحكام",
  terms_title: "الشروط والأحكام",
  terms_updated: "الإصدار",
  terms_h_eligibility: "١. من يمكنه استخدام LvL",
  terms_p_eligibility: "يجب أن يكون عمرك 16 عامًا على الأقل لإنشاء حساب في LvL. إذا علمنا أن حسابًا يعود لشخص أصغر سنًا، فقد نوقفه أو نحذفه.",
  terms_h_account: "٢. حسابك",
  terms_p_account: "أنت مسؤول عن دقة البيانات التي تسجّل بها وعن الحفاظ على سرية كلمة المرور. أسماء المستخدمين فريدة وتُخزَّن بأحرف صغيرة، فلا يمكن حجز الاسم نفسه مرتين. لا تشارك حسابك ولا تنتحل شخصية الآخرين.",
  terms_h_content: "٣. محتواك",
  terms_p_content: "تظل مالكًا للمنشورات والمقاطع والتعليقات والصور التي ترفعها. وبنشرها على LvL تسمح لنا بتخزينها وعرضها داخل المنتج ليراها الأعضاء الآخرون. أنت مسؤول عن امتلاك حق مشاركة ما ترفعه.",
  terms_h_conduct: "٤. الاستخدام المقبول",
  terms_p_conduct: "لا تنشر محتوى غير قانوني أو يحضّ على الكراهية أو يتضمن تحرّشًا أو محتوى جنسيًا صريحًا يشمل قاصرين أو ينتهك حقوق الآخرين. لا تحاول تعطيل الخدمة أو إثقالها أو الوصول إليها دون تصريح. نوفّر أدوات للإبلاغ والكتم والحظر، وقد نزيل المحتوى أو نقيّد الحسابات المخالفة.",
  terms_h_xp: "٥. نقاط الخبرة والمستويات والمكافآت",
  terms_p_xp: "نقاط الخبرة والمستويات والشارات والمزايا هي خصائص في المنتج وليست عملة. لا قيمة نقدية لها ولا يمكن تداولها أو صرفها، وقد نعدّل طريقة كسبها أو ما تفتحه مع تطوّر المنتج.",
  terms_h_verification: "٦. التوثيق",
  terms_p_verification: "تُمنح شارة التوثيق بعد مراجعة يدوية لطلب التوثيق. وهي غير مرتبطة بمستواك ولا يمكن شراؤها. وقد نسحبها إذا تبيّن أن المعلومات المقدّمة غير دقيقة.",
  terms_h_termination: "٧. إنهاء حسابك",
  terms_p_termination: "يمكنك حذف حسابك في أي وقت من الإعدادات. وقد نوقف أو نغلق أي حساب يخالف هذه الشروط بشكل متكرر.",
  terms_h_changes: "٨. تغييرات على هذه الشروط",
  terms_p_changes: "قد نحدّث هذه الشروط مع تطوّر LvL. يتغيّر رقم الإصدار في الأعلى عند تغيّر النص، ونسجّل الإصدار الذي قبله كل حساب.",
  terms_h_contact: "٩. التواصل",
  terms_p_contact: "يمكن إرسال الأسئلة حول هذه الشروط عبر نموذج التواصل.",
  legal_disclaimer: "تشرح هذه الصفحة كيفية عمل المنتج. وهي ليست استشارة قانونية ولا تنشئ ضمانات تتجاوز ما هو مكتوب هنا.",
  privacy_page_title: "الخصوصية وملفات تعريف الارتباط",
  privacy_title: "الخصوصية وملفات تعريف الارتباط",
  privacy_subtitle: "ما الذي يخزّنه LvL في متصفحك، ولماذا.",
  privacy_h_essential: "ضرورية — تعمل دائمًا",
  privacy_p_essential: "يضبط LvL ملف تعريف ارتباط واحدًا للجلسة عند تسجيل الدخول. يبقيك مسجّلاً أثناء تنقّلك بين الصفحات ويحمل الرمز الذي يحمي النماذج من تزوير الطلبات. وهو HttpOnly، أي لا تستطيع البرامج النصية قراءته. بدونه لا يمكن إبقاء الجلسة مفتوحة، لذا لا يمكن إيقافه عبر الموافقة.",
  privacy_cookie_session: "حالة تسجيل الدخول وحماية CSRF",
  privacy_h_preferences: "التفضيلات — اختيارية",
  privacy_p_preferences: "إذا سمحت بذلك، يتذكّر LvL بعض خيارات الواجهة في التخزين المحلي لمتصفحك. لا تغادر هذه البيانات جهازك ولا تُرسل إلى خوادمنا. وإذا رفضت فسيظل التطبيق يعمل، لكنه ينسى هذه الخيارات بين الزيارات.",
  privacy_pref_lang: "اللغة التي اخترتها",
  privacy_pref_autoplay: "ما إذا كانت المقاطع تُكمل تلقائيًا",
  privacy_pref_sound: "إعداد صوت الإشعارات",
  privacy_pref_sidebar: "ما إذا كانت قائمة سطح المكتب موسّعة",
  privacy_pref_consent: "إجابتك في هذه الصفحة حتى لا نسأل مجددًا",
  privacy_h_none: "ما لا يستخدمه LvL",
  privacy_p_none: "لا يحمّل LvL برامج تحليلات أو إعلانات أو تتبّع من أطراف ثالثة، ولا يضبط ملفات تعريف ارتباط لتلك الأغراض. وإذا تغيّر ذلك يومًا، ستتغيّر هذه الصفحة وإشعار الموافقة معها، وستبقى الفئة الجديدة متوقفة حتى تفعّلها بنفسك.",
  privacy_h_account: "بيانات الحساب",
  privacy_p_account: "تُخزَّن البيانات التي تدخلها — الاسم واسم المستخدم والبريد وتاريخ الميلاد ومعلومات الملف الشخصي — والمحتوى الذي تنشره في قاعدة بياناتنا حتى يعمل المنتج. وحذف حسابك من الإعدادات يزيل سجلّ حسابك.",
  privacy_h_change: "تغيير إجابتك",
  privacy_p_change: "يمكنك تحديث اختيارك في أي وقت من الزر أدناه.",
  careers_page_title: "الوظائف",
  contact_page_title: "تواصل معنا",
  settings_legal_title: "قانوني",
  settings_legal_hint: "الشروط التي قبلتها وما يخزّنه LvL في متصفحك.",
  quick_bookmarks_desc: "عد إلى المنشورات والمقاطع التي حفظتها.",
  community_lens_clips_desc: "مقاطع قصيرة من أشخاص ومجموعات تتابعها.",
  verification_subtitle: "تُراجع الحسابات الموثّقة يدويًا. التوثيق غير مرتبط بمستواك.",
  verification_approved: "تم توثيق ملفك الشخصي. الشارة نشطة بجوار اسمك.",
  bookmarks_tab_posts: "المنشورات",
  bookmarks_tab_clips: "المقاطع",
  bookmarks_empty_posts: "لا شيء محفوظ بعد",
  bookmarks_empty_posts_desc: "اضغط رمز الحفظ على أي منشور ليظهر هنا.",
  bookmarks_empty_clips: "لا مقاطع محفوظة",
  bookmarks_empty_clips_desc: "احفظ مقطعًا وسيظهر في هذا التبويب."
});

Object.assign(TURKISH_SERVER_MESSAGES, {
  "Confirm your password.": "Şifrenizi tekrar girin.",
  "You must accept the Terms & Conditions to create an account.": "Hesap oluşturmak için Kullanım Koşulları'nı kabul etmelisiniz.",
  "You must be at least 16 years old to use LvL.": "LvL'yi kullanmak için en az 16 yaşında olmalısınız.",
  "Username is required.": "Kullanıcı adı zorunludur.",
  "That page is only available to administrators.": "Bu sayfa yalnızca yöneticiler içindir.",
  "Your message could not be sent. Try again.": "Mesajınız gönderilemedi. Tekrar deneyin.",
  "Document upload failed. Try again.": "Belge yüklenemedi. Tekrar deneyin.",
  "Verification request failed. Try again.": "Doğrulama talebi gönderilemedi. Tekrar deneyin.",
  "Application submitted successfully!": "Başvurunuz başarıyla gönderildi!",
  "A CV / resume is required to submit your application.": "Başvuru için bir CV / özgeçmiş gereklidir.",
  "CV must be a PDF, DOC, or DOCX file.": "CV, PDF, DOC veya DOCX dosyası olmalıdır."
});

Object.assign(TRANSLATIONS.en, {
  settings_banner_hint: "Profile colors are unlocked from LvL",
  settings_banner_locked_hint: "Profile colors unlock at LvL",
  settings_banner_locked_tail: "Until then, accounts stay black and white so reward colors stay meaningful.",
  copied: "Copied",
  link_copied: "Link copied to clipboard."
});

Object.assign(TRANSLATIONS.tr, {
  settings_banner_hint: "Profil renkleri şu seviyeden itibaren açık: LvL",
  settings_banner_locked_hint: "Profil renkleri şu seviyede açılır: LvL",
  settings_banner_locked_tail: "O zamana kadar hesaplar siyah-beyaz kalır, böylece ödül renkleri anlamını korur.",
  copied: "Kopyalandı",
  link_copied: "Bağlantı panoya kopyalandı."
});

Object.assign(TRANSLATIONS.ar, {
  settings_banner_hint: "تُفتح ألوان الملف الشخصي ابتداءً من المستوى",
  settings_banner_locked_hint: "تُفتح ألوان الملف الشخصي عند المستوى",
  settings_banner_locked_tail: "حتى ذلك الحين تبقى الحسابات بالأبيض والأسود حتى تحتفظ ألوان المكافآت بمعناها.",
  copied: "تم النسخ",
  link_copied: "تم نسخ الرابط."
});

/* --- Keys that existed in markup but in no translation table ------------- */

Object.assign(TRANSLATIONS.en, {
  comment_options_aria: "Reply options",
  comments_empty: "No replies yet",
  copy_link: "Copy link",
  nav_profile: "Profile",
  reel_delete: "Delete clip",
  reel_download: "Download",
  reply_delete_error: "Could not delete reply.",
  settings_appearance_sub: "Colors and profile banner",
  settings_autoplay_desc: "Continue to the next clip automatically.",
  settings_edit_photo: "Edit photo",
  settings_notif_desc: "Play a sound for new notifications.",
  settings_prefs_sub: "Playback and notifications",
  settings_preview: "Preview",
  settings_public_info_sub: "Visible on your profile",
  settings_upload_photo: "Upload photo"
});

Object.assign(TRANSLATIONS.tr, {
  comment_options_aria: "Yanıt seçenekleri",
  comments_empty: "Henüz yanıt yok",
  copy_link: "Bağlantıyı kopyala",
  nav_profile: "Profil",
  reel_delete: "Klibi sil",
  reel_download: "İndir",
  reply_delete_error: "Yanıt silinemedi.",
  settings_appearance_sub: "Renkler ve profil afişi",
  settings_autoplay_desc: "Sonraki klibe otomatik olarak geç.",
  settings_edit_photo: "Fotoğrafı düzenle",
  settings_notif_desc: "Yeni bildirimler için ses çal.",
  settings_prefs_sub: "Oynatma ve bildirimler",
  settings_preview: "Önizleme",
  settings_public_info_sub: "Profilinizde görünür",
  settings_upload_photo: "Fotoğraf yükle"
});

/* --- Arabic coverage for strings that previously fell back to English ---- */

Object.assign(TRANSLATIONS.ar, {
  action_failed: "لم تكتمل العملية. حاول مرة أخرى.",
  activity_recent_aria: "النشاط الأخير",
  auth_badges: "الشارات",
  auth_login_page_title: "تسجيل الدخول",
  auth_login_action: "تسجيل الدخول",
  auth_ranks: "الرتب",
  avatar_alt: "صورة الملف الشخصي",
  birthday_future_error: "لا يمكن أن يكون تاريخ الميلاد في المستقبل.",
  birthday_min_age_error: "يجب أن يكون عمرك 16 عامًا على الأقل لاستخدام LvL.",
  birthday_realistic_error: "الرجاء إدخال تاريخ ميلاد صحيح.",
  brand_home_aria: "الصفحة الرئيسية لـ LvL",
  cancel_btn: "إلغاء",
  comment_delete: "حذف الرد",
  comment_like_aria: "الإعجاب بالتعليق",
  comment_options_aria: "خيارات الرد",
  comment_post_error: "تعذّر نشر التعليق. حاول مرة أخرى.",
  comment_reply_aria: "الرد على التعليق",
  comment_repost_aria: "إعادة نشر التعليق",
  comments_empty: "لا توجد ردود بعد",
  community_add_image: "إضافة صورة",
  community_compose_placeholder: "شارك شيئًا مع هذا المجتمع",
  community_created_by: "أنشأه",
  community_detail_kicker: "المجتمع",
  community_edit: "تعديل",
  community_empty_posts_desc: "ابدأ الحوار بمنشور أو صورة أو رد.",
  community_empty_posts_title: "لا توجد منشورات في المجتمع بعد",
  community_feeds_aria: "خلاصات مجتمع LvL",
  community_join: "انضمام",
  community_join_aria: "مجتمعات للانضمام",
  community_join_to_post: "انضم لتنشر",
  community_join_to_post_desc: "يمكن للأعضاء مشاركة المنشورات والصور والردود في هذا المجتمع.",
  community_joined: "منضم",
  community_members: "الأعضاء",
  community_no_members: "لا يوجد أعضاء بعد.",
  community_remove_image: "إزالة",
  community_shortcuts_aria: "اختصارات المجتمع",
  community_timelines_aria: "خطوط زمنية للمجتمع",
  composer_image_selected: "تم اختيار صورة",
  composer_saved_image: "تم إرفاق الصورة المحفوظة",
  copied_label: "تم النسخ",
  copy_link: "نسخ الرابط",
  copy_prompt: "انسخ هذا الرابط",
  draft_delete: "حذف المسودة",
  draft_discard: "تجاهل المسودة",
  draft_edit: "تعديل",
  draft_image_label: "مسودة صورة",
  draft_image_post: "منشور صورة",
  draft_last_saved: "آخر حفظ",
  draft_save: "حفظ المسودة",
  draft_untitled_label: "مسودة بلا عنوان",
  drafts_back_to_feed: "العودة إلى الخلاصة",
  drafts_description: "أكمل الفكرة قبل نشرها.",
  drafts_empty_desc: "استخدم “حفظ المسودة” في محرّر الصفحة الرئيسية.",
  drafts_empty_title: "لا توجد مسودات بعد",
  drafts_title: "المسودات",
  edit_post_description: "راجع النص قبل الحفظ أو النشر.",
  edit_post_title: "تعديل المنشور",
  error_404_desc: "قد يكون الرابط غير صحيح أو منتهي الصلاحية أو أن الصفحة قد نُقلت.",
  error_404_title: "هذه الصفحة غير موجودة",
  error_back_home: "العودة إلى الرئيسية",
  flash_close: "إغلاق الرسالة",
  forgot_title: "نسيت كلمة المرور",
  home_media_aria: "وسائط غير المقاطع",
  home_reels_aria: "مقاطع الصفحة الرئيسية",
  install_action: "تثبيت التطبيق",
  install_desc: "ضع LvL على شاشتك الرئيسية لتجربة أسرع وأقرب إلى التطبيق.",
  install_dismiss: "ليس الآن",
  install_ios_desc: "ثبّت LvL من Safari عبر مشاركة، ثم إضافة إلى الشاشة الرئيسية.",
  install_manual: "افتح قائمة المتصفح واختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.",
  install_manual_fallback: "ثبّت LvL من قائمة المتصفح عندما لا يتوفر زر التثبيت.",
  install_step_add: "اختر إضافة إلى الشاشة الرئيسية.",
  install_step_open: "افتح LvL من الأيقونة الجديدة.",
  install_step_share: "اضغط مشاركة في Safari.",
  install_title: "تثبيت LvL",
  message_delete_error: "تعذّر حذف الرسالة. حاول مرة أخرى.",
  message_send_error: "تعذّر إرسال الرسالة. حاول مرة أخرى.",
  messages_add_attachment_aria: "إضافة مرفق",
  messages_back_people_aria: "العودة إلى الأشخاص",
  messages_cancel_upload_aria: "إلغاء الرفع",
  messages_close_new_aria: "إغلاق لوحة المحادثة الجديدة",
  messages_load_older: "تحميل الرسائل الأقدم",
  messages_send_aria: "إرسال رسالة",
  more_btn: "المزيد",
  more_posts_btn: "منشورات أكثر",
  nav_close: "إغلاق",
  nav_mobile_primary_aria: "تنقل الهاتف",
  nav_more_options_aria: "خيارات أخرى",
  nav_page_tools_aria: "أدوات الصفحة",
  nav_primary_aria: "التنقل الرئيسي",
  nav_profile: "الملف الشخصي",
  notif_just_now: "الآن",
  notif_someone: "شخص ما",
  oauth_create_action: "أنشئ الحساب وادخل إلى LvL",
  oauth_create_desc: "نجح تسجيل الدخول. أكمل حقول الملف الشخصي المطلوبة لإنشاء الحساب.",
  oauth_create_title: "أنشئ حساب LvL الخاص بك",
  oauth_finish_desc: "وافق مزوّد الدخول على هويتك. ما زال LvL يحتاج اسم المستخدم والتحقق من العمر وأساسيات الملف الشخصي قبل فتح الحساب.",
  oauth_finish_title: "أكمل ملفك الشخصي في LvL.",
  oauth_page_title: "إكمال تسجيل الدخول الاجتماعي",
  oauth_profile_ready: "الملف الشخصي جاهز",
  oauth_selected_avatar: "الصورة الرمزية الافتراضية المختارة",
  oauth_social_login: "تسجيل دخول اجتماعي",
  oauth_step: "الخطوة 2 من 2",
  onboarding_bio: "نبذة",
  onboarding_bio_placeholder: "سطر قصير عنك",
  onboarding_desc: "أضف بعض التفاصيل وتابع أشخاصًا حتى لا تكون خلاصتك فارغة.",
  onboarding_finish: "إنهاء الإعداد",
  onboarding_follow_people: "تابع بعض الأشخاص",
  onboarding_interests: "الاهتمامات",
  onboarding_location: "الموقع",
  onboarding_profile_basics: "أساسيات الملف الشخصي",
  onboarding_skip: "تخطٍّ",
  onboarding_title: "اجعل LvL يشبهك",
  post_bookmark_aria: "حفظ المنشور",
  post_bookmark_title: "حفظ",
  post_comment: "تعليق",
  post_edit: "تعديل المنشور",
  post_no_comments: "لا توجد تعليقات بعد",
  post_no_comments_desc: "تذكّر أن تكون لطيفًا مع الجميع.",
  post_not_found_desc: "تم حذف المنشور أو أنه لم يكن موجودًا.",
  post_not_found_title: "المنشور غير موجود",
  post_options: "خيارات المنشور",
  post_photo: "صورة",
  post_positive_desc: "اجعل يوم أحدهم أفضل بإيجابيتك.",
  post_replies: "الردود",
  post_reply_tools_aria: "أدوات وسائط الرد",
  post_share_aria: "مشاركة المنشور",
  post_share_title: "المشاركة عبر رسالة مباشرة",
  post_sticker: "ملصق",
  post_title: "منشور",
  pprogress_kicker: "التقدّم العام",
  pprogress_title: "الإنجازات",
  previous_btn: "السابق",
  profile_high_five_aria: "إرسال تحية للملف الشخصي",
  profile_pagination_aria: "صفحات منشورات الملف الشخصي",
  profile_picture: "صورة الملف الشخصي",
  profile_preview_username: "اسم_المستخدم",
  profile_preview_your_name: "اسمك",
  profile_replies: "الردود",
  profile_streak_days: "يوم متتالٍ",
  profile_streak_friend_prefix: "سلسلة صداقة مع",
  profile_tabs_aria: "تبويبات الملف الشخصي",
  profile_view_picture_aria: "عرض صورة الملف الشخصي",
  reel_actions_aria: "إجراءات المقطع",
  reel_allow_comments: "السماح بالتعليقات",
  reel_allow_downloads: "السماح بالتنزيل",
  reel_autoplay_next: "تشغيل التالي تلقائيًا",
  reel_caption: "الوصف",
  reel_caption_placeholder: "اكتب وصفًا",
  reel_characters_left: "حرف متبقٍ",
  reel_choose_community: "اختر مجتمعًا",
  reel_choose_video: "اختر فيديو",
  reel_close_comments: "إغلاق التعليقات",
  reel_comment_placeholder: "أضف تعليقًا…",
  reel_comment_post: "نشر",
  reel_comments: "التعليقات",
  reel_comments_aria: "تعليقات المقطع",
  reel_comments_empty: "لا توجد تعليقات بعد. كن أول المعلّقين!",
  reel_comments_load_error: "تعذّر تحميل التعليقات.",
  reel_comments_unavailable: "التعليقات غير متاحة.",
  reel_community_hint: "مطلوب فقط عندما تكون الرؤية مضبوطة على المجتمع.",
  reel_delete: "حذف المقطع",
  reel_demo: "تجريبي",
  reel_download: "تنزيل",
  reel_empty_desc: "ارفع أول مقطع في LvL أو تحقق من حالة الإعداد إن لم تظهر عمليات الرفع.",
  reel_empty_title: "لا توجد مقاطع بعد",
  reel_feed_aria: "خلاصة المقاطع",
  reel_file_hint: "MP4 أو WebM أو MOV أو M4V. المقاطع القصيرة العمودية تناسب الخلاصة أكثر.",
  reel_filter_aria: "تصفية المقاطع",
  reel_like_aria: "الإعجاب بالمقطع",
  reel_loading_comments: "جارٍ تحميل التعليقات…",
  reel_max_size_prefix: "الحد الأقصى",
  reel_muted: "صامت",
  reel_no_more: "لا مزيد من المقاطع",
  reel_play: "تشغيل",
  reel_play_pause_aria: "تشغيل أو إيقاف المقطع",
  reel_ready_upload: "جاهز للرفع.",
  reel_settings_aria: "إعدادات المقطع",
  reel_setup_health: "حالة الإعداد",
  reel_share_aria: "مشاركة المقطع مع الأصدقاء",
  reel_toggle_sound: "تبديل الصوت",
  reel_upload_desc: "ارفع فيديو عموديًا قصيرًا لخلاصة المقاطع. المقاطع العامة قد تظهر في “لك”، ومقاطع المتابعين تبقى ضمن شبكتك، ومقاطع المجتمع ترتبط بمجموعة.",
  reel_upload_kicker: "إنشاء فيديو",
  reel_upload_submit: "رفع المقطع",
  reel_upload_title: "رفع مقطع",
  reel_video_selected: "تم اختيار الفيديو",
  reel_video_too_large: "حجم هذا الفيديو أكبر من الحد المسموح به.",
  reel_video_type_error: "اختر فيديو بصيغة MP4 أو WebM أو MOV أو M4V.",
  reel_video_unsupported: "متصفحك لا يدعم المقاطع القصيرة.",
  reel_view_comments: "عرض التعليقات",
  reel_visibility: "الرؤية",
  reel_visibility_community: "المجتمع",
  reel_visibility_followers: "المتابعون",
  reel_visibility_hint: "اختر أين يمكن اكتشاف المقطع بعد الرفع.",
  reel_visibility_private: "خاص",
  reel_visibility_public: "عام",
  reply_delete_error: "تعذّر حذف الرد.",
  reply_photo_selected: "تم اختيار صورة:",
  reply_plural: "ردود",
  reply_post_error: "تعذّر نشر الرد.",
  reply_sticker_selected: "تم اختيار ملصق:",
  reset_back_login: "العودة إلى تسجيل الدخول",
  reset_confirm_password: "تأكيد كلمة المرور",
  reset_new_password: "كلمة مرور جديدة",
  reset_send_action: "إرسال رابط إعادة التعيين",
  reset_title: "إعادة تعيين كلمة المرور",
  reset_update_action: "تحديث كلمة المرور",
  saved_drafts_aria: "المسودات المحفوظة",
  search_anything_desc: "ابحث عن الأشخاص والمنشورات والمزيد في LvL.",
  search_anything_title: "ابحث عن أي شيء",
  search_discover_people: "أشخاص لاكتشافهم",
  search_latest: "الأحدث",
  search_more_people: "أشخاص أكثر",
  search_more_results: "نتائج أكثر",
  search_new_to_lvl: "جديد في LvL.",
  search_no_results_for: "لا نتائج لـ",
  search_people: "الأشخاص",
  search_recent_posts: "منشورات حديثة",
  search_top: "الأفضل",
  settings_appearance_sub: "الألوان ولافتة الملف الشخصي",
  settings_autoplay_desc: "الانتقال إلى المقطع التالي تلقائيًا.",
  settings_crop_title: "الاقتصاص والتكبير",
  settings_edit_photo: "تعديل الصورة",
  settings_language_aria: "اختيار اللغة",
  settings_notif_desc: "تشغيل صوت عند وصول إشعارات جديدة.",
  settings_prefs_sub: "التشغيل والإشعارات",
  settings_preview: "معاينة",
  settings_public_info_sub: "ظاهر في ملفك الشخصي",
  settings_upload_photo: "رفع صورة",
  setup_desc: "فحوصات سريعة لخدمات التطبيق والجداول والتخزين وملفات PWA.",
  setup_kicker: "فحوصات المشروع",
  setup_title: "حالة الإعداد",
  share_btn: "مشاركة",
  share_dm_description: "اختر شخصًا لإرسال هذا المنشور إليه.",
  share_dm_empty: "لا يوجد مستخدمون للمشاركة معهم.",
  share_dm_title: "المشاركة عبر رسالة مباشرة",
  share_send_action: "إرسال",
  social_back_profile: "العودة إلى الملف الشخصي",
  social_connected_desc: "أشخاص مرتبطون بهذا الملف الشخصي.",
  social_day_streak: "يوم متتالٍ",
  social_empty_desc: "ستتحدّث هذه القائمة كلما تواصل الناس على LvL.",
  social_empty_title: "لا توجد اتصالات بعد",
  social_friends_desc: "أشخاص لديهم سلسلة تحية أو رسائل نشطة لمدة 7 أيام.",
  sticker_aria: "ملصق",
  streak_days_high_five: "يوم من سلسلة التحية",
  timeline_aria: "الخط الزمني",
  timeline_pagination_aria: "صفحات الخط الزمني",
  upload_error: "خطأ في الرفع",
  upload_failed: "فشل الرفع",
  upload_wait: "يرجى انتظار اكتمال رفع الملف.",
  verification_cooldown: "فترة الانتظار لإعادة التقديم فعّالة. يمكنك التقديم مجددًا بعد:",
  verification_links_placeholder: "مثال: https://example.com/username",
  verification_no_notes: "لا توجد ملاحظات.",
  verification_status_approved: "مقبول",
  verification_status_pending: "قيد المراجعة",
  verification_status_rejected: "مرفوض"
});

/* --- Rail account menu, messages and notification popovers --------------- */

Object.assign(TRANSLATIONS.en, {
  nav_account_menu: "Account menu",
  loading: "Loading…",
  see_all: "See all",
  messages_empty: "No conversations yet.",
  notifications_empty: "Nothing new yet.",
  notif_liked: "liked your post",
  notif_liked_clip: "liked your clip",
  notif_liked_comment: "liked your reply",
  notif_commented: "commented on your post",
  notif_replied: "replied to you",
  notif_commented_clip: "commented on your clip",
  notif_reposted: "reposted your post",
  notif_followed: "started following you",
  notif_friend_request: "sent you a friend request",
  notif_friend_accept: "accepted your friend request",
  notif_messaged: "sent you a message"
});

Object.assign(TRANSLATIONS.tr, {
  nav_account_menu: "Hesap menüsü",
  loading: "Yükleniyor…",
  see_all: "Tümünü gör",
  messages_empty: "Henüz sohbet yok.",
  notifications_empty: "Yeni bir şey yok.",
  notif_liked: "gönderini beğendi",
  notif_liked_clip: "klibini beğendi",
  notif_liked_comment: "yanıtını beğendi",
  notif_commented: "gönderine yorum yaptı",
  notif_replied: "sana yanıt verdi",
  notif_commented_clip: "klibine yorum yaptı",
  notif_reposted: "gönderini yeniden paylaştı",
  notif_followed: "seni takip etmeye başladı",
  notif_friend_request: "sana arkadaşlık isteği gönderdi",
  notif_friend_accept: "arkadaşlık isteğini kabul etti",
  notif_messaged: "sana mesaj gönderdi"
});

Object.assign(TRANSLATIONS.ar, {
  nav_account_menu: "قائمة الحساب",
  loading: "جارٍ التحميل…",
  see_all: "عرض الكل",
  messages_empty: "لا توجد محادثات بعد.",
  notifications_empty: "لا جديد بعد.",
  notif_liked: "أعجب بمنشورك",
  notif_liked_clip: "أعجب بمقطعك",
  notif_liked_comment: "أعجب بردّك",
  notif_commented: "علّق على منشورك",
  notif_replied: "ردّ عليك",
  notif_commented_clip: "علّق على مقطعك",
  notif_reposted: "أعاد نشر منشورك",
  notif_followed: "بدأ بمتابعتك",
  notif_friend_request: "أرسل لك طلب صداقة",
  notif_friend_accept: "قبل طلب صداقتك",
  notif_messaged: "أرسل لك رسالة"
});

Object.assign(TRANSLATIONS.ar, { notif_update: "أرسل تحديثًا" });

/* --- Left rail: level standing card and footer links --------------------- */

Object.assign(TRANSLATIONS.en, {
  rail_level_progress: "Your level progress",
  rail_xp_left: "to the next level",
  rail_about_aria: "About LvL",
  rail_link_contact: "Contact",
  rail_link_verify: "Verification",
  rail_link_careers: "Careers",
  rail_link_terms: "Terms",
  rail_link_privacy: "Privacy"
});

Object.assign(TRANSLATIONS.tr, {
  rail_level_progress: "Seviye ilerlemeniz",
  rail_xp_left: "sonraki seviyeye",
  rail_about_aria: "LvL hakkında",
  rail_link_contact: "İletişim",
  rail_link_verify: "Doğrulama",
  rail_link_careers: "Kariyer",
  rail_link_terms: "Koşullar",
  rail_link_privacy: "Gizlilik"
});

Object.assign(TRANSLATIONS.ar, {
  rail_level_progress: "تقدّم مستواك",
  rail_xp_left: "للمستوى التالي",
  rail_about_aria: "عن LvL",
  rail_link_contact: "اتصل بنا",
  rail_link_verify: "التوثيق",
  rail_link_careers: "الوظائف",
  rail_link_terms: "الشروط",
  rail_link_privacy: "الخصوصية"
});
