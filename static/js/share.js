
document.addEventListener('DOMContentLoaded', () => {
  function translate(key, fallback) {
    if (window.LvLI18n && typeof window.LvLI18n.t === 'function') {
      return window.LvLI18n.t(key, fallback);
    }
    const lang = window.LvLI18n && typeof window.LvLI18n.getCurrentLang === 'function'
      ? window.LvLI18n.getCurrentLang()
      : 'en';
    const dictionary = window.LvLI18n && window.LvLI18n.TRANSLATIONS
      ? window.LvLI18n.TRANSLATIONS[lang]
      : null;
    return (dictionary && dictionary[key]) || fallback;
  }

  function renderFriends(list, friends, clipId) {
    if (friends && friends.length > 0) {
      list.innerHTML = friends.map(f => `
        <div class="share-friend-item">
          <div class="share-friend-info">
            <img src="${f.profile_photo_url || '/static/assets/default-male-avatar.svg'}" class="avatar small-avatar" alt="">
            <span><strong>${f.display_name}</strong><br><small>@${f.username}</small></span>
          </div>
          <button type="button" class="share-send-btn" data-share-send="${f.id}" data-clip-id="${clipId}">${translate('reel_share_send', 'Send')}</button>
        </div>
      `).join('');
    } else {
      list.innerHTML = `<p class="loading-friends">${translate('reel_share_no_users', 'No users found.')}</p>`;
    }
  }

  let searchTimeout;
  document.body.addEventListener('input', (e) => {
    if (e.target.matches('.share-search-input')) {
      const input = e.target;
      const q = input.value.trim();
      const modal = input.closest('[data-share-modal]');
      const card = modal.closest('[data-clip-card]') || modal.closest('[data-reel-card]');
      const clipId = card.dataset.clipId || card.dataset.reelId;
      const list = modal.querySelector('[data-share-friends-list]');
      
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        if (!q) {
          try {
            list.innerHTML = `<p class="loading-friends">${translate('reel_share_loading_friends', 'Loading friends…')}</p>`;
            const res = await fetch('/api/share/friends');
            const data = await res.json();
            renderFriends(list, data.friends, clipId);
          } catch(err) {}
          return;
        }
        
        list.innerHTML = `<p class="loading-friends">${translate('reel_share_searching', 'Searching…')}</p>`;
        try {
          const res = await fetch('/api/share/search?q=' + encodeURIComponent(q));
          const data = await res.json();
          renderFriends(list, data.friends, clipId);
        } catch (err) {
          list.innerHTML = `<p class="loading-friends">${translate('reel_share_search_error', 'Could not search users.')}</p>`;
        }
      }, 300);
    }
  });

  // Share Modal Logic
  document.body.addEventListener('click', async (e) => {
    const trigger = e.target.closest('[data-share-modal-trigger]');
    if (trigger) {
      const card = trigger.closest('[data-clip-card]') || trigger.closest('[data-reel-card]');
      if (!card) return;
      const clipId = card.dataset.clipId || card.dataset.reelId;
      const modal = card.querySelector('[data-share-modal]');
      if (modal) {
        // If comments are open, close them
        const commentPanel = card.querySelector('[data-reel-comment-panel]');
        if (commentPanel) {
          commentPanel.classList.remove('is-open');
          document.body.classList.remove('reel-comments-open');
        }
        modal.removeAttribute('hidden');
        modal.classList.add('is-open');
        
        // Fetch friends if not already loaded
        const list = modal.querySelector('[data-share-friends-list]');
        if (list && list.querySelector('.loading-friends')) {
          try {
            const res = await fetch('/api/share/friends');
            const data = await res.json();
            renderFriends(list, data.friends, clipId);
          } catch (err) {
            list.innerHTML = `<p class="loading-friends">${translate('reel_share_load_error', 'Could not load friends.')}</p>`;
          }
        }
      }
      return;
    }
    
    function hideShareModal(modal) {
      if (!modal) return;
      modal.classList.remove('is-open');
      window.setTimeout(() => {
        if (!modal.classList.contains('is-open')) {
          modal.setAttribute('hidden', '');
        }
      }, 280);
    }

    const closeBtn = e.target.closest('[data-close-share]');
    if (closeBtn) {
      const modal = closeBtn.closest('[data-share-modal]');
      hideShareModal(modal);
      return;
    }
    
    if (e.target.matches('[data-share-modal]')) {
      hideShareModal(e.target);
      return;
    }

    // Dismiss if click is outside modal and outside trigger
    if (!e.target.closest('[data-share-modal]') && !e.target.closest('[data-share-modal-trigger]')) {
      document.querySelectorAll('[data-share-modal].is-open').forEach(hideShareModal);
    }
    
    const sendBtn = e.target.closest('[data-share-send]');
    if (sendBtn && !sendBtn.classList.contains('sent')) {
      const receiverId = sendBtn.dataset.shareSend;
      const clipId = sendBtn.dataset.clipId;
      const url = window.location.origin + '/reels#reel-' + clipId;
      const csrfToken = sendBtn.closest('.reel-card')?.querySelector('input[name="csrf_token"]')?.value || '';
      
      const t = window.LvLI18n && window.LvLI18n.TRANSLATIONS ? window.LvLI18n.TRANSLATIONS[window.LvLI18n.getCurrentLang()] : {};
      sendBtn.textContent = t['reel_share_sending'] || 'Sending...';
      sendBtn.disabled = true;
      
      try {
        const res = await fetch('/api/share/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify({ receiver_id: receiverId, url: url })
        });
        const data = await res.json();
        if (data.success) {
          sendBtn.textContent = t['reel_share_sent'] || 'Sent';
          sendBtn.classList.add('sent');
        } else {
          sendBtn.textContent = t['reel_share_failed'] || 'Failed';
          sendBtn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        sendBtn.textContent = t['reel_share_failed'] || 'Failed';
        sendBtn.disabled = false;
      }
    }
  });
});
