import os

path = 'templates/layout.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '<div class="trending-list custom-scrollbar timeline" role="list">'
replacement = '''<style>.trending-panel .timeline .post { flex-shrink: 0; }</style>
<div class="trending-list custom-scrollbar timeline" role="list" style="overflow-y: auto; overflow-x: hidden;">'''

content = content.replace(target, replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
