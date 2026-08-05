import re
from pathlib import Path

regex = re.compile(r'style="[^"]*(?:border-radius|border:|padding:|gap:|height:|background:)', re.I)

for p in Path('templates').glob('*.html'):
    content = p.read_text(encoding='utf-8')
    for m in regex.finditer(content):
        line_no = content[:m.start()].count('\n') + 1
        print(f'{p.name} Line {line_no}: {content[m.start():m.start()+200]}')
