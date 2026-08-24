document.addEventListener('DOMContentLoaded', () => {
    function translateUi(key, fallback) {
        const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
        const dictionary = window.LvLI18n && window.LvLI18n.TRANSLATIONS
            ? window.LvLI18n.TRANSLATIONS[lang]
            : null;
        return dictionary && dictionary[key] !== undefined ? dictionary[key] : fallback;
    }

    function setFollowButtonState(button, following) {
        if (!button) return;
        const key = following ? 'profile_unfollow' : 'profile_follow';
        let label = button.querySelector('[data-follow-label]');
        if (!label) {
            label = document.createElement('span');
            label.setAttribute('data-follow-label', '');
            button.replaceChildren(label);
        }
        label.setAttribute('data-i18n', key);
        label.textContent = translateUi(key, following ? 'Unfollow' : 'Follow');
        button.classList.toggle('active', following);
    }

    function syncFollowControls(targetId, following) {
        document.querySelectorAll('.ajax-action-form[data-action="follow"]').forEach((followForm) => {
            const target = followForm.querySelector('input[name="target_id"]');
            if (!target || String(target.value) !== String(targetId)) return;
            setFollowButtonState(followForm.querySelector('button'), following);
        });
    }

    document.querySelectorAll('.ajax-action-form[data-action="follow"] button').forEach((button) => {
        setFollowButtonState(button, button.classList.contains('active'));
    });
    document.addEventListener('lvl:langchange', () => {
        document.querySelectorAll('.ajax-action-form[data-action="follow"] button').forEach((button) => {
            setFollowButtonState(button, button.classList.contains('active'));
        });
    });

    function triggerTwitterHeartBurst(btn) {
        if (!btn) return;
        const colors = ['#f43f5e', '#ec4899', '#d946ef', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
        const burstContainer = document.createElement('span');
        burstContainer.className = 'lvl-x-burst-container';
        for (let i = 0; i < 8; i++) {
            const dot = document.createElement('span');
            dot.className = `lvl-x-dot lvl-x-dot-${i}`;
            dot.style.setProperty('--dot-color', colors[i]);
            burstContainer.appendChild(dot);
        }
        btn.appendChild(burstContainer);
        setTimeout(() => burstContainer.remove(), 600);
    }

    function triggerLvlInteractionFeedback(btn, labelText) {
        if (!btn) return;
        const ring = document.createElement('span');
        ring.className = 'lvl-shockwave-ring';
        btn.appendChild(ring);
        setTimeout(() => ring.remove(), 600);

        triggerTwitterHeartBurst(btn);

        const xpBadge = document.createElement('span');
        xpBadge.className = 'lvl-xp-particle';
        xpBadge.textContent = labelText || '+XP';
        btn.appendChild(xpBadge);
        setTimeout(() => xpBadge.remove(), 850);
    }

    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.lvl-action-like, .reel-action-like');
        if (likeBtn) {
            triggerTwitterHeartBurst(likeBtn);
        }
    });

    function triggerClipDoubleTapBurst(frameContainer) {
        if (!frameContainer) return;
        const burst = document.createElement('div');
        burst.className = 'lvl-clip-doubletap-burst';
        burst.innerHTML = `
            <div class="lvl-clip-doubletap-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </div>
            <span class="lvl-clip-doubletap-label">+1 XP</span>
        `;
        frameContainer.appendChild(burst);
        setTimeout(() => burst.remove(), 900);
    }

    initFlashMessages();
    initXpToasts();
    initGenderPreview();
    initNewChatPanel();
    initServiceWorker();
    initInstallPrompt();
    initLiveStatusBadges();
    initBirthdayValidation();
    initProfilePreview();
    initProfileAvatarModal();
    initWebBackButton();
    initSwipeBack();
    initHomeReelPanel();
    initCommunityTimeline();
    initReelsFeed();
    initReelUploadPreview();
    initPublicProgress();
    initPreferencesSettings();
    initRichReplies();
    initProgressiveMedia();
    initAjaxDeletePosts();

    function initPublicProgress() {
        const toggle = document.getElementById('pprogress-toggle');
        const body = document.getElementById('pprogress-body');
        if (!toggle || !body) return;

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
            body.classList.toggle('is-collapsed', isExpanded);
        });

        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    }

    const SoundEffects = {
        audioCtx: null,
        lastPlayedTime: 0,
        minInterval: 1000,

        init() {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        },

        play(type) {
            const soundEnabled = window.localStorage.getItem('notification_sounds_enabled') !== 'false';
            if (!soundEnabled) return;

            this.init();
            if (this.audioCtx.state === 'suspended') {
                return;
            }

            const now = Date.now();
            if (now - this.lastPlayedTime < this.minInterval) {
                return;
            }
            this.lastPlayedTime = now;

            try {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                if (type === 'message') {
                    const t = this.audioCtx.currentTime;
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(587.33, t);
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

                    osc.frequency.setValueAtTime(880, t + 0.15);
                    gain.gain.linearRampToValueAtTime(0.18, t + 0.2);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

                    osc.start(t);
                    osc.stop(t + 0.4);
                } else {
                    const t = this.audioCtx.currentTime;
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, t);
                    osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.15);
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

                    osc.start(t);
                    osc.stop(t + 0.25);
                }
            } catch (e) {
                console.warn('Sound play blocked or failed:', e);
            }
        }
    };

    document.addEventListener('click', () => {
        if (SoundEffects.audioCtx && SoundEffects.audioCtx.state === 'suspended') {
            SoundEffects.audioCtx.resume();
        }
    }, { once: true });
    document.addEventListener('touchstart', () => {
        if (SoundEffects.audioCtx && SoundEffects.audioCtx.state === 'suspended') {
            SoundEffects.audioCtx.resume();
        }
    }, { once: true });

    function lockSubmitForm(form, submitBtn) {
        if (!form || form.dataset.submitting === '1') return false;
        form.dataset.submitting = '1';
        if (submitBtn) submitBtn.disabled = true;
        return true;
    }

    function unlockSubmitForm(form, submitBtn) {
        if (!form) return;
        delete form.dataset.submitting;
        if (submitBtn) submitBtn.disabled = false;
    }

    // Auth Tabs Logic
    const authTabs = document.querySelectorAll('[data-auth-tab]');
    const authPanels = document.querySelectorAll('[data-auth-panel]');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            authTabs.forEach(t => t.classList.remove('active'));
            authPanels.forEach(p => p.classList.remove('active'));

            // Add active classes
            tab.classList.add('active');
            const targetPanel = tab.getAttribute('data-auth-tab');
            const panel = document.querySelector(`[data-auth-panel="${targetPanel}"]`);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.auth-form, .premium-form').forEach((form) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', (event) => {
            if (submitBtn && submitBtn.disabled) {
                event.preventDefault();
                return;
            }
            if (!lockSubmitForm(form, submitBtn)) {
                event.preventDefault();
            }
        });
    });

    // Composer Character Count Logic
    const composers = document.querySelectorAll('.composer');
    composers.forEach(composer => {
        const textarea = composer.querySelector('textarea');
        const charCount = composer.querySelector('.char-count');
        const submitBtn = composer.querySelector('button[type="submit"]');
        const imageInput = composer.querySelector('input[type="file"][name="image"]');
        const imageLabel = composer.querySelector('[data-image-label]');
        const imagePreview = composer.querySelector('[data-image-preview]');
        const imagePreviewImg = imagePreview ? imagePreview.querySelector('img') : null;
        const clearImageBtn = composer.querySelector('[data-clear-image]');
        const maxLen = textarea ? parseInt(textarea.getAttribute('maxlength') || '280', 10) : 280;
        let previewUrl = null;
        const draftListUrl = composer.dataset.draftListUrl;
        const draftSaveUrl = composer.dataset.draftSaveUrl;
        const draftDeleteUrl = composer.dataset.draftDeleteUrl;
        const draftIdInput = composer.querySelector('[data-draft-id]');
        const draftClearImageInput = composer.querySelector('[data-draft-clear-image]');
        const saveDraftBtn = composer.querySelector('[data-save-draft]');
        const discardDraftBtn = composer.querySelector('[data-discard-draft]');
        const draftPicker = composer.querySelector('[data-draft-picker]');
        const draftStatus = composer.querySelector('[data-draft-status]');
        const csrfTokenInput = composer.querySelector('input[name="csrf_token"]');
        let drafts = [];
        let draftImageUrl = null;
        let draftImageCleared = false;
        let savingDraft = false;
        let autosaveTimer = null;
        let lastSavedText = '';

        if (textarea && charCount) {
            const updateComposerState = () => {
                const remaining = maxLen - textarea.value.length;
                const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};
                const suffix = t.composer_char_count_suffix || 'left';
                charCount.textContent = `${remaining} ${suffix}`;
                const hasImage = (imageInput && imageInput.files && imageInput.files.length > 0) || Boolean(draftImageUrl);
                const hasGif = Boolean(composer.querySelector('input[name="gif_url"]')?.value);
                const hasSticker = Boolean(composer.querySelector('input[name="sticker"]')?.value);

                if (remaining < 0) {
                    charCount.style.color = 'var(--error-color)';
                    submitBtn.disabled = true;
                } else if (textarea.value.trim().length === 0 && !hasImage && !hasGif && !hasSticker) {
                    submitBtn.disabled = true;
                } else {
                    charCount.style.color = 'var(--text-secondary)';
                    submitBtn.disabled = false;
                }
                
                // auto resize textarea
                textarea.style.height = 'auto';
                textarea.style.height = (textarea.scrollHeight) + 'px';
                updateDraftControls();
            };

            const clearImagePreview = () => {
                if (!imageInput) return;
                imageInput.value = '';
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }
                if (imageLabel) {
                    const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                    const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};
                    imageLabel.textContent = t.composer_add_image || 'Add image';
                }
                if (imagePreviewImg) imagePreviewImg.removeAttribute('src');
                if (imagePreview) imagePreview.hidden = true;
                draftImageUrl = null;
                draftImageCleared = true;
                if (draftClearImageInput) draftClearImageInput.value = '1';
                updateComposerState();
            };

            const refreshImagePreview = () => {
                if (!imageInput || !imageInput.files || !imageInput.files.length) {
                    clearImagePreview();
                    return;
                }

                const file = imageInput.files[0];
                if (imageLabel) imageLabel.textContent = file.name || translateUi('composer_image_selected', 'Image selected');
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }
                draftImageUrl = null;
                draftImageCleared = false;
                if (draftClearImageInput) draftClearImageInput.value = '0';
                if (imagePreview && imagePreviewImg && file.type && file.type.startsWith('image/')) {
                    previewUrl = URL.createObjectURL(file);
                    imagePreviewImg.src = previewUrl;
                    imagePreview.hidden = false;
                } else if (imagePreview) {
                    imagePreview.hidden = true;
                }
            };

            const setDraftStatus = (message, isError = false) => {
                if (!draftStatus) return;
                draftStatus.textContent = message || '';
                draftStatus.style.color = isError ? 'var(--error-color)' : 'var(--text-muted)';
            };

            const currentDraftId = () => draftIdInput ? draftIdInput.value.trim() : '';

            function updateDraftControls() {
                const hasContent = textarea.value.trim().length > 0 || Boolean(draftImageUrl) || (imageInput && imageInput.files && imageInput.files.length > 0);
                if (saveDraftBtn) saveDraftBtn.disabled = savingDraft || !hasContent || textarea.value.length > maxLen;
                if (discardDraftBtn) discardDraftBtn.hidden = !currentDraftId() && !hasContent;
            }

            const showDraftImage = (imageUrl) => {
                draftImageUrl = imageUrl || null;
                draftImageCleared = false;
                if (draftClearImageInput) draftClearImageInput.value = '0';
                if (!imagePreview || !imagePreviewImg || !draftImageUrl) return;
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }
                if (imageInput) imageInput.value = '';
                imagePreviewImg.src = draftImageUrl;
                imagePreview.hidden = false;
                if (imageLabel) imageLabel.textContent = translateUi('composer_saved_image', 'Saved image attached');
            };

            const renderDraftPicker = () => {
                if (!draftPicker) return;
                const selectedId = currentDraftId();
                draftPicker.innerHTML = `<option value="">${translateUi('drafts_title', 'Drafts')}</option>`;
                drafts.forEach((draft) => {
                    const option = document.createElement('option');
                    option.value = String(draft.id);
                    const label = (draft.content || '').trim() || (draft.image_url
                        ? translateUi('draft_image_label', 'Image draft')
                        : translateUi('draft_untitled_label', 'Untitled draft'));
                    option.textContent = label.length > 40 ? `${label.slice(0, 40)}...` : label;
                    draftPicker.appendChild(option);
                });
                draftPicker.value = selectedId;
                draftPicker.hidden = drafts.length === 0;
            };

            const rememberDraft = (draft) => {
                if (!draft || !draft.id) return;
                const existingIndex = drafts.findIndex((item) => String(item.id) === String(draft.id));
                if (existingIndex >= 0) {
                    drafts.splice(existingIndex, 1);
                }
                drafts.unshift(draft);
                drafts = drafts.slice(0, 20);
                renderDraftPicker();
            };

            const saveCurrentDraft = async (silent = false) => {
                if (!draftSaveUrl || savingDraft) return;
                const content = textarea.value.trim();
                const selectedFile = imageInput && imageInput.files && imageInput.files.length ? imageInput.files[0] : null;
                if (!content && !selectedFile && !draftImageUrl && !draftImageCleared) return;

                savingDraft = true;
                updateDraftControls();
                if (!silent) setDraftStatus('Saving...');

                const formData = new FormData();
                formData.append('content', content);
                if (currentDraftId()) formData.append('draft_id', currentDraftId());
                if (draftImageCleared) formData.append('clear_image', '1');
                if (selectedFile) formData.append('image', selectedFile);

                try {
                    const headers = { 'Accept': 'application/json' };
                    if (csrfTokenInput) headers['X-CSRF-Token'] = csrfTokenInput.value;
                    const response = await fetch(draftSaveUrl, {
                        method: 'POST',
                        body: formData,
                        headers
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success || !result.draft) {
                        throw new Error(result.error || 'Could not save draft.');
                    }
                    if (draftIdInput) draftIdInput.value = String(result.draft.id || '');
                    draftImageUrl = result.draft.image_url || null;
                    draftImageCleared = false;
                    if (draftClearImageInput) draftClearImageInput.value = '0';
                    if (selectedFile && imageInput) imageInput.value = '';
                    if (draftImageUrl) showDraftImage(draftImageUrl);
                    rememberDraft(result.draft);
                    lastSavedText = content;
                    setDraftStatus('Draft saved');
                } catch (error) {
                    console.error('Draft save failed:', error);
                    setDraftStatus(error.message || 'Draft save failed', true);
                    if (!silent) showAppToast(error.message || 'Draft save failed', 'error');
                } finally {
                    savingDraft = false;
                    updateDraftControls();
                }
            };

            const loadDrafts = async () => {
                if (!draftListUrl) return;
                try {
                    const response = await fetch(draftListUrl, { headers: { 'Accept': 'application/json' } });
                    const result = await response.json();
                    if (!response.ok || !result.success || !Array.isArray(result.drafts)) return;
                    drafts = result.drafts;
                    renderDraftPicker();
                } catch (error) {
                    console.error('Draft load failed:', error);
                }
            };

            const restoreDraft = (draftId) => {
                const draft = drafts.find((item) => String(item.id) === String(draftId));
                if (!draft) return;
                if (draftIdInput) draftIdInput.value = String(draft.id);
                textarea.value = draft.content || '';
                lastSavedText = textarea.value.trim();
                if (draft.image_url) {
                    showDraftImage(draft.image_url);
                } else {
                    draftImageUrl = null;
                    draftImageCleared = false;
                    if (draftClearImageInput) draftClearImageInput.value = '0';
                    if (imagePreviewImg) imagePreviewImg.removeAttribute('src');
                    if (imagePreview) imagePreview.hidden = true;
                }
                textarea.dispatchEvent(new Event('input'));
                textarea.focus();
                setDraftStatus('Draft restored');
            };

            const discardCurrentDraft = async () => {
                const draftId = currentDraftId();
                if (draftId && draftDeleteUrl) {
                    const formData = new FormData();
                    formData.append('draft_id', draftId);
                    try {
                        const headers = { 'Accept': 'application/json' };
                        if (csrfTokenInput) headers['X-CSRF-Token'] = csrfTokenInput.value;
                        const response = await fetch(draftDeleteUrl, {
                            method: 'POST',
                            body: formData,
                            headers
                        });
                        const result = await response.json();
                        if (!response.ok || !result.success) {
                            throw new Error(result.error || 'Could not discard draft.');
                        }
                        drafts = drafts.filter((item) => String(item.id) !== String(draftId));
                    } catch (error) {
                        console.error('Draft discard failed:', error);
                        showAppToast(error.message || 'Could not discard draft.', 'error');
                        return;
                    }
                }
                if (draftIdInput) draftIdInput.value = '';
                textarea.value = '';
                lastSavedText = '';
                clearImagePreview();
                draftImageCleared = false;
                if (draftClearImageInput) draftClearImageInput.value = '0';
                renderDraftPicker();
                setDraftStatus('Draft discarded');
                textarea.dispatchEvent(new Event('input'));
            };

            const scheduleDraftAutosave = () => {
                if (!draftSaveUrl) return;
                window.clearTimeout(autosaveTimer);
                const content = textarea.value.trim();
                if (!content || content === lastSavedText || textarea.value.length > maxLen) return;
                autosaveTimer = window.setTimeout(() => saveCurrentDraft(true), 1500);
            };

            textarea.addEventListener('input', () => {
                updateComposerState();
                scheduleDraftAutosave();
            });
            if (imageInput) {
                imageInput.addEventListener('change', () => {
                    refreshImagePreview();
                    updateComposerState();
                    scheduleDraftAutosave();
                });
            }
            if (clearImageBtn) {
                clearImageBtn.addEventListener('click', () => {
                    clearImagePreview();
                    scheduleDraftAutosave();
                });
            }
            if (saveDraftBtn) {
                saveDraftBtn.addEventListener('click', () => saveCurrentDraft(false));
            }
            if (discardDraftBtn) {
                discardDraftBtn.addEventListener('click', discardCurrentDraft);
            }
            if (draftPicker) {
                draftPicker.addEventListener('change', () => restoreDraft(draftPicker.value));
            }
            composer.addEventListener('submit', (event) => {
                if (submitBtn && submitBtn.disabled) {
                    event.preventDefault();
                    return;
                }
                if (!lockSubmitForm(composer, submitBtn)) {
                    event.preventDefault();
                }
            });
            // trigger on load
            textarea.dispatchEvent(new Event('input'));
            loadDrafts();
        }
    });

    // Auto resize utility for other textareas if needed
    const textareas = document.querySelectorAll('textarea:not(.composer textarea)');
    textareas.forEach(ta => {
        ta.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    // AJAX Messaging Logic
    const chatForm = document.querySelector('.chat-input-form');
    const messagesFeed = document.getElementById('messages-feed');

    if (chatForm && messagesFeed) {
        const textarea = chatForm.querySelector('textarea');
        const fileInput = document.getElementById('chat-file-input');
        const triggerBtn = document.getElementById('attachment-trigger-btn');
        const previewBox = document.getElementById('attachment-preview-box');
        const previewFilename = document.getElementById('preview-filename');
        const progressBar = document.getElementById('upload-progress-bar');
        const progressText = document.getElementById('upload-progress-text');
        const cancelUploadBtn = document.getElementById('cancel-upload-btn');

        const hiddenTempFilename = document.getElementById('hidden-temp-filename');
        const hiddenAttachmentName = document.getElementById('hidden-attachment-name');
        const hiddenAttachmentType = document.getElementById('hidden-attachment-type');

        let currentUploadXhr = null;

        // Auto focus and auto resize textarea
        if (textarea) {
            textarea.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
                    return;
                }

                event.preventDefault();
                const content = textarea.value.trim();
                const tempFilename = hiddenTempFilename.value;
                if (content || tempFilename) {
                    chatForm.requestSubmit();
                }
            });
        }

        // Trigger file input
        if (triggerBtn && fileInput) {
            triggerBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }

        // Handle file selection and AJAX upload
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                if (!file) return;

                // Validate file extension
                const filename = file.name;
                const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
                const allowedExtensions = [
                    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
                    '.mp4', '.webm', '.mov', '.m4v',
                    '.mp3', '.wav', '.ogg', '.m4a',
                    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'
                ];
                
                const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};

                if (!allowedExtensions.includes(ext)) {
                    showAppToast(t.error_unsupported_file || 'This file type is not supported for security reasons.');
                    fileInput.value = '';
                    return;
                }

                // Validate file size (max 15 MB)
                const maxSize = 15 * 1024 * 1024;
                if (file.size > maxSize) {
                    showAppToast(t.error_file_too_large || 'File size exceeds the limit of 15 MB.');
                    fileInput.value = '';
                    return;
                }

                // Cancel existing upload if any
                if (currentUploadXhr) {
                    currentUploadXhr.abort();
                    currentUploadXhr = null;
                }

                // Show preview box
                if (previewBox) {
                    previewBox.hidden = false;
                    previewFilename.textContent = filename;
                    progressBar.style.width = '0%';
                    progressText.textContent = '0%';
                }

                // Start AJAX upload
                const formData = new FormData();
                formData.append('file', file);

                const xhr = new XMLHttpRequest();
                currentUploadXhr = xhr;

                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        progressBar.style.width = percent + '%';
                        progressText.textContent = percent + '%';
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        try {
                            const res = JSON.parse(xhr.responseText);
                            if (res.success) {
                                hiddenTempFilename.value = res.temp_filename;
                                hiddenAttachmentName.value = res.attachment_name;
                                hiddenAttachmentType.value = res.attachment_type;
                                progressBar.style.width = '100%';
                                progressText.textContent = '100%';
                            } else {
                                showAppToast(res.error || translateUi('upload_failed', 'Upload failed'));
                                resetUploadPreview();
                            }
                        } catch (err) {
                            showAppToast(translateUi('upload_failed', 'Upload failed'));
                            resetUploadPreview();
                        }
                    } else {
                        showAppToast(translateUi('upload_failed', 'Upload failed'));
                        resetUploadPreview();
                    }
                    currentUploadXhr = null;
                });

                xhr.addEventListener('error', () => {
                    showAppToast(translateUi('upload_error', 'Upload error'));
                    resetUploadPreview();
                    currentUploadXhr = null;
                });

                xhr.addEventListener('abort', () => {
                    resetUploadPreview();
                    currentUploadXhr = null;
                });

                xhr.open('POST', '/api/upload_attachment');
                const csrfTokenEl = chatForm.querySelector('input[name="csrf_token"]');
                if (csrfTokenEl) {
                    xhr.setRequestHeader('X-CSRF-Token', csrfTokenEl.value);
                }
                xhr.send(formData);
            });
        }

        // Cancel upload button action
        if (cancelUploadBtn) {
            cancelUploadBtn.addEventListener('click', () => {
                if (currentUploadXhr) {
                    currentUploadXhr.abort();
                } else {
                    resetUploadPreview();
                }
            });
        }

        function resetUploadPreview() {
            if (previewBox) previewBox.hidden = true;
            if (previewFilename) previewFilename.textContent = '';
            if (progressBar) progressBar.style.width = '0%';
            if (progressText) progressText.textContent = '0%';
            if (fileInput) fileInput.value = '';
            if (hiddenTempFilename) hiddenTempFilename.value = '';
            if (hiddenAttachmentName) hiddenAttachmentName.value = '';
            if (hiddenAttachmentType) hiddenAttachmentType.value = '';
        }

        // Form submission
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = chatForm.querySelector('button[type="submit"]');
            const content = textarea.value.trim();
            const tempFilename = hiddenTempFilename.value;

            if (!content && !tempFilename) return;
            if (chatForm.dataset.submitting === '1') return;

            // Wait if upload is in progress
            if (currentUploadXhr) {
                showAppToast(translateUi('upload_wait', 'Please wait for the file to finish uploading.'));
                return;
            }

            lockSubmitForm(chatForm, submitBtn);

            const formData = new FormData(chatForm);
            formData.append('ajax', '1');

            try {
                const response = await fetch(chatForm.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    const wrapper = renderMessage(result.message, true);
                    messagesFeed.appendChild(wrapper);
                    textarea.value = '';
                    textarea.style.height = 'auto';
                    resetUploadPreview();
                    messagesFeed.scrollTop = messagesFeed.scrollHeight;

                    // Update streak display in chat header
                    if (typeof result.streak === 'number') {
                        const streakEl = document.querySelector('[data-chat-streak]');
                        if (streakEl) {
                            streakEl.textContent = `🖐 ${result.streak}`;
                            streakEl.dataset.streakCount = result.streak;
                            const streakLabel = translateUi('streak_days_high_five', 'day high-five streak');
                            streakEl.title = `${result.streak} ${streakLabel}`;
                            streakEl.classList.toggle('streak-badge-zero', result.streak === 0);
                        }
                        if (result.streak_xp > 0) {
                            const streakLabel = translateUi('streak_days_high_five', 'day high-five streak');
                            showXpToasts([{ points: result.streak_xp, label: `🖐 ${result.streak} ${streakLabel}` }]);
                        }
                    }
                } else {
                    showAppToast(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                showAppToast(translateUi('message_send_error', 'Message did not send. Try again.'));
            } finally {
                unlockSubmitForm(chatForm, submitBtn);
            }
        });

        const pollUrl = messagesFeed.dataset.messageApi;
        const loadOlderBtn = messagesFeed.querySelector('[data-load-older-messages]');
        if (pollUrl && loadOlderBtn) {
            loadOlderBtn.addEventListener('click', async () => {
                const firstMessage = messagesFeed.querySelector('[data-message-id]');
                if (!firstMessage || loadOlderBtn.disabled) return;

                loadOlderBtn.disabled = true;
                const previousScrollHeight = messagesFeed.scrollHeight;
                const previousScrollTop = messagesFeed.scrollTop;

                try {
                    const beforeId = firstMessage.dataset.messageId;
                    const response = await fetch(`${pollUrl}?before_id=${encodeURIComponent(beforeId)}`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success || !Array.isArray(result.messages)) {
                        throw new Error(result.error || 'Could not load older messages.');
                    }

                    const existing = new Set(Array.from(messagesFeed.querySelectorAll('[data-message-id]')).map(el => el.dataset.messageId));
                    const fragment = document.createDocumentFragment();
                    result.messages.forEach((message) => {
                        if (existing.has(String(message.id))) return;
                        fragment.appendChild(renderMessage(message, message.sender_id === result.viewer_id));
                    });
                    if (fragment.childNodes.length) {
                        messagesFeed.insertBefore(fragment, firstMessage);
                        messagesFeed.scrollTop = messagesFeed.scrollHeight - previousScrollHeight + previousScrollTop;
                    }
                    if (!result.has_more) {
                        loadOlderBtn.remove();
                    } else {
                        loadOlderBtn.disabled = false;
                    }
                } catch (error) {
                    console.error('Older messages load failed:', error);
                    showAppToast(error.message || 'Could not load older messages.', 'error');
                    loadOlderBtn.disabled = false;
                }
            });
        }

        // Live Poll refreshing
        if (pollUrl) {
            window.setInterval(async () => {
                const messageEls = Array.from(messagesFeed.querySelectorAll('[data-message-id]'));
                const latest = messageEls[messageEls.length - 1];
                const sinceId = latest ? latest.dataset.messageId : '0';
                try {
                    const response = await fetch(`${pollUrl}?since_id=${encodeURIComponent(sinceId)}`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    const result = await response.json();
                    if (!result.success || !Array.isArray(result.messages) || !result.messages.length) return;
                    const existing = new Set(Array.from(messagesFeed.querySelectorAll('[data-message-id]')).map(el => el.dataset.messageId));
                    let newMsgsCount = 0;
                    result.messages.forEach((message) => {
                        if (existing.has(String(message.id))) return;
                        messagesFeed.appendChild(renderMessage(message, message.sender_id === result.viewer_id));
                        if (message.sender_id !== result.viewer_id) {
                            newMsgsCount++;
                        }
                    });
                    if (newMsgsCount > 0) {
                        SoundEffects.play('message');
                    }
                    messagesFeed.scrollTop = messagesFeed.scrollHeight;
                } catch (error) {
                    console.error('Message refresh failed:', error);
                }
            }, 7000);
        }

        // Delete dropdown logic and event delegation
        messagesFeed.addEventListener('click', async (event) => {
            const deleteBtn = event.target.closest('.delete-trigger-btn');
            if (deleteBtn) {
                event.stopPropagation();
                // Toggle dropdown menu
                const dropdownMenu = deleteBtn.nextElementSibling;
                if (dropdownMenu) {
                    const isHidden = dropdownMenu.hidden;
                    // Close all other dropdowns
                    messagesFeed.querySelectorAll('.delete-dropdown-menu').forEach(menu => {
                        menu.hidden = true;
                    });
                    dropdownMenu.hidden = !isHidden;
                }
                return;
            }

            const deleteMenuItem = event.target.closest('.delete-menu-item');
            if (deleteMenuItem) {
                event.preventDefault();
                event.stopPropagation();

                const messageId = deleteMenuItem.dataset.messageId;
                const deleteType = deleteMenuItem.dataset.deleteType; // 'me' or 'everyone'
                const deleteUrl = messagesFeed.dataset.deleteMessageUrl;
                const csrfToken = messagesFeed.dataset.csrfToken;

                if (!deleteUrl || !csrfToken || !messageId) return;

                const formData = new FormData();
                formData.append('message_id', messageId);
                formData.append('delete_type', deleteType);
                formData.append('csrf_token', csrfToken);
                formData.append('ajax', '1');

                try {
                    const response = await fetch(deleteUrl, {
                        method: 'POST',
                        body: formData
                    });
                    const res = await response.json();
                    if (res.success) {
                        const messageWrapper = messagesFeed.querySelector(`[data-message-id="${messageId}"]`);
                        if (messageWrapper) {
                            if (deleteType === 'everyone') {
                                // Replace content to "This message was deleted"
                                const bubble = messageWrapper.querySelector('.message-bubble');
                                if (bubble) {
                                    bubble.className = 'message-bubble deleted-message';
                                    const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                                    const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};
                                    const text = t.message_deleted || 'This message was deleted';
                                    bubble.innerHTML = `<span data-i18n="message_deleted">${escapeHTML(text)}</span>`;
                                }
                                // Remove delete trigger dropdown element
                                const dropdown = messageWrapper.querySelector('.message-delete-dropdown');
                                if (dropdown) dropdown.remove();
                            } else {
                                // Delete for me: remove message wrapper completely
                                messageWrapper.remove();
                            }
                        }
                    } else {
                        showAppToast(res.error || 'Failed to delete message');
                    }
                } catch (error) {
                    console.error('Delete message error:', error);
                    showAppToast(translateUi('message_delete_error', 'Failed to delete message. Try again.'));
                }
                return;
            }

            // Close all dropdowns on click inside chat feed
            messagesFeed.querySelectorAll('.delete-dropdown-menu').forEach(menu => {
                menu.hidden = true;
            });
        });

        // Close dropdowns on document click
        document.addEventListener('click', () => {
            messagesFeed.querySelectorAll('.delete-dropdown-menu').forEach(menu => {
                menu.hidden = true;
            });
        });
    }

    function initNewChatSearch() {
        document.querySelectorAll('[data-new-chat-search]').forEach(input => {
            input.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                const list = e.target.parentElement.nextElementSibling;
                if (list && list.classList.contains('user-selection-list')) {
                    list.querySelectorAll('.user-select-item').forEach(item => {
                        const name = item.querySelector('strong')?.textContent.toLowerCase() || '';
                        const handle = item.querySelector('span')?.textContent.toLowerCase() || '';
                        if (name.includes(val) || handle.includes(val)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    function initNewChatPanel() {
        initNewChatSearch();
        const panel = document.getElementById('new-chat-panel');
        const toggle = document.querySelector('[data-new-chat-toggle]');
        if (!panel || !toggle) return;

        const closeButtons = panel.querySelectorAll('[data-new-chat-close]');
        const setOpen = (open) => {
            panel.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('new-chat-open', open);

            if (open) {
                const firstLink = panel.querySelector('.user-select-item');
                if (firstLink) firstLink.focus();
            } else {
                toggle.focus();
            }
        };

        toggle.addEventListener('click', () => setOpen(panel.hidden));
        closeButtons.forEach((button) => {
            button.addEventListener('click', () => setOpen(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !panel.hidden) {
                setOpen(false);
            }
        });
    }

    function initServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        if (!window.isSecureContext && !['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

        navigator.serviceWorker.register('/service-worker.js').catch((error) => {
            console.error('Service worker registration failed:', error);
        });
    }

    function initInstallPrompt() {
        const promptEl = document.querySelector('[data-install-prompt]');
        if (!promptEl) return;

        const actionButton = promptEl.querySelector('[data-install-action]');
        const dismissButton = promptEl.querySelector('[data-install-dismiss]');
        const iosSteps = promptEl.querySelector('[data-install-ios]');
        const manualSteps = promptEl.querySelector('[data-install-manual]');
        const message = promptEl.querySelector('[data-install-message]');
        const dismissedKey = 'lvl-install-dismissed';
        let deferredPrompt = null;
        let manualPromptTimer = null;

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        if (isStandalone || window.localStorage.getItem(dismissedKey) === '1') {
            return;
        }

        const isiOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
            || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

        const showPrompt = () => {
            promptEl.hidden = false;
        };

        const hidePrompt = () => {
            promptEl.hidden = true;
        };

        const showManualInstallHelp = () => {
            if (deferredPrompt || promptEl.hidden === false) return;
            if (actionButton) {
                actionButton.hidden = true;
            }
            if (manualSteps) {
                manualSteps.hidden = false;
            }
            if (message) {
                message.dataset.i18n = 'install_manual_fallback';
                message.textContent = translateUi('install_manual_fallback', 'Install LvL from your browser menu when the native install button is not available.');
            }
            showPrompt();
        };

        if (isiOS) {
            if (message) {
                message.dataset.i18n = 'install_ios_desc';
                message.textContent = translateUi('install_ios_desc', 'Install LvL from Safari using Share, then Add to Home Screen.');
            }
            if (iosSteps) {
                iosSteps.hidden = false;
            }
            if (manualSteps) {
                manualSteps.hidden = false;
            }
            showPrompt();
        } else {
            manualPromptTimer = window.setTimeout(showManualInstallHelp, 1600);
        }

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
            if (manualPromptTimer) {
                window.clearTimeout(manualPromptTimer);
                manualPromptTimer = null;
            }
            if (iosSteps) {
                iosSteps.hidden = true;
            }
            if (manualSteps) {
                manualSteps.hidden = true;
            }
            if (actionButton) {
                actionButton.hidden = false;
            }
            if (message) {
                message.dataset.i18n = 'install_desc';
                message.textContent = translateUi('install_desc', 'Put LvL on your home screen for a faster app-like experience.');
            }
            showPrompt();
        });

        if (actionButton) {
            actionButton.addEventListener('click', async () => {
                if (!deferredPrompt) {
                    showManualInstallHelp();
                    return;
                }
                deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                deferredPrompt = null;
                if (choice && choice.outcome === 'accepted') {
                    window.localStorage.setItem(dismissedKey, '1');
                    hidePrompt();
                }
            });
        }

        if (dismissButton) {
            dismissButton.addEventListener('click', () => {
                window.localStorage.setItem(dismissedKey, '1');
                hidePrompt();
            });
        }

        window.addEventListener('appinstalled', () => {
            window.localStorage.setItem(dismissedKey, '1');
            hidePrompt();
        });
    }

    // Sidebar mode: desktop stays open; mobile uses header/bottom navigation.
    const sidebar = document.querySelector('.left-rail');
    if (sidebar) {
        localStorage.removeItem('sidebar-menu-open');
        const syncSidebarMode = () => {
            if (window.innerWidth > 991) {
                sidebar.classList.add('menu-open');
                sidebar.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            } else {
                sidebar.classList.remove('menu-open');
                sidebar.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            }
        };

        syncSidebarMode();
        window.addEventListener('resize', syncSidebarMode);
    }

    const mobileProfileTrigger = document.querySelector('[data-mobile-profile-trigger]');
    const mobileAccountMenu = document.querySelector('[data-mobile-account-menu]');
    if (mobileProfileTrigger && mobileAccountMenu) {
        const closeAccountMenu = () => {
            mobileAccountMenu.hidden = true;
            mobileProfileTrigger.setAttribute('aria-expanded', 'false');
        };

        const openAccountMenu = () => {
            mobileAccountMenu.hidden = false;
            mobileProfileTrigger.setAttribute('aria-expanded', 'true');
        };

        mobileProfileTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (mobileAccountMenu.hidden) {
                openAccountMenu();
            } else {
                closeAccountMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (mobileAccountMenu.hidden) return;
            if (mobileAccountMenu.contains(event.target) || mobileProfileTrigger.contains(event.target)) return;
            closeAccountMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAccountMenu();
            }
        });
    }

    // AJAX Like/Repost/Mute/Friend Logic
    const ajaxForms = document.querySelectorAll('.ajax-action-form');
    ajaxForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button');
            if (!btn || btn.dataset.pending === '1') return;
            btn.dataset.pending = '1';
            btn.disabled = true;

            const countTarget = btn.querySelector('strong');
            const formData = new FormData(form);
            formData.append('ajax', '1');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showXpToasts(result.xp_toasts || []);
                    const action = form.dataset.action;
                    if (action === 'like') {
                        btn.classList.toggle('active', result.liked);
                        btn.classList.toggle('like-active', result.liked);
                        const svg = btn.querySelector('svg');
                        const path = svg ? svg.querySelector('path') : null;
                        if (svg) {
                            svg.setAttribute('fill', result.liked ? '#f43f5e' : 'none');
                            svg.setAttribute('stroke', result.liked ? '#f43f5e' : 'currentColor');
                            svg.style.fill = result.liked ? '#f43f5e' : 'none';
                            svg.style.stroke = result.liked ? '#f43f5e' : 'currentColor';
                        }
                        if (path) {
                            path.setAttribute('fill', result.liked ? '#f43f5e' : 'none');
                            path.setAttribute('stroke', result.liked ? '#f43f5e' : 'currentColor');
                            path.style.fill = result.liked ? '#f43f5e' : 'none';
                            path.style.stroke = result.liked ? '#f43f5e' : 'currentColor';
                        }
                        const iconEl = btn.querySelector('.post-action-icon') || svg;
                        if (iconEl && result.liked) {
                            iconEl.style.animation = 'none';
                            void iconEl.offsetWidth;
                            iconEl.style.animation = 'lvl-heart-pop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        }
                        if (countTarget) countTarget.textContent = result.count || '0';
                        if (result.liked) {
                            if (typeof createLikeBurst === 'function') createLikeBurst(btn);
                            triggerLvlInteractionFeedback(btn, '+1 XP');
                        }
                    } else if (action === 'repost') {
                        btn.classList.toggle('active', result.reposted);
                        btn.classList.toggle('repost-active', result.reposted);
                        if (countTarget) countTarget.textContent = result.count || '0';
                        if (result.reposted) triggerLvlInteractionFeedback(btn, 'BOOST!');
                    } else if (action === 'bookmark') {
                        btn.classList.toggle('active', result.bookmarked);
                        btn.classList.toggle('bookmark-active', result.bookmarked);
                        if (result.bookmarked) triggerLvlInteractionFeedback(btn, 'VAULTED!');
                    } else if (action === 'follow') {
                        syncFollowControls(formData.get('target_id'), Boolean(result.following));
                    } else if (action === 'mute') {
                        btn.classList.toggle('active', result.active);
                        const key = result.active ? 'profile_muted' : 'profile_mute';
                        btn.setAttribute('data-i18n', key);
                        btn.textContent = translateUi(key, result.active ? 'Muted' : 'Mute');
                    } else if (action === 'block') {
                        btn.classList.toggle('active', result.active);
                        const key = result.active ? 'profile_unblock' : 'profile_block';
                        btn.setAttribute('data-i18n', key);
                        btn.textContent = translateUi(key, result.active ? 'Unblock' : 'Block');
                    } else if (action === 'friend') {
                        btn.classList.toggle('active', !!result.status);
                        btn.textContent = result.label || 'Add friend';
                    }
                }
                if (!result.success && result.error) showAppToast(result.error);
            } catch (error) {
                console.error('Error performing AJAX action:', error);
                showAppToast(translateUi('action_failed', 'Action did not finish. Try again.'));
                return;
            } finally {
                delete btn.dataset.pending;
                btn.disabled = false;
            }
        });
    });

    document.querySelectorAll('[data-copy-url]').forEach((button) => {
        button.addEventListener('click', async () => {
            const url = button.dataset.copyUrl;
            try {
                await navigator.clipboard.writeText(url);
                button.setAttribute('data-i18n', 'copied_label');
                button.textContent = translateUi('copied_label', 'Copied');
                window.setTimeout(() => {
                    button.setAttribute('data-i18n', 'post_copy_link');
                    button.textContent = translateUi('post_copy_link', 'Copy link');
                }, 1400);
            } catch (error) {
                window.prompt(translateUi('copy_prompt', 'Copy this link'), url);
            }
        });
    });

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderMessage(message, own) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-bubble-wrapper ${own ? 'own' : ''}`;
        wrapper.dataset.messageId = String(message.id || '');

        const time = new Date(message.created_at);
        const timeStr = Number.isNaN(time.getTime())
            ? ''
            : time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');

        const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
        const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};

        let deleteForm = '';
        if (own && message.id && !message.deleted_for_everyone) {
            const delForMe = t.delete_for_me || 'Delete for me';
            const delForEveryone = t.delete_for_everyone || 'Delete for everyone';
            deleteForm = `
                <div class="message-delete-dropdown">
                    <button type="button" class="delete-trigger-btn" aria-label="${escapeHTML(t.message_delete_options || 'Delete options')}">
                        <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 4h3l1-1h4l1 1h3v2H8V4Z"/></svg>
                    </button>
                    <div class="delete-dropdown-menu" hidden>
                        <button type="button" class="delete-menu-item" data-delete-type="me" data-message-id="${escapeHTML(String(message.id))}" data-i18n="delete_for_me">${escapeHTML(delForMe)}</button>
                        <button type="button" class="delete-menu-item" data-delete-type="everyone" data-message-id="${escapeHTML(String(message.id))}" data-i18n="delete_for_everyone">${escapeHTML(delForEveryone)}</button>
                    </div>
                </div>
            `;
        }

        let bodyHtml = '';
        if (message.deleted_for_everyone) {
            const msgDeletedText = t.message_deleted || 'This message was deleted';
            bodyHtml = `<span class="deleted-message" data-i18n="message_deleted">${escapeHTML(msgDeletedText)}</span>`;
        } else if (message.shared_post) {
            const postAuthor = message.shared_post.user || {};
            bodyHtml = `
                <div class="shared-post-label" data-i18n="messages_shared_post">${escapeHTML(t.messages_shared_post || 'Shared a post:')}</div>
                <div class="shared-post-card">
                    <a href="/post/${escapeHTML(String(message.shared_post.id))}" class="shared-post-link">
                        <div class="shared-post-author-row">
                            <img class="shared-post-avatar" src="${escapeHTML(postAuthor.profile_photo_url || '/static/assets/default-male-avatar.svg')}" alt="">
                            <strong>${escapeHTML(postAuthor.display_name || '')}</strong>
                            <span class="shared-post-handle">@${escapeHTML(postAuthor.username || '')}</span>
                        </div>
                        <p class="shared-post-content">${escapeHTML(message.shared_post.content || '')}</p>
                        ${message.shared_post.image_url ? `<img class="shared-post-image" src="${escapeHTML(message.shared_post.image_url)}" alt="">` : ''}
                    </a>
                </div>
            `;
        } else if (message.shared_reel) {
            const reelAuthor = message.shared_reel.user || {};
            bodyHtml = `
                <div class="shared-post-label" data-i18n="messages_shared_clip">${escapeHTML(t.messages_shared_clip || 'Shared a clip:')}</div>
                <div class="shared-post-card" style="position: relative; overflow: hidden; border-radius: 8px; padding: 0;">
                    <a href="/reels#reel-${escapeHTML(String(message.shared_reel.id))}" class="shared-post-link" style="display: block; position: relative; padding: 0;">
                        <div class="shared-post-author-row" style="position: absolute; top: 12px; left: 12px; z-index: 2; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.8); margin: 0;">
                            <img class="shared-post-avatar" src="${escapeHTML(reelAuthor.profile_photo_url || '/static/assets/default-male-avatar.svg')}" alt="" style="border: 2px solid white;">
                            <strong>${escapeHTML(reelAuthor.display_name || '')}</strong>
                        </div>
                        <video src="${escapeHTML(message.shared_reel.video_url || '')}" style="width: 100%; display: block; border-radius: 8px; max-height: 300px; object-fit: cover;" preload="metadata" muted playsinline loop></video>
                        <div style="position: absolute; bottom: 12px; left: 12px; z-index: 2; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.8); width: calc(100% - 24px); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; font-size: 0.9em; margin: 0;">${escapeHTML(message.shared_reel.caption || '')}</div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; color: white; opacity: 0.8; pointer-events: none;">
                            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </a>
                </div>
            `;
        } else {
            let attachmentHtml = '';
            if (message.attachment_url) {
                if (message.attachment_type === 'image') {
                    attachmentHtml = `<div class="message-attachment"><img src="${escapeHTML(message.attachment_url)}" alt="Attachment" class="message-image-preview" loading="lazy"></div>`;
                } else if (message.attachment_type === 'video') {
                    attachmentHtml = `<div class="message-attachment"><video src="${escapeHTML(message.attachment_url)}" controls class="message-video-preview" preload="metadata"></video></div>`;
                } else {
                    attachmentHtml = `
                        <div class="message-attachment">
                            <a href="${escapeHTML(message.attachment_url)}" download class="attachment-download-link">
                                <span class="attachment-icon">📁</span>
                                <span class="attachment-name-text">${escapeHTML(message.attachment_name || 'attachment')}</span>
                            </a>
                        </div>
                    `;
                }
            }

            let textHtml = '';
            if (message.content) {
                let contentEscaped = escapeHTML(message.content).replace(/\n/g, '<br>');
                contentEscaped = contentEscaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
                textHtml = `<div class="message-text-content">${contentEscaped}</div>`;
            }

            bodyHtml = `${attachmentHtml}${textHtml}`;
        }

        const bubbleClass = message.deleted_for_everyone ? 'message-bubble deleted-message' : 'message-bubble';
        wrapper.innerHTML = `
            <div class="${bubbleClass}" title="${escapeHTML(message.created_at || '')}">${bodyHtml}</div>
            <div class="message-meta">
                <span class="message-time">${timeStr}</span>
                ${deleteForm}
            </div>
        `;
        return wrapper;
    }

    function getThemeToken(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function initPreferencesSettings() {
        const autoplayCheckbox = document.getElementById('autoplay-next-reels-checkbox');
        if (autoplayCheckbox) {
            const autoplaySetting = window.localStorage.getItem('autoplay_next_reels');
            autoplayCheckbox.checked = autoplaySetting !== 'false';
            autoplayCheckbox.addEventListener('change', () => {
                window.localStorage.setItem('autoplay_next_reels', autoplayCheckbox.checked ? 'true' : 'false');
            });
        }

        const soundCheckbox = document.getElementById('notification-sounds-checkbox');
        if (soundCheckbox) {
            const soundSetting = window.localStorage.getItem('notification_sounds_enabled');
            soundCheckbox.checked = soundSetting !== 'false';
            soundCheckbox.addEventListener('change', () => {
                window.localStorage.setItem('notification_sounds_enabled', soundCheckbox.checked ? 'true' : 'false');
            });
        }
    }

    function initProfilePreview() {
        const preview = document.querySelector('[data-profile-preview]');
        if (!preview) return;

        const form = preview.closest('form');
        const avatar = preview.querySelector('.profile-preview-avatar');
        const name = preview.querySelector('[data-preview-name]');
        const username = preview.querySelector('[data-preview-username]');
        const bio = preview.querySelector('[data-preview-bio]');
        const color = form.querySelector('input[name="profile_pic"]');
        const first = form.querySelector('input[name="first_name"]');
        const last = form.querySelector('input[name="last_name"]');
        const nick = form.querySelector('input[name="nickname"]');
        const bioInput = form.querySelector('textarea[name="bio"]');
        const fileInput = form.querySelector('[data-profile-photo-input]');

        const update = () => {
            const displayName = `${first.value || ''} ${last.value || ''}`.trim() || translateUi('profile_preview_your_name', 'Your name');
            name.textContent = displayName;
            username.textContent = `@${nick.value || translateUi('profile_preview_username', 'username')}`;
            bio.textContent = bioInput.value || translateUi('profile_no_bio', 'No bio yet.');
            preview.style.setProperty('--profile-preview-color', color.value || getThemeToken('--lvl-primary'));
        };

        [first, last, nick, bioInput, color].forEach(input => input && input.addEventListener('input', update));
        if (fileInput && avatar) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                if (!file) return;
                avatar.src = URL.createObjectURL(file);
            });
        }
        update();
    }

    function initXpToasts() {
        const data = document.getElementById('xp-toast-data');
        if (!data) return;

        try {
            showXpToasts(JSON.parse(data.textContent || '[]'));
        } catch (error) {
            console.error('Could not read XP toast data:', error);
        }
    }

    function initGenderPreview() {
        const genderInputs = document.querySelectorAll('input[name="gender"][data-avatar-url]');
        const preview = document.querySelector('[data-gender-preview]');
        const avatar = document.querySelector('[data-gender-avatar]');
        const swatch = document.querySelector('[data-gender-swatch]');

        if (!genderInputs.length || !preview || !avatar || !swatch) return;

        const updatePreview = () => {
            const selected = document.querySelector('input[name="gender"][data-avatar-url]:checked');

            if (!selected) {
                preview.hidden = true;
                return;
            }

            avatar.src = selected.dataset.avatarUrl || '';
            swatch.style.setProperty('--preview-color', selected.dataset.themeColor || getThemeToken('--lvl-primary'));
            preview.hidden = false;
        };

        genderInputs.forEach(input => {
            input.addEventListener('change', updatePreview);
        });
        updatePreview();
    }

    function showXpToasts(toasts) {
        if (!Array.isArray(toasts) || toasts.length === 0) return;

        let stack = document.querySelector('.xp-toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.className = 'xp-toast-stack';
            document.body.appendChild(stack);
        }

        toasts.forEach((toast, index) => {
            const item = document.createElement('div');
            item.className = `xp-toast ${toast.type === 'level' ? 'level-up' : ''}`;
            item.textContent = toast.message || '';
            stack.appendChild(item);

            window.setTimeout(() => {
                item.classList.add('show');
            }, index * 120);

            window.setTimeout(() => {
                item.classList.remove('show');
                window.setTimeout(() => item.remove(), 220);
            }, 2600 + index * 300);
        });
    }

    function initFlashMessages() {
        document.querySelectorAll('.flash').forEach((flash, index) => {
            if (flash.dataset.flashReady === '1') return;
            flash.dataset.flashReady = '1';
            flash.style.setProperty('--flash-index', index);
            flash.setAttribute('role', flash.classList.contains('error') ? 'alert' : 'status');

            const messageText = document.createElement('span');
            messageText.className = 'flash-message-text';
            while (flash.firstChild) messageText.appendChild(flash.firstChild);
            flash.appendChild(messageText);

            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'flash-close-button';
            closeButton.textContent = '×';
            closeButton.setAttribute('aria-label', translateUi('flash_close', 'Close message'));
            closeButton.setAttribute('title', translateUi('flash_close', 'Close message'));
            closeButton.dataset.i18nAria = 'flash_close';
            closeButton.dataset.i18nTitle = 'flash_close';
            closeButton.addEventListener('click', () => dismissFlash(flash));
            flash.appendChild(closeButton);

            if (!flash.classList.contains('error') && !flash.classList.contains('warning')) {
                window.setTimeout(() => dismissFlash(flash), 8000 + index * 200);
            }
        });
    }

    function dismissFlash(flash) {
        if (!flash || flash.dataset.dismissed === '1') return;
        flash.dataset.dismissed = '1';
        flash.classList.add('is-hiding');
        window.setTimeout(() => flash.remove(), 220);
    }

    function showAppToast(message, category = 'error') {
        if (!message) return;

        let displayMessage = String(message).trim();
        if (category === 'error' && displayMessage.length > 60) {
            console.error('Detailed Error Log:', displayMessage);
            if (displayMessage.toLowerCase().includes('size') || displayMessage.toLowerCase().includes('large')) {
                displayMessage = 'File size too large.';
            } else if (displayMessage.toLowerCase().includes('type') || displayMessage.toLowerCase().includes('format')) {
                displayMessage = 'Unsupported file format.';
            } else if (displayMessage.toLowerCase().includes('permission') || displayMessage.toLowerCase().includes('authorized')) {
                displayMessage = 'Access denied.';
            } else {
                displayMessage = 'Action failed. Please try again.';
            }
        }
        
        // Always attempt to translate the toast
        const originalDisplayMessage = displayMessage;
        if (window.LvLI18n && typeof window.LvLI18n.translateServerMessage === 'function') {
            displayMessage = window.LvLI18n.translateServerMessage(originalDisplayMessage, window.LvLI18n.getCurrentLang());
        }

        const duplicate = Array.from(document.querySelectorAll('.app-toast')).find((flash) => (
            flash.textContent.trim().includes(displayMessage)
            && flash.classList.contains(category)
            && flash.dataset.dismissed !== '1'
        ));
        if (duplicate) {
            duplicate.style.setProperty('--flash-index', '0');
            return;
        }

        const flash = document.createElement('div');
        flash.className = `flash ${category} app-toast`;
        flash.dataset.serverMessage = '';
        flash.dataset.serverMessageOriginal = originalDisplayMessage;
        
        let icon = 'ℹ️';
        if (category === 'success') icon = '✅';
        else if (category === 'error') icon = '❌';
        else if (category === 'warning') icon = '⚠️';

        flash.innerHTML = `<span aria-hidden="true">${icon}</span> <span>${escapeHTML(displayMessage)}</span>`;
        document.body.appendChild(flash);
        initFlashMessages();
    }

    function initLiveStatusBadges() {
        const badges = document.querySelectorAll('[data-live-badge]');
        const notificationFeed = document.querySelector('[data-notifications-feed]');
        if (!badges.length && !notificationFeed) return;

        let lastNotifCount = null;
        let lastMessageCount = null;
        let lastNotificationId = notificationFeed
            ? parseEventId(notificationFeed.dataset.latestNotificationId, 0)
            : null;
        let lastMessageId = null;
        let notificationFeedRefreshing = false;

        const notificationCopy = {
            like: ['❤️', 'notif_like', 'notif_open_post'],
            reel_like: ['❤️', 'notif_reel_like', 'notif_open_clip'],
            repost: ['🔁', 'notif_repost', 'notif_open_post'],
            comment: ['💬', 'notif_comment', 'notif_open_post'],
            comment_reply: ['💬', 'notif_comment_reply', 'notif_open_post'],
            comment_like: ['❤️', 'notif_comment_like', 'notif_open_post'],
            comment_repost: ['🔁', 'notif_comment_repost', 'notif_open_post'],
            reel_comment: ['💬', 'notif_reel_comment', 'notif_open_clip'],
            follow: ['👤', 'notif_follow', 'notif_open_profile'],
            friend_request: ['🤝', 'notif_friend_request', 'notif_open_profile'],
            friend_accept: ['✓', 'notif_friend_accept', 'notif_open_profile'],
            message: ['✉️', 'notif_message', 'notif_open_message'],
            high_five: ['🖐', 'notif_high_five', 'notif_open_profile'],
        };

        function parseEventId(value, fallback = null) {
            const parsed = Number(value);
            return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
        }

        const formatCount = (count) => {
            const safeCount = Number.isFinite(Number(count)) ? Math.max(0, Number(count)) : 0;
            return safeCount > 99 ? '99+' : String(safeCount);
        };

        const updateBadgeGroup = (name, count) => {
            const safeCount = Number.isFinite(Number(count)) ? Math.max(0, Number(count)) : 0;

            document.querySelectorAll(`[data-live-badge="${name}"]`).forEach((badge) => {
                badge.hidden = safeCount <= 0;
                badge.textContent = formatCount(safeCount);
                const unreadKey = name === 'messages' ? 'unread_messages' : (name === 'notifications' ? 'unread_notifications' : 'unread_more');
                badge.setAttribute('aria-label', `${safeCount} ${translateUi(unreadKey, `unread ${name}`)}`);
            });
        };

        const notificationUrl = (notification) => {
            if (notification.post_id) return `/post/${encodeURIComponent(String(notification.post_id))}`;
            if (notification.reel_id) return notification.reel_url || `/reels#reel-${encodeURIComponent(String(notification.reel_id))}`;
            if (notification.type === 'message') return notification.message_url || (notification.actor_username ? `/messages?u=${encodeURIComponent(notification.actor_username)}` : '/messages');
            if (notification.actor_username) return `/profile/${encodeURIComponent(notification.actor_username)}`;
            return '';
        };

        const notificationTime = (value) => {
            const created = new Date(value);
            if (Number.isNaN(created.getTime())) return translateUi('notif_just_now', 'just now');
            const seconds = Math.max(0, Math.floor((Date.now() - created.getTime()) / 1000));
            if (seconds < 60) return translateUi('notif_just_now', 'just now');
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h`;
            return created.toLocaleDateString([], { month: 'short', day: 'numeric' });
        };

        const renderNotificationItem = (notification) => {
            const info = notificationCopy[notification.type] || ['ℹ️', 'notif_update', 'open_btn'];
            const actorUsername = notification.actor_username || '';
            const actorName = notification.actor_summary || notification.actor_name || translateUi('notif_someone', 'Someone');
            const actionUrl = notificationUrl(notification);
            const article = document.createElement('article');
            article.className = `notification-item ${notification.is_read ? '' : 'unread'} new-notification`.trim();
            article.dataset.notificationId = String(notification.id || '');
            article.innerHTML = `
                <div class="notification-icon type-${escapeHTML(notification.type || 'update')}">${escapeHTML(info[0])}</div>
                <div class="notification-body">
                    <div class="notification-header">
                        <a href="${actorUsername ? `/profile/${encodeURIComponent(actorUsername)}` : '#'}" class="actor-link">
                            <strong>${escapeHTML(actorName)}</strong>
                        </a>
                        <span class="notification-text">${escapeHTML(translateUi(info[1], notification.type || 'sent an update'))}</span>
                        <span class="time">· ${escapeHTML(notificationTime(notification.created_at))}</span>
                    </div>
                    ${actionUrl ? `<a href="${escapeHTML(actionUrl)}" class="notification-action">${escapeHTML(translateUi(info[2], 'Open'))}</a>` : ''}
                </div>
            `;
            return article;
        };

        const refreshNotificationFeed = async (sinceId) => {
            if (!notificationFeed || notificationFeedRefreshing) return null;
            notificationFeedRefreshing = true;
            try {
                const params = new URLSearchParams({ since_id: String(sinceId || 0), limit: '10' });
                const response = await fetch(`/api/notifications?${params.toString()}`, { headers: { 'Accept': 'application/json' } });
                if (!response.ok) return null;
                const result = await response.json();
                if (!result.success || !Array.isArray(result.notifications)) return result;

                const existingIds = new Set(Array.from(notificationFeed.querySelectorAll('[data-notification-id]')).map((item) => item.dataset.notificationId));
                const freshNotifications = result.notifications.filter((item) => item && item.id && !existingIds.has(String(item.id)));
                if (freshNotifications.length) {
                    const emptyState = notificationFeed.querySelector('[data-notifications-empty]');
                    if (emptyState) emptyState.remove();
                    freshNotifications.slice().reverse().forEach((item) => {
                        notificationFeed.prepend(renderNotificationItem(item));
                    });
                }

                const returnedLatestId = parseEventId(result.latest_notification_id, sinceId || 0);
                const itemLatestId = freshNotifications.reduce((maxId, item) => Math.max(maxId, parseEventId(item.id, 0)), returnedLatestId || 0);
                notificationFeed.dataset.latestNotificationId = String(itemLatestId || 0);
                return result;
            } catch (error) {
                console.error('Notification feed refresh failed:', error);
                return null;
            } finally {
                notificationFeedRefreshing = false;
            }
        };

        const refresh = async () => {
            try {
                const response = await fetch('/api/live-status', { headers: { 'Accept': 'application/json' } });
                if (!response.ok) return;
                const result = await response.json();
                if (!result.success) return;

                const notifCount = Number.isFinite(Number(result.unread_notifications)) ? Math.max(0, Number(result.unread_notifications)) : 0;
                const messageCount = Number.isFinite(Number(result.unread_messages)) ? Math.max(0, Number(result.unread_messages)) : 0;
                const currentNotificationId = parseEventId(result.latest_notification_id);
                const currentMessageId = parseEventId(result.latest_message_id);
                const hasNewNotificationId = lastNotificationId !== null && currentNotificationId !== null && currentNotificationId > lastNotificationId;
                const hasNewMessageId = lastMessageId !== null && currentMessageId !== null && currentMessageId > lastMessageId;

                if ((hasNewNotificationId || (lastNotifCount !== null && notifCount > lastNotifCount))) {
                    SoundEffects.play('notification');
                }
                if ((hasNewMessageId || (lastMessageCount !== null && messageCount > lastMessageCount))) {
                    SoundEffects.play('message');
                }

                const previousNotificationId = lastNotificationId;
                if (currentMessageId !== null) {
                    lastMessageId = Math.max(lastMessageId || 0, currentMessageId);
                }

                if (hasNewNotificationId && notificationFeed) {
                    const feedResult = await refreshNotificationFeed(previousNotificationId || 0);
                    if (feedResult && feedResult.success && currentNotificationId !== null) {
                        const feedLatestId = parseEventId(notificationFeed.dataset.latestNotificationId, currentNotificationId);
                        lastNotificationId = Math.max(lastNotificationId || 0, feedLatestId || 0, currentNotificationId);
                    }
                } else if (currentNotificationId !== null) {
                    lastNotificationId = Math.max(lastNotificationId || 0, currentNotificationId);
                }
                if (notificationFeed && lastNotificationId !== null) {
                    notificationFeed.dataset.latestNotificationId = String(lastNotificationId);
                }

                lastNotifCount = notifCount;
                lastMessageCount = messageCount;
                updateBadgeGroup('notifications', notifCount);
                updateBadgeGroup('messages', messageCount);
                updateBadgeGroup('more', notifCount + messageCount);
            } catch (error) {
                console.error('Live status refresh failed:', error);
            }
        };

        refresh();
        window.setInterval(refresh, 8000);
    }

    document.querySelectorAll('[data-post-menu-toggle]').forEach((toggle) => {
        const header = toggle.closest('.post-header');
        const menu = header ? header.querySelector('[data-post-menu]') : null;
        if (!menu) return;

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const opening = menu.hidden;
            document.querySelectorAll('[data-post-menu]').forEach((otherMenu) => {
                if (otherMenu !== menu) otherMenu.hidden = true;
            });
            document.querySelectorAll('[data-post-menu-toggle]').forEach((otherToggle) => {
                if (otherToggle !== toggle) otherToggle.setAttribute('aria-expanded', 'false');
            });
            menu.hidden = !opening;
            toggle.setAttribute('aria-expanded', String(opening));
        });
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-post-menu]') || event.target.closest('[data-post-menu-toggle]')) {
            return;
        }
        document.querySelectorAll('[data-post-menu]').forEach((menu) => {
            menu.hidden = true;
        });
        document.querySelectorAll('[data-post-menu-toggle]').forEach((toggle) => {
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    function initCommunityTimeline() {
        const hub = document.querySelector('[data-community-hub]');
        if (!hub) return;

        const track = hub.querySelector('[data-community-track]');
        const tabs = Array.from(hub.querySelectorAll('[data-community-tab]'));
        const panes = Array.from(hub.querySelectorAll('[data-community-pane]'));
        if (!track || !tabs.length || !panes.length) return;

        hub.classList.add('is-enhanced');
        const tabOrder = tabs.map((tab) => tab.dataset.communityTab).filter(Boolean);

        const setActive = (key, updateHistory = false) => {
            if (!tabOrder.includes(key)) return false;

            hub.dataset.activeTab = key;
            tabs.forEach((tab) => {
                const active = tab.dataset.communityTab === key;
                tab.classList.toggle('active', active);
                if (active) {
                    tab.setAttribute('aria-current', 'page');
                } else {
                    tab.removeAttribute('aria-current');
                }
            });
            panes.forEach((pane) => {
                const active = pane.dataset.communityPane === key;
                pane.classList.toggle('active', active);
                pane.hidden = !active;
            });

            if (updateHistory) {
                const activeTab = tabs.find((tab) => tab.dataset.communityTab === key);
                if (activeTab && activeTab.href) {
                    window.history.replaceState(null, '', activeTab.href);
                }
            }

            return true;
        };

        const activateByOffset = (offset) => {
            const current = hub.dataset.activeTab || tabOrder[0];
            const currentIndex = Math.max(0, tabOrder.indexOf(current));
            const nextIndex = Math.min(tabOrder.length - 1, Math.max(0, currentIndex + offset));
            const nextKey = tabOrder[nextIndex];
            if (nextKey && nextKey !== current) {
                setActive(nextKey, true);
            }
        };

        tabs.forEach((tab) => {
            tab.addEventListener('click', (event) => {
                const key = tab.dataset.communityTab;
                if (!key) return;
                if (setActive(key, true)) {
                    event.preventDefault();
                }
            });
        });

        let pointerStart = null;
        track.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) return;
            if (event.target.closest('a, button, input, textarea, select, label')) return;
            pointerStart = { x: event.clientX, y: event.clientY };
        }, { passive: true });

        track.addEventListener('pointerup', (event) => {
            if (!pointerStart) return;
            const deltaX = event.clientX - pointerStart.x;
            const deltaY = event.clientY - pointerStart.y;
            pointerStart = null;

            if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
            activateByOffset(deltaX < 0 ? 1 : -1);
        }, { passive: true });

        track.addEventListener('pointercancel', () => {
            pointerStart = null;
        }, { passive: true });

        const tabNav = hub.querySelector('.community-timeline-tabs');
        if (tabNav) {
            tabNav.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    activateByOffset(-1);
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    activateByOffset(1);
                }
            });
        }

        const initial = hub.dataset.activeTab || tabs[0].dataset.communityTab;
        setActive(initial, false);
    }

    function initReelsFeed() {
        const feeds = document.querySelectorAll('[data-reels-feed]');
        if (!feeds.length) return;

        feeds.forEach((feed) => {
            const cards = Array.from(feed.querySelectorAll('[data-reel-card]'));
            if (!cards.length) return;

            const viewed = new Set();
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const soundPreferenceKey = 'lvlReelsSoundOn';
            let soundOn = false;
            let activeCard = null;

            try {
                soundOn = window.sessionStorage.getItem(soundPreferenceKey) === '1';
            } catch (error) {
                soundOn = false;
            }

            const saveSoundPreference = () => {
                try {
                    window.sessionStorage.setItem(soundPreferenceKey, soundOn ? '1' : '0');
                } catch (error) {}
            };

            const translateUiLocal = (key, fallback) => {
                if (typeof translateUi === 'function') return translateUi(key, fallback);
                return fallback;
            };

            const updateMuteControl = (button, label, muted) => {
                if (!button) return;
                const labelKey = muted ? 'reel_muted' : 'reel_sound_on';
                const ariaKey = muted ? 'reel_unmute_aria' : 'reel_mute_aria';
                if (label) {
                    label.dataset.i18n = labelKey;
                    label.textContent = translateUiLocal(labelKey, muted ? 'Muted' : 'Sound on');
                }
                button.classList.toggle('active', !muted);
                button.dataset.i18nAria = ariaKey;
                button.setAttribute('aria-label', translateUiLocal(ariaKey, muted ? 'Unmute clips' : 'Mute clips'));
            };

            const applySoundPreference = (card) => {
                const video = card.querySelector('[data-reel-video]');
                const muteButton = card.querySelector('[data-reel-mute]');
                const muteLabel = card.querySelector('[data-reel-mute-icon]');
                if (!video) return;
                video.muted = !soundOn;
                updateMuteControl(muteButton, muteLabel, video.muted);
            };

            const applySoundPreferenceToAll = () => cards.forEach(applySoundPreference);

            const commentsAreOpen = () => document.body.classList.contains('reel-comments-open');

            const updatePlayIcon = (card) => {
                const video = card.querySelector('[data-reel-video]');
                const label = card.querySelector('[data-reel-play-icon]');
                if (!video || !label) return;
                const labelKey = video.paused ? 'reel_play' : 'reel_pause';
                label.dataset.i18n = labelKey;
                label.textContent = translateUiLocal(labelKey, video.paused ? 'Play' : 'Pause');
                card.classList.toggle('is-paused', video.paused);
            };

            const pauseCard = (card) => {
                const video = card.querySelector('[data-reel-video]');
                if (video && !video.paused) video.pause();
                card.classList.remove('active');
                updatePlayIcon(card);
            };

            const markViewed = async (card) => {
                const reelId = card.dataset.reelId;
                const viewUrl = card.dataset.viewUrl;
                if (!reelId || !viewUrl || viewed.has(reelId)) return;
                viewed.add(reelId);
                const token = card.querySelector('input[name="csrf_token"]');
                const formData = new FormData();
                formData.append('ajax', '1');
                if (token) formData.append('csrf_token', token.value);
                try {
                    await fetch(viewUrl, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                } catch (e) {}
            };

            const retryActivePlay = (card, video) => {
                window.setTimeout(() => {
                    if (commentsAreOpen() || card !== activeCard || !video || !video.paused || video.readyState < 2) return;
                    video.play().catch(() => {
                        card.classList.add('is-paused');
                        updatePlayIcon(card);
                    });
                }, 400);
            };

            const activateCard = (card) => {
                if (!card || activeCard === card) return;
                cards.forEach((item) => { if (item !== card) pauseCard(item); });
                activeCard = card;
                card.classList.add('active');
                const video = card.querySelector('[data-reel-video]');
                if (!video) return;
                applySoundPreference(card);
                // load if preload=none
                if (video.readyState === 0) {
                    video.load();
                }
                if (video.paused) {
                    const pp = video.play();
                    if (pp && typeof pp.catch === 'function') {
                        pp.catch(() => {
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                            retryActivePlay(card, video);
                        });
                    }
                }
                updatePlayIcon(card);
                markViewed(card);
            };

            const scrollToCard = (card) => {
                if (!card) return;
                card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            };

            const goToOffset = (offset) => {
                if (!activeCard) { scrollToCard(cards[0]); return; }
                const index = cards.indexOf(activeCard);
                const next = cards[Math.max(0, Math.min(cards.length - 1, index + offset))];
                scrollToCard(next);
            };

            // For the main reels page use the feed container as scroll root; for profile use viewport
            const isMainReelsFeed = feed.classList.contains('reels-feed');
            const observerRoot = isMainReelsFeed ? feed : null;
            const observerThreshold = isMainReelsFeed ? 0.5 : 0.3;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= observerThreshold) {
                        activateCard(entry.target);
                    } else if (!entry.isIntersecting) {
                        pauseCard(entry.target);
                    }
                });
            }, { root: observerRoot, threshold: [observerThreshold] });

            cards.forEach((card) => {
                observer.observe(card);
                const video = card.querySelector('[data-reel-video]');
                const playButton = card.querySelector('[data-reel-play]');
                const muteButton = card.querySelector('[data-reel-mute]');
                const muteLabel = card.querySelector('[data-reel-mute-icon]');

                const togglePlay = () => {
                    if (!video) return;
                    if (video.readyState === 0) video.load();
                    if (video.paused) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                    window.setTimeout(() => updatePlayIcon(card), 0);
                };

                if (video) {
                    const adjustAspectRatio = () => {
                        const aspect = video.videoWidth / video.videoHeight;
                        const frame = card.querySelector('.reel-video-frame');
                        if (frame && aspect) {
                            if (aspect > 1.2) {
                                frame.style.aspectRatio = '16 / 9';
                                frame.style.width = 'min(560px, 100%)';
                            } else if (aspect < 0.8) {
                                frame.style.aspectRatio = '9 / 16';
                                frame.style.width = 'min(calc(var(--max-reel-height) * 9 / 16), 420px, 100%)';
                            } else {
                                frame.style.aspectRatio = '1 / 1';
                                frame.style.width = 'min(480px, 100%)';
                            }
                        }
                    };

                    if (video.readyState >= 1) {
                        adjustAspectRatio();
                    } else {
                        video.addEventListener('loadedmetadata', adjustAspectRatio);
                    }

                    let lastTapTime = 0;
                    let singleTapTimer = null;
                    video.addEventListener('click', (e) => {
                        const currentTime = Date.now();
                        const tapLength = currentTime - lastTapTime;
                        if (tapLength < 300 && tapLength > 0) {
                            clearTimeout(singleTapTimer);
                            const frame = card.querySelector('.reel-video-frame');
                            if (typeof triggerClipDoubleTapBurst === 'function') triggerClipDoubleTapBurst(frame);
                            const likeForm = card.querySelector('[data-reel-like-form]');
                            if (likeForm) {
                                const likeBtn = likeForm.querySelector('button');
                                if (likeBtn) likeBtn.click();
                            }
                            lastTapTime = 0;
                        } else {
                            lastTapTime = currentTime;
                            singleTapTimer = setTimeout(() => { togglePlay(); }, 300);
                        }
                    });

                    video.addEventListener('play', () => updatePlayIcon(card));
                    video.addEventListener('pause', () => updatePlayIcon(card));
                    video.addEventListener('canplay', () => {
                        if (commentsAreOpen() || card !== activeCard || !video.paused) return;
                        video.play().catch(() => {
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                            retryActivePlay(card, video);
                        });
                    });
                    video.addEventListener('ended', () => {
                        const autoplaySetting = window.localStorage.getItem('autoplay_next_reels') !== 'false';
                        if (!autoplaySetting) {
                            video.pause();
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                            return;
                        }
                        const index = cards.indexOf(card);
                        if (index < cards.length - 1) {
                            const nextCard = cards[index + 1];
                            scrollToCard(nextCard);
                            window.setTimeout(() => {
                                if (!commentsAreOpen()) activateCard(nextCard);
                            }, reducedMotion ? 0 : 450);
                        } else {
                            const note = document.querySelector('[data-reels-end]');
                            if (note && !commentsAreOpen()) {
                                note.hidden = false;
                                window.setTimeout(() => { note.hidden = true; }, 1800);
                            }
                            video.pause();
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                        }
                    });
                }

                if (playButton) playButton.addEventListener('click', togglePlay);
                if (video) applySoundPreference(card);
                if (muteButton && video) {
                    muteButton.addEventListener('click', () => {
                        soundOn = video.muted;
                        saveSoundPreference();
                        applySoundPreferenceToAll();
                    });
                }

                // Comment panel toggle
                const commentToggle = card.querySelector('[data-reel-comment-toggle]');
                const commentPanel = card.querySelector('[data-reel-comment-panel]');
                const commentClose = card.querySelector('[data-reel-comment-close]');

                if (commentToggle && commentPanel) {
                    let commentsLoaded = false;

                    const openPanel = async () => {
                        commentPanel.classList.add('is-open');
                        document.body.classList.add('reel-comments-open');
                        if (!commentsLoaded) {
                            commentsLoaded = true;
                            await loadReelComments(card, commentPanel, commentToggle);
                        }
                    };

                    const closePanel = () => {
                        commentPanel.classList.remove('is-open');
                        document.body.classList.remove('reel-comments-open');
                    };

                    commentToggle.addEventListener('click', () => {
                        if (commentPanel.classList.contains('is-open')) {
                            closePanel();
                        } else {
                            openPanel();
                        }
                    });

                    if (commentClose) commentClose.addEventListener('click', closePanel);

                    const commentForm = commentPanel.querySelector('[data-reel-comment-form]');
                    if (commentForm) {
                        commentForm.addEventListener('submit', async (event) => {
                            event.preventDefault();
                            const input = commentForm.querySelector('input[name="comment"]');
                            const submitBtn = commentForm.querySelector('button[type="submit"]');
                            if (!input || !input.value.trim()) return;
                            if (commentForm.dataset.submitting === '1') return;
                            if (typeof lockSubmitForm === 'function') lockSubmitForm(commentForm, submitBtn);
                            const formData = new FormData(commentForm);
                            formData.append('ajax', '1');
                            try {
                                const response = await fetch(commentForm.action, {
                                    method: 'POST',
                                    body: formData,
                                    headers: { 'Accept': 'application/json' }
                                });
                                const result = await response.json();
                                if (!result.success) {
                                    if (typeof showAppToast === 'function') showAppToast(result.error || 'Could not post comment.');
                                    return;
                                }
                                const countEl = card.querySelector('[data-reel-comment-count]');
                                if (countEl) countEl.textContent = result.count || '0';
                                const commentData = result.comment || {};
                                commentData._viewerName = commentForm.dataset.viewerName;
                                commentData._viewerUsername = commentForm.dataset.viewerUsername;
                                commentData._viewerAvatar = commentForm.dataset.viewerAvatar;
                                appendReelComment(commentPanel, commentData, true);
                                input.value = '';
                                if (typeof showXpToasts === 'function') showXpToasts(result.xp_toasts || []);
                            } catch (error) {
                                console.error('Could not post reel comment:', error);
                                if (typeof showAppToast === 'function') showAppToast(translateUiLocal('comment_post_error', 'Comment did not post. Try again.'));
                            } finally {
                                if (typeof unlockSubmitForm === 'function') unlockSubmitForm(commentForm, submitBtn);
                            }
                        });
                    }
                }
            });

            feed.querySelectorAll('[data-reel-like-form]').forEach((form) => {
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const btn = form.querySelector('button');
                    if (btn && btn.dataset.pending === '1') return;
                    if (btn) { btn.dataset.pending = '1'; btn.disabled = true; }
                    const formData = new FormData(form);
                    formData.append('ajax', '1');
                    try {
                        const response = await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                        const result = await response.json();
                        if (!result.success) {
                            if (typeof showAppToast === 'function') showAppToast(result.error || 'Could not like reel.');
                            return;
                        }
                        if (btn) {
                            btn.classList.toggle('active', result.liked);
                            btn.classList.toggle('like-active', result.liked);
                            const svg = btn.querySelector('svg');
                            const path = svg ? svg.querySelector('path') : null;
                            if (svg) {
                                svg.setAttribute('fill', result.liked ? '#f43f5e' : 'none');
                                svg.setAttribute('stroke', result.liked ? '#f43f5e' : 'currentColor');
                                svg.style.fill = result.liked ? '#f43f5e' : 'none';
                                svg.style.stroke = result.liked ? '#f43f5e' : 'currentColor';
                            }
                            if (path) {
                                path.setAttribute('fill', result.liked ? '#f43f5e' : 'none');
                                path.setAttribute('stroke', result.liked ? '#f43f5e' : 'currentColor');
                                path.style.fill = result.liked ? '#f43f5e' : 'none';
                                path.style.stroke = result.liked ? '#f43f5e' : 'currentColor';
                            }
                            if (svg && result.liked) {
                                svg.style.animation = 'none';
                                void svg.offsetWidth;
                                svg.style.animation = 'lvl-heart-pop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                            }
                            if (result.liked && typeof createLikeBurst === 'function') {
                                createLikeBurst(btn);
                            }
                        }
                        const count = form.querySelector('[data-reel-like-count]');
                        if (count) count.textContent = result.count || '0';
                        if (typeof showXpToasts === 'function') showXpToasts(result.xp_toasts || []);
                    } catch (error) {
                        console.error('Could not like reel:', error);
                        if (typeof showAppToast === 'function') showAppToast(translateUiLocal('action_failed', 'Action did not finish. Try again.'));
                    } finally {
                        if (btn) { delete btn.dataset.pending; btn.disabled = false; }
                    }
                });
            });

            // Keyboard navigation (only for main reels feed)
            if (isMainReelsFeed) {
                document.addEventListener('keydown', (event) => {
                    if (!document.querySelector('[data-reels-feed]')) return;
                    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
                    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
                        event.preventDefault();
                        goToOffset(1);
                    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
                        event.preventDefault();
                        goToOffset(-1);
                    } else if (event.key === ' ') {
                        event.preventDefault();
                        const button = activeCard ? activeCard.querySelector('[data-reel-play]') : null;
                        if (button) button.click();
                    } else if (event.key.toLowerCase() === 'm') {
                        const button = activeCard ? activeCard.querySelector('[data-reel-mute]') : null;
                        if (button) button.click();
                    }
                });
            }

            // Auto-activate first card in viewport
            window.requestAnimationFrame(() => {
                let targetCard = cards[0];
                if (isMainReelsFeed && window.location.hash) {
                    try {
                        const hashId = window.location.hash.substring(1);
                        const hashCard = feed.querySelector('#' + hashId) || feed.querySelector('[data-reel-id="' + hashId.replace('reel-', '') + '"]');
                        if (hashCard) targetCard = hashCard.closest('[data-reel-card]') || hashCard;
                    } catch (e) {}
                }
                activateCard(targetCard);
            });
        }); // end feeds.forEach
    }

    async function loadReelComments(card, panel, toggleBtn) {
        const listEl = panel.querySelector('[data-reel-comment-list]');
        if (!listEl) return;
        const url = toggleBtn.dataset.commentsUrl;
        if (!url) {
            listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_comments_unavailable', 'Comments are not available.'))}</p>`;
            return;
        }
        listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_loading_comments', 'Loading comments…'))}</p>`;
        try {
            const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
            const result = await response.json();
            listEl.innerHTML = '';
            if (!result.success) {
                listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(result.error || translateUi('reel_comments_load_error', 'Could not load comments.'))}</p>`;
                return;
            }
            if (!result.comments || result.comments.length === 0) {
                listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_comments_empty', 'No comments yet. Be the first!'))}</p>`;
                return;
            }
            result.comments.forEach((comment) => appendReelComment(panel, comment, false));
            listEl.scrollTop = listEl.scrollHeight;
        } catch (error) {
            console.error('Could not load reel comments:', error);
            listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_comments_load_error', 'Could not load comments.'))}</p>`;
        }
    }

    function appendReelComment(panel, comment, scrollToBottom) {
        const listEl = panel.querySelector('[data-reel-comment-list]');
        if (!listEl) return;
        const empty = listEl.querySelector('.reel-comment-empty');
        if (empty) empty.remove();
        const user = comment.user || {};
        const avatarSrc = user.profile_photo_url || comment._viewerAvatar || '/static/assets/default-male-avatar.svg';
        const displayName = escapeHTML(user.display_name || comment._viewerName || user.username || 'User');
        const username = escapeHTML(user.username || comment._viewerUsername || '');
        const text = escapeHTML(comment.comment || '');
        const time = comment.created_at ? new Date(comment.created_at).toLocaleDateString() : '';
        const item = document.createElement('div');
        item.className = 'reel-comment-item';
        item.innerHTML = `
            <img class="avatar reel-comment-avatar" src="${escapeHTML(avatarSrc)}" alt="">
            <div class="reel-comment-body">
                <span class="reel-comment-author">${displayName}</span>
                <span class="reel-comment-handle">@${username}</span>
                <p class="reel-comment-text">${text}</p>
                ${time ? `<time class="reel-comment-time">${time}</time>` : ''}
            </div>
        `;
        listEl.appendChild(item);
        if (scrollToBottom) listEl.scrollTop = listEl.scrollHeight;
    }

    function initProfileAvatarModal() {
        const btn = document.querySelector('[data-profile-avatar-open]');
        if (!btn) return;
        const img = btn.querySelector('img');
        if (!img || !img.src) return;

        btn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'avatar-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', translateUi('profile_picture', 'Profile picture'));
            modal.innerHTML = `
                <button class="avatar-modal-close" aria-label="${escapeHTML(translateUi('nav_close', 'Close'))}">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
                <img src="${escapeHTML(img.src)}" alt="${escapeHTML(translateUi('profile_picture', 'Profile picture'))}">
            `;
            document.body.appendChild(modal);
            window.requestAnimationFrame(() => modal.classList.add('is-open'));

            const closeModal = () => {
                modal.classList.remove('is-open');
                window.setTimeout(() => modal.remove(), 220);
            };

            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.avatar-modal-close')) closeModal();
            });

            const keyHandler = (e) => {
                if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', keyHandler); }
            };
            document.addEventListener('keydown', keyHandler);
        });
    }

    function initReelUploadPreview() {
        const form = document.querySelector('[data-reel-upload-form]');
        if (!form) return;

        const input = form.querySelector('[data-reel-video-input]');
        const preview = form.querySelector('[data-reel-preview]');
        const previewVideo = preview ? preview.querySelector('video') : null;
        const submit = form.querySelector('[data-reel-submit]');
        const message = form.querySelector('[data-reel-upload-message]');
        const label = form.querySelector('[data-reel-file-label]');
        const caption = form.querySelector('textarea[name="caption"]');
        const captionCount = form.querySelector('[data-reel-caption-count]');
        const visibility = form.querySelector('[data-reel-visibility]');
        const communityField = form.querySelector('[data-reel-community-field]');
        const communitySelect = form.querySelector('select[name="community_id"]');
        const csrfTokenInput = form.querySelector('input[name="csrf_token"]');
        const allowComments = form.querySelector('input[name="allow_comments"]');
        const allowDownloads = form.querySelector('input[name="allow_downloads"]');
        const autoplayNext = form.querySelector('input[name="autoplay_next"]');
        const maxBytes = parseInt(form.dataset.maxVideoBytes || '0', 10);
        const uploadEndpoint = form.dataset.uploadUrl;
        const completeEndpoint = form.dataset.completeUrl;
        const allowedTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']);
        let previewUrl = null;
        const defaultSubmitText = submit ? submit.textContent : '';

        const setMessage = (text, isError = false, i18nKey = '') => {
            if (!message) return;
            if (i18nKey) message.dataset.i18n = i18nKey;
            else delete message.dataset.i18n;
            message.textContent = text || '';
            message.classList.toggle('error', isError);
        };

        const clearPreview = () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            previewUrl = null;
            if (previewVideo) previewVideo.removeAttribute('src');
            if (preview) preview.hidden = true;
        };

        const validateVideo = () => {
            clearPreview();
            const file = input && input.files ? input.files[0] : null;
            if (!file) {
                if (submit) submit.disabled = true;
                if (label) {
                    label.dataset.i18n = 'reel_choose_video';
                    label.textContent = translateUi('reel_choose_video', 'Choose video');
                }
                setMessage('');
                return;
            }
            if (label) {
                delete label.dataset.i18n;
                label.textContent = file.name || translateUi('reel_video_selected', 'Video selected');
            }
            if (maxBytes && file.size > maxBytes) {
                if (submit) submit.disabled = true;
                setMessage(translateUi('reel_video_too_large', 'This video is larger than the configured upload limit.'), true, 'reel_video_too_large');
                return;
            }
            if (file.type && !allowedTypes.has(file.type)) {
                if (submit) submit.disabled = true;
                setMessage(translateUi('reel_video_type_error', 'Choose an MP4, WebM, MOV, or M4V video.'), true, 'reel_video_type_error');
                return;
            }
            previewUrl = URL.createObjectURL(file);
            if (previewVideo) {
                previewVideo.src = previewUrl;
                previewVideo.load();
            }
            if (preview) preview.hidden = false;
            if (submit) submit.disabled = false;
            setMessage(translateUi('reel_ready_upload', 'Ready to upload.'), false, 'reel_ready_upload');
        };

        if (input) input.addEventListener('change', validateVideo);
        if (caption && captionCount) {
            caption.addEventListener('input', () => {
                captionCount.textContent = String(Math.max(0, 220 - caption.value.length));
            });
        }
        if (visibility && communityField) {
            const toggleCommunity = () => {
                communityField.hidden = visibility.value !== 'community';
            };
            visibility.addEventListener('change', toggleCommunity);
            toggleCommunity();
        }

        const postUploadJson = async (url, payload) => {
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            if (csrfTokenInput && csrfTokenInput.value) {
                headers['X-CSRF-Token'] = csrfTokenInput.value;
            }
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            let data = {};
            try {
                data = await response.json();
            } catch (_error) {
                data = {};
            }
            if (!response.ok || data.success === false) {
                throw new Error(data.error || 'Could not upload that video.');
            }
            return data;
        };

        const uploadDirectly = async (file) => {
            if (submit) submit.textContent = 'Preparing...';
            setMessage('Preparing secure upload...');
            const prepared = await postUploadJson(uploadEndpoint, {
                filename: file.name,
                content_type: file.type || 'application/octet-stream',
                size: file.size
            });

            if (submit) submit.textContent = 'Uploading...';
            setMessage('Uploading video...');
            const uploadBody = new FormData();
            uploadBody.append('file', file, file.name);
            const uploadResponse = await fetch(prepared.upload_url, {
                method: 'PUT',
                body: uploadBody
            });
            if (!uploadResponse.ok) {
                throw new Error('Video upload failed before it reached LvL.');
            }

            if (submit) submit.textContent = 'Saving...';
            setMessage('Saving clip...');
            const completed = await postUploadJson(completeEndpoint, {
                storage_path: prepared.storage_path,
                caption: caption ? caption.value : '',
                visibility: visibility ? visibility.value : 'public',
                community_id: communitySelect ? communitySelect.value : '',
                allow_comments: !!(allowComments && allowComments.checked),
                allow_downloads: !!(allowDownloads && allowDownloads.checked),
                autoplay_next: !!(autoplayNext && autoplayNext.checked)
            });
            window.location.assign(completed.redirect_url || '/reels');
        };

        form.addEventListener('submit', async (event) => {
            if (submit && submit.disabled) {
                event.preventDefault();
                return;
            }
            const file = input && input.files ? input.files[0] : null;
            if (file && uploadEndpoint && completeEndpoint && window.fetch && window.FormData) {
                event.preventDefault();
                if (!lockSubmitForm(form, submit)) return;
                try {
                    await uploadDirectly(file);
                } catch (error) {
                    unlockSubmitForm(form, submit);
                    if (submit) submit.textContent = defaultSubmitText;
                    setMessage(error.message || 'Could not upload that video.', true);
                }
                return;
            }
            if (!lockSubmitForm(form, submit)) {
                event.preventDefault();
            }
        });
    }

    function initHomeReelPanel() {
        const panel = document.querySelector('[data-home-reel-panel]');
        if (!panel) return;

        const slides = Array.from(panel.querySelectorAll('[data-home-reel-slide]'));
        if (!slides.length) return;

        const slidesContainer = panel.querySelector('[data-home-reel-slides]');
        let current = 0;
        let panelVisible = false;

        const getVideo = (slide) => slide.querySelector('[data-home-reel-video]');
        const getPlayBtn = (slide) => slide.querySelector('[data-home-reel-play]');
        const getPlayIcon = (slide) => slide.querySelector('[data-play-icon]');

        const pauseSlide = (slide) => {
            const vid = getVideo(slide);
            if (vid && !vid.paused) vid.pause();
        };

        const updatePlayIcon = (slide) => {
            const vid = getVideo(slide);
            const icon = getPlayIcon(slide);
            if (!vid || !icon) return;
            // Show play icon when paused, hide when playing
            icon.style.opacity = vid.paused ? '1' : '0';
        };

        const activateSlide = (index, options = {}) => {
            const { scroll = false, autoplay = panelVisible } = options;
            slides.forEach((s, i) => {
                s.classList.toggle('is-active', i === index);
                if (i !== index) pauseSlide(s);
            });
            current = index;

            const activeSlide = slides[current];
            if (scroll && slidesContainer) {
                slidesContainer.scrollTo({
                    top: activeSlide.offsetTop,
                    behavior: 'smooth'
                });
            }
            const vid = getVideo(activeSlide);
            if (vid) {
                if (autoplay) vid.play().catch(() => {});
                updatePlayIcon(activeSlide);
                vid.addEventListener('play', () => updatePlayIcon(activeSlide), { once: false });
                vid.addEventListener('pause', () => updatePlayIcon(activeSlide), { once: false });
            }
        };

        slides.forEach((slide) => {
            const vid = getVideo(slide);
            const playBtn = getPlayBtn(slide);
            const muteBtn = slide.querySelector('[data-home-reel-mute]');

            if (vid) {
                const adjustHomeAspect = () => {
                    const aspect = vid.videoWidth / vid.videoHeight;
                    const wrap = slide.querySelector('.home-reel-video-wrap');
                    if (wrap && aspect) {
                        if (aspect > 1.2) {
                            wrap.style.aspectRatio = '16 / 9';
                        } else if (aspect < 0.8) {
                            wrap.style.aspectRatio = '9 / 16';
                        } else {
                            wrap.style.aspectRatio = '1 / 1';
                        }
                    }
                };

                if (vid.readyState >= 1) {
                    adjustHomeAspect();
                } else {
                    vid.addEventListener('loadedmetadata', adjustHomeAspect);
                }

                vid.addEventListener('ended', () => {
                    const autoplaySetting = window.localStorage.getItem('autoplay_next_reels') !== 'false';
                    if (!autoplaySetting) {
                        vid.pause();
                        updatePlayIcon(slide);
                        return;
                    }
                    const nextIndex = current + 1;
                    if (nextIndex < slides.length) {
                        activateSlide(nextIndex, { scroll: true, autoplay: true });
                    } else {
                        vid.pause();
                        updatePlayIcon(slide);
                    }
                });

                vid.addEventListener('click', () => {
                    if (vid.paused) { vid.play().catch(() => {}); } else { vid.pause(); }
                    updatePlayIcon(slide);
                });
                vid.addEventListener('play', () => updatePlayIcon(slide));
                vid.addEventListener('pause', () => updatePlayIcon(slide));
            }

            if (playBtn && vid) {
                playBtn.addEventListener('click', () => {
                    if (vid.paused) { vid.play().catch(() => {}); } else { vid.pause(); }
                    updatePlayIcon(slide);
                });
            }

            if (muteBtn && vid) {
                muteBtn.addEventListener('click', () => {
                    vid.muted = !vid.muted;
                    muteBtn.classList.toggle('active', !vid.muted);
                    const muteKey = vid.muted ? 'home_unmute_aria' : 'home_mute_aria';
                    muteBtn.dataset.i18nAria = muteKey;
                    muteBtn.setAttribute('aria-label', translateUi(muteKey, vid.muted ? 'Unmute' : 'Mute'));
                });
            }
        });

        if (slidesContainer) {
            const slideObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
                    const index = slides.indexOf(entry.target);
                    if (index >= 0 && index !== current) {
                        activateSlide(index, { autoplay: panelVisible });
                    }
                });
            }, { root: slidesContainer, threshold: [0.55, 0.75] });
            slides.forEach((slide) => slideObserver.observe(slide));
        }

        // Auto-play first slide when visible via IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                panelVisible = entry.isIntersecting;
                if (entry.isIntersecting) {
                    const vid = getVideo(slides[current]);
                    if (vid && vid.paused) vid.play().catch(() => {});
                } else {
                    pauseSlide(slides[current]);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(panel);

        activateSlide(0, { autoplay: false });
    }

    // Auto-focus composer if URL has compose=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('compose') === '1') {
        const composerTextarea = document.querySelector('.composer textarea');
        if (composerTextarea) {
            composerTextarea.focus();
            // Scroll to top to ensure it's visible
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function initBirthdayValidation() {
        const birthdayInputs = document.querySelectorAll('input[type="date"][name="birthday"]');
        birthdayInputs.forEach(input => {
            const form = input.closest('form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                if (!input.value) return;

                const date = new Date(input.value);
                const today = new Date();
                
                if (date > today) {
                    e.preventDefault();
                    showAppToast(translateUi('birthday_future_error', 'Birthday cannot be in the future.'));
                    return;
                }

                let age = today.getFullYear() - date.getFullYear();
                const m = today.getMonth() - date.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                    age--;
                }

                if (age < 14) {
                    e.preventDefault();
                    showAppToast(translateUi('birthday_min_age_error', 'You must be at least 14 years old to use LvL.'));
                    return;
                }

                if (age > 120 || date.getFullYear() < 1900) {
                    e.preventDefault();
                    showAppToast(translateUi('birthday_realistic_error', 'Please enter a realistic birthday.'));
                    return;
                }
            });
        });
    }
});

function initRichReplies() {
    const form = document.querySelector('[data-ajax-reply-form]');
    if (!form) return;
    const textarea = form.querySelector('textarea[name="comment"]');
    const parentInput = form.querySelector('input[name="parent_comment_id"]');
    const stickerInput = form.querySelector('input[name="sticker"]');
    const imageInput = form.querySelector('[data-reply-image]');
    const status = form.querySelector('[data-reply-media-status]');
    const commentsFeed = document.querySelector('[data-comments-feed]');
    const countLabel = document.querySelector('[data-reply-count]');
    const translateReplyUi = (key, fallback) => {
        const lang = window.LvLI18n && typeof window.LvLI18n.getCurrentLang === 'function'
            ? window.LvLI18n.getCurrentLang()
            : 'en';
        const dictionary = window.LvLI18n && window.LvLI18n.TRANSLATIONS
            ? window.LvLI18n.TRANSLATIONS[lang]
            : null;
        return (dictionary && dictionary[key]) || fallback;
    };

    const toggle = (buttonSelector, panelSelector) => {
        const button = form.querySelector(buttonSelector);
        const panel = form.querySelector(panelSelector);
        if (button && panel) button.addEventListener('click', () => { panel.hidden = !panel.hidden; });
    };
    toggle('[data-emoji-toggle]', '[data-emoji-picker]');
    toggle('[data-sticker-toggle]', '[data-sticker-picker]');
    // Note: [data-gif-toggle] is handled by the GIF picker block below

    form.querySelectorAll('[data-insert-emoji]').forEach((button) => button.addEventListener('click', () => {
        const start = textarea.selectionStart || textarea.value.length;
        textarea.setRangeText(button.dataset.insertEmoji, start, textarea.selectionEnd || start, 'end');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
    }));
    form.querySelectorAll('[data-select-sticker]').forEach((button) => button.addEventListener('click', () => {
        stickerInput.value = button.dataset.selectSticker;
        status.textContent = `${translateReplyUi('reply_sticker_selected', 'Sticker selected:')} ${button.dataset.selectSticker}`;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }));
    if (imageInput) imageInput.addEventListener('change', () => {
        status.textContent = imageInput.files[0] ? `${translateReplyUi('reply_photo_selected', 'Photo selected:')} ${imageInput.files[0].name}` : '';
    });

    document.addEventListener('click', (event) => {
        const replyButton = event.target.closest('[data-reply-to]');
        if (!replyButton) return;
        const username = replyButton.dataset.replyTo;
        textarea.value = `@${username} ${textarea.value.replace(/^@\w+\s*/, '')}`;
        parentInput.value = replyButton.dataset.parentComment || '';
        textarea.focus();
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const bindInsertedActions = (root) => {
        root.querySelectorAll('.ajax-action-form').forEach((actionForm) => actionForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = actionForm.querySelector('button');
            if (!button || button.dataset.pending === '1') return;
            const data = new FormData(actionForm);
            data.append('ajax', '1');
            button.dataset.pending = '1';
            button.disabled = true;
            try {
                const response = await fetch(actionForm.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
                const result = await response.json();
                if (!result.success) { showAppToast(result.error || 'Action failed.'); return; }
                const count = button.querySelector('strong');
                if (actionForm.dataset.action === 'like') {
                    button.classList.toggle('active', result.liked);
                    button.classList.toggle('like-active', result.liked);
                }
                if (actionForm.dataset.action === 'repost') {
                    button.classList.toggle('active', result.reposted);
                    button.classList.toggle('repost-active', result.reposted);
                }
                if (count) count.textContent = result.count || '0';
            } catch (error) {
                console.error(error);
                showAppToast(translateReplyUi('action_failed', 'Action failed.'));
            } finally {
                delete button.dataset.pending;
                button.disabled = false;
            }
        }));
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submit = form.querySelector('button[type="submit"]');
        if (submit.dataset.pending === '1') return;
        const data = new FormData(form);
        data.append('ajax', '1');
        submit.dataset.pending = '1';
        submit.disabled = true;
        try {
            const response = await fetch(form.action, { method: 'POST', body: data });
            const result = await response.json();
            if (!result.success) { showAppToast(result.error || translateReplyUi('reply_post_error', 'Reply could not be posted.')); return; }
            const wrapper = document.createElement('div');
            wrapper.innerHTML = result.html.trim();
            const card = wrapper.firstElementChild;
            commentsFeed.querySelector('.empty-state')?.remove();
            commentsFeed.appendChild(card);
            bindInsertedActions(card);
            bindDeleteComment(card);
            const total = commentsFeed.querySelectorAll('[data-comment-id]').length;
            countLabel.textContent = `${total} ${translateReplyUi(total === 1 ? 'reply_singular' : 'reply_plural', total === 1 ? 'reply' : 'replies')}`;
            form.reset();
            parentInput.value = '';
            status.textContent = '';
            form.querySelectorAll('.reply-picker, [data-gif-field]').forEach((panel) => { panel.hidden = true; });
            const gifUrlInput = form.querySelector('input[name="gif_url"]');
            if (gifUrlInput) gifUrlInput.value = '';
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
            console.error(error);
            showAppToast(translateReplyUi('reply_post_error', 'Reply could not be posted.'));
        } finally {
            delete submit.dataset.pending;
            submit.disabled = false;
        }
    });
    // ── GIF Picker (Tenor via backend proxy) ─────────────────────────────────
    const gifField = form.querySelector('[data-gif-field]');
    const gifToggle = form.querySelector('[data-gif-toggle]');
    if (gifField && gifToggle) {
        const gifSearch = gifField.querySelector('[data-gif-search]');
        const gifSearchBtn = gifField.querySelector('[data-gif-search-btn]');
        const gifResults = gifField.querySelector('[data-gif-results]');
        const gifSelectedPreview = gifField.querySelector('[data-gif-selected-preview]');
        const gifPreviewImg = gifField.querySelector('[data-gif-preview-img]');
        const gifClear = gifField.querySelector('[data-gif-clear]');
        const gifUrlInput = form.querySelector('input[name="gif_url"]');

        const t = (key, fb) => translateReplyUi(key, fb);

        const renderGifResults = (gifs) => {
            gifResults.innerHTML = '';
            if (!gifs || !gifs.length) {
                gifResults.textContent = t('gif_no_results', 'No GIFs found');
                return;
            }
            gifs.forEach((gif) => {
                // Tenor format: gif.media_formats.tinygif.url for thumb, gif.media_formats.gif.url for full
                const thumbUrl = gif.media_formats?.tinygif?.url
                    || gif.media_formats?.mediumgif?.url
                    || gif.media_formats?.gif?.url || '';
                const fullUrl = gif.media_formats?.gif?.url
                    || gif.media_formats?.mediumgif?.url
                    || thumbUrl;
                if (!thumbUrl) return;
                const img = document.createElement('img');
                img.src = thumbUrl;
                img.alt = gif.title || 'GIF';
                img.loading = 'lazy';
                img.className = 'gif-result-item';
                img.addEventListener('click', () => {
                    gifUrlInput.value = fullUrl;
                    gifPreviewImg.src = thumbUrl;
                    gifSelectedPreview.hidden = false;
                    gifResults.hidden = true;
                    gifSearch.value = gif.title || '';
                    // Explicitly enable the submit button so users can post just a GIF
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) submitBtn.disabled = false;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                });
                gifResults.appendChild(img);
            });
        };

        const loadGifs = async (query) => {
            gifResults.textContent = t('gif_loading', 'Loading…');
            gifResults.hidden = false;
            try {
                const url = query
                    ? `/api/gif-search?q=${encodeURIComponent(query)}`
                    : `/api/gif-search?q=trending`;
                const resp = await fetch(url);
                const json = await resp.json();
                renderGifResults(json.results || []);
            } catch {
                gifResults.textContent = t('gif_no_results', 'No GIFs found');
            }
        };

        // On toggle open, load trending GIFs
        gifToggle.addEventListener('click', () => {
            const isOpen = !gifField.hidden;
            gifField.hidden = isOpen;
            if (!isOpen && !gifUrlInput.value) {
                loadGifs('');
            }
        });

        if (gifSearchBtn) gifSearchBtn.addEventListener('click', () => loadGifs(gifSearch.value.trim()));
        if (gifSearch) gifSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); loadGifs(gifSearch.value.trim()); }
        });
        if (gifClear) gifClear.addEventListener('click', () => {
            gifUrlInput.value = '';
            gifPreviewImg.src = '';
            gifSelectedPreview.hidden = true;
            gifResults.hidden = false;
            gifSearch.value = '';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            loadGifs('');
        });

        // Note: toggle is handled above, not by the generic toggle()
    }

    const bindDeleteComment = (root) => {
        root.querySelectorAll('.action-trigger-delete-comment').forEach((btn) => {
            if (btn.dataset.deleteCommentBound === '1') return;
            btn.dataset.deleteCommentBound = '1';
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const article = btn.closest('article.comment');
                const commentId = btn.dataset.commentId;
                const data = new FormData();
                data.append('csrf_token', document.querySelector('input[name="csrf_token"]')?.value || '');
                data.append('comment_id', commentId);
                data.append('ajax', '1');
                try {
                    const resp = await fetch('/delete_comment', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
                    const result = await resp.json();
                    if (!result.success) { showAppToast(result.error || translateReplyUi('reply_delete_error', 'Could not delete reply.')); return; }
                    if (article) {
                        article.style.opacity = '0';
                        article.style.transition = 'opacity 0.2s';
                        setTimeout(() => article.remove(), 220);
                    }
                    const feed = commentsFeed;
                    if (feed) {
                        const total = feed.querySelectorAll('[data-comment-id]').length - 1;
                        if (total <= 0) {
                            if (!feed.querySelector('.empty-state')) feed.innerHTML = `<div class="empty-state">${translateReplyUi('comments_empty', 'No replies yet.')}</div>`;
                            if (countLabel) countLabel.textContent = `0 ${translateReplyUi('reply_plural', 'replies')}`;
                        } else {
                            if (countLabel) countLabel.textContent = `${total} ${translateReplyUi(total === 1 ? 'reply_singular' : 'reply_plural', total === 1 ? 'reply' : 'replies')}`;
                        }
                    }
                } catch (err) {
                    console.error(err);
                    showAppToast(translateReplyUi('reply_delete_error', 'Could not delete reply.'));
                }
            });
        });
    };

    bindDeleteComment(document);

    // Also bind on newly-inserted comment cards
    const origBind = bindInsertedActions;
    const augmentedBind = (root) => {
        origBind(root);
        bindDeleteComment(root);
    };
}

// ▪ AJAX Delete Post (global, outside initRichReplies) ▪
function initAjaxDeletePosts() {
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.action-trigger-delete');
        if (!btn) return;
        e.preventDefault();
        
        const article = btn.closest('article.post');
        const postId = btn.dataset.postId;
        const data = new FormData();
        data.append('csrf_token', document.querySelector('input[name="csrf_token"]')?.value || '');
        data.append('post_id', postId);
        data.append('ajax', '1');
        
        const t = (k, fb) => {
            const lang = window.LvLI18n?.getCurrentLang?.() || 'en';
            return window.LvLI18n?.TRANSLATIONS?.[lang]?.[k] || fb;
        };
        
        try {
            const resp = await fetch('/delete_post', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
            const result = await resp.json();
            if (!result.success) { showAppToast(result.error || t('post_delete_error', 'Could not delete post.')); return; }
            if (article) {
                article.style.opacity = '0';
                article.style.transition = 'opacity 0.25s';
                setTimeout(() => {
                    article.remove();
                    // If on detail page, go home
                    if (document.querySelector('.thread-root') && !document.querySelector('article.post')) {
                        window.location.href = '/';
                    }
                }, 250);
            }
        } catch (err) {
            console.error(err);
            showAppToast(t('post_delete_error', 'Could not delete post.'));
        }
    });
}

function initProgressiveMedia() {
    document.querySelectorAll('.post-media img, .comment-media img').forEach((image) => {
        const container = image.closest('.post-media, .comment-media');
        if (!container) return;
        container.classList.add('media-loading');
        const done = () => container.classList.remove('media-loading');
        if (image.complete) done();
        else image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
    });

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const video = entry.target;
            if (video.preload === 'none') video.preload = 'metadata';
            observer.unobserve(video);
        });
    }, { rootMargin: '320px 0px' });
    document.querySelectorAll('video[preload="none"]').forEach((video) => observer.observe(video));
}

function initWebBackButton() {
    document.querySelectorAll('[data-web-back]').forEach((button) => {
        button.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }
            window.location.href = '/';
        });
    });
}

function initSwipeBack() {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    window.addEventListener('touchstart', (event) => {
        if (!event.touches || event.touches.length !== 1) return;
        const touch = event.touches[0];
        if (touch.clientX > 28) return;
        startX = touch.clientX;
        startY = touch.clientY;
        tracking = true;
    }, { passive: true });

    window.addEventListener('touchend', (event) => {
        if (!tracking || !event.changedTouches || event.changedTouches.length !== 1) return;
        tracking = false;
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = Math.abs(touch.clientY - startY);
        if (deltaX < 84 || deltaY > 70) return;
        if (window.history.length > 1) {
            window.history.back();
        }
    }, { passive: true });
}
