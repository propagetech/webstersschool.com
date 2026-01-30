import os
import re

# Directory containing the HTML files
BASE_DIR = '/Users/chetan/Documents/propage/webstersschool.com'

# The logo HTML to insert
LOGO_HTML = '''
          <li class="logo-item">
            <a href="index.html" class="logo" aria-label="Websters School home">
              <img src="imgs/745072416122103a657bc7a0d8fa0646.webp" alt="Websters School" width="116" height="48">
            </a>
          </li>'''

# Regex to find the logo in the header container (to remove it)
# Matches <a href="index.html" class="logo" ...>...</a> potentially surrounded by whitespace
LOGO_REMOVE_PATTERN = re.compile(r'\s*<a href="index\.html" class="logo"[^>]*>.*?</a>\s*', re.DOTALL)

# Target for insertion: Between Facilities and Gallery
# We search for the closing </li> of Facilities and insert after it
INSERT_MARKER = '<li><a href="facilities.html">Facilities</a></li>'

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Remove existing logo from header (if present)
    # We restrict search to the header area to avoid removing the one we just added if we run twice (though regex is specific)
    # But since we are moving it into a <li>, the regex <a class="logo"> won't match the new <li> structure exactly if we include the <li> wrapper.
    # However, to be safe, we should target the specific context in header-container.
    
    # Let's find the header container
    header_match = re.search(r'(<div class="header-container">)(.*?)(<nav)', content, re.DOTALL)
    if header_match:
        header_start = header_match.group(1)
        header_inner = header_match.group(2)
        header_end = header_match.group(3)
        
        # Remove logo from header_inner
        new_header_inner = LOGO_REMOVE_PATTERN.sub('\n            ', header_inner)
        
        # Reconstruct the part
        new_header_part = header_start + new_header_inner + header_end
        content = content.replace(header_match.group(0), new_header_part)
        
    # 2. Insert logo into Nav List
    if 'class="logo-item"' not in content:
        if INSERT_MARKER in content:
            # Insert after the marker
            content = content.replace(INSERT_MARKER, INSERT_MARKER + LOGO_HTML)
            print(f"Updated {os.path.basename(file_path)}")
        else:
            print(f"Skipping {os.path.basename(file_path)}: Insert marker not found")
    else:
        print(f"Skipping {os.path.basename(file_path)}: Logo item already present")

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

def main():
    files = [f for f in os.listdir(BASE_DIR) if f.endswith('.html')]
    for filename in files:
        update_file(os.path.join(BASE_DIR, filename))

if __name__ == '__main__':
    main()
