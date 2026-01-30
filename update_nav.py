import os

target_dir = "/Users/chetan/Documents/propage/webstersschool.com"

old_nav = """        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="academics-pre-nursery-nursery.html">Pre-Nursery to UKG</a></li>
          <li><a href="academics-primary-middle-school.html">Primary &amp; Middle School</a></li>
          <li><a href="academics-high-school.html">High School</a></li>
          <li><a href="facilities.html">Facilities</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="admissions.html">Admissions</a></li>
          <li><a href="50th-anniversary-celebration-future.html">50 Years Celebration</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul>"""

new_nav = """        <ul>
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
        </ul>"""

count = 0
for filename in os.listdir(target_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(target_dir, filename)
        with open(filepath, "r") as f:
            content = f.read()
        
        if old_nav in content:
            new_content = content.replace(old_nav, new_nav)
            with open(filepath, "w") as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1
        else:
            print(f"Skipped {filename} (nav not found)")

print(f"Total updated: {count}")
