import re

html_path = r'templates\level_guide.html'
js_path = r'static\js\i18n.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace XP rules
html = html.replace(
    '<span>{{ reward.label }}</span>',
    '<span data-i18n="xp_reward_{{ loop.index0 }}_label">{{ reward.label }}</span>'
).replace(
    '<p>{{ reward.description }}</p>',
    '<p data-i18n="xp_reward_{{ loop.index0 }}_desc">{{ reward.description }}</p>'
)

# Replace Level rewards
html = html.replace(
    '<strong>{{ reward.label }}</strong>',
    '<strong data-i18n="lvl_reward_{{ loop.index0 }}_label">{{ reward.label }}</strong>'
)

# Replace Roadmap
html = html.replace(
    '<strong role="cell">{{ item.reward }}</strong>',
    '<strong role="cell" data-i18n="lvl_roadmap_{{ loop.index0 }}_reward">{{ item.reward }}</strong>'
).replace(
    '<span class="reward-type-pill" role="cell">{{ item.type }}</span>',
    '<span class="reward-type-pill" role="cell" data-i18n="lvl_roadmap_{{ loop.index0 }}_type">{{ item.type }}</span>'
).replace(
    '<p role="cell">{{ item.visual }}</p>',
    '<p role="cell" data-i18n="lvl_roadmap_{{ loop.index0 }}_visual">{{ item.visual }}</p>'
).replace(
    '<p role="cell">{{ item.purpose }}</p>',
    '<p role="cell" data-i18n="lvl_roadmap_{{ loop.index0 }}_purpose">{{ item.purpose }}</p>'
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated level_guide.html')

