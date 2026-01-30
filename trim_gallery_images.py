import os
import re
from PIL import Image, ImageChops

def trim_image(img):
    bg = Image.new(img.mode, img.size, img.getpixel((0,0)))
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

import sys

def process_image(img_path):
    full_path = os.path.join(os.getcwd(), img_path)
    if os.path.exists(full_path):
        try:
            img = Image.open(full_path)
            
            # Use the top-left pixel as the background color reference
            bg_color = img.getpixel((0, 0))
            bg = Image.new(img.mode, img.size, bg_color)
            diff = ImageChops.difference(img, bg)
            diff = ImageChops.add(diff, diff, 2.0, -100)
            bbox = diff.getbbox()
            
            if bbox:
                trimmed_img = img.crop(bbox)
                if trimmed_img.size != img.size:
                    trimmed_img.save(full_path)
                    print(f"Trimmed: {img_path} (Old: {img.size} -> New: {trimmed_img.size})")
                    return True
            else:
                print(f"No content found in {img_path} (image might be solid color)")
                
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
    else:
        print(f"File not found: {img_path}")
    return False

def main():
    if len(sys.argv) > 1:
        # Process files passed as arguments
        images = sys.argv[1:]
        print(f"Processing {len(images)} images provided via arguments...")
    else:
        # Default behavior: scan gallery.html
        gallery_file = 'gallery.html'
        if not os.path.exists(gallery_file):
            print(f"Error: {gallery_file} not found.")
            return

        with open(gallery_file, 'r') as f:
            content = f.read()

        # Find all images in imgs/ folder referenced in the file
        images = set(re.findall(r'imgs/[a-f0-9]+\.webp', content))
        print(f"Found {len(images)} unique images referenced in {gallery_file}")

    count = 0
    for img_path in images:
        if process_image(img_path):
            count += 1

    print(f"Finished. Trimmed {count} images.")

if __name__ == "__main__":
    main()
