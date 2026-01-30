
import os

files = [
    "index.html",
    "about.html",
    "academics-pre-nursery-nursery.html",
    "academics-primary-middle-school.html",
    "facilities.html",
    "gallery.html",
    "admissions.html",
    "50th-anniversary-celebration-future.html",
    "contact.html"
]

search_str = """              <a href="#" aria-haspopup="true" aria-expanded="false"
                >Academics</a
              >"""

replace_str = """              <a href="#" aria-haspopup="true" aria-expanded="false"
                >Academics
                <svg
                  class="dropdown-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9"></polyline></svg
              ></a>"""

for file_name in files:
    if os.path.exists(file_name):
        with open(file_name, 'r') as f:
            content = f.read()
        
        if search_str in content:
            new_content = content.replace(search_str, replace_str)
            with open(file_name, 'w') as f:
                f.write(new_content)
            print(f"Updated {file_name}")
        else:
            print(f"Pattern not found in {file_name}")
            # Try a slightly different pattern if the indentation is different
            # Normalize spaces for check? No, let's keep it simple for now and report failures.
    else:
        print(f"File not found: {file_name}")
