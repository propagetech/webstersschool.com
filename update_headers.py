import glob
import re
import os

NEW_HEADER = """    <header>
      <div class="header-container">
        <a
          href="index.html"
          class="mobile-logo"
          aria-label="Websters School home"
        >
          <img
            src="imgs/745072416122103a657bc7a0d8fa0646.webp"
            alt="Websters School"
            width="116"
            height="48"
          />
        </a>
        <div class="logo-item">
          <a href="index.html" class="logo" aria-label="Websters School home">
            <img
              src="imgs/745072416122103a657bc7a0d8fa0646.webp"
              alt="Websters School"
              width="116"
              height="48"
            />
          </a>
        </div>
        <nav id="main-navigation" aria-label="Main navigation">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li class="dropdown">
              <a href="#" aria-haspopup="true" aria-expanded="false"
                >Academics</a
              >
              <ul class="dropdown-menu">
                <li>
                  <a href="academics-pre-nursery-nursery.html"
                    >Pre-Nursery to UKG</a
                  >
                </li>
                <li>
                  <a href="academics-primary-middle-school.html"
                    >Primary &amp; Middle School</a
                  >
                </li>
                <li><a href="academics-high-school.html">High School</a></li>
              </ul>
            </li>
            <li><a href="facilities.html">Facilities</a></li>

            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="admissions.html">Admissions</a></li>
            <li>
              <a href="50th-anniversary-celebration-future.html"
                >50 Years Celebration</a
              >
            </li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </nav>
        <div class="header-controls">
          <button
            class="theme-toggle"
            type="button"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <svg
              class="theme-icon-light"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              class="theme-icon-dark"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
          <button
            class="menu-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="main-navigation"
          >
            <span aria-hidden="true">&#9776;</span>
          </button>
        </div>
      </div>
    </header>"""

base_dir = '/Users/chetan/Documents/propage/webstersschool.com'
html_files = glob.glob(os.path.join(base_dir, '*.html'))

for file_path in html_files:
    if file_path.endswith('index.html'):
        continue
        
    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if header exists
    if '<header>' in content:
        # Replace the header
        new_content = re.sub(r'<header>.*?</header>', NEW_HEADER, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
        else:
            print(f"No changes needed for {file_path} (header might be identical)")
    else:
        print(f"Warning: No <header> tag found in {file_path}")
