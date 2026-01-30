import os
import re

target_dir = "/Users/chetan/Documents/propage/webstersschool.com"

new_nav_inner = """
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li class="dropdown">
            <a href="#" aria-haspopup="true" aria-expanded="false">Academics</a>
            <ul class="dropdown-menu">
              <li><a href="academics-pre-nursery-nursery.html">Pre-Nursery to UKG</a></li>
              <li><a href="academics-primary-middle-school.html">Primary &amp; Middle School</a></li>
              <li><a href="academics-high-school.html">High School</a></li>
            </ul>
          </li>
          <li><a href="facilities.html">Facilities</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="admissions.html">Admissions</a></li>
          <li><a href="50th-anniversary-celebration-future.html">50 Years Celebration</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul>
"""

# Regex to find the nav block content
# We look for <nav id="main-navigation"[^>]*> ... </nav>
# and replace the content inside.

nav_regex = re.compile(r'(<nav id="main-navigation"[^>]*>)(.*?)(</nav>)', re.DOTALL)

count = 0
for filename in os.listdir(target_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(target_dir, filename)
        with open(filepath, "r") as f:
            content = f.read()
        
        # Check if already updated (contains "dropdown-menu")
        if "dropdown-menu" in content:
            print(f"Skipping {filename} (already updated)")
            continue

        if nav_regex.search(content):
            # We want to preserve the <nav> tag attributes and the closing tag
            # But we want to replace the inner content with our new structure.
            # However, indentation might be messy if we just insert it.
            # Let's try to detect the indentation of the <nav> tag to align nicely, 
            # or just insert it and let the user format it later (or just leave it slightly off).
            # HTML doesn't care about whitespace.
            
            def replace_func(match):
                return match.group(1) + new_nav_inner + "      " + match.group(3)
            
            new_content = nav_regex.sub(replace_func, content)
            
            with open(filepath, "w") as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1
        else:
            print(f"Skipped {filename} (nav block not found)")

print(f"Total updated in this run: {count}")
