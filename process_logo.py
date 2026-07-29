from PIL import Image

def process_logo(input_path, output_black_path, output_white_path):
    # Open the image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newDataBlack = []
    newDataWhite = []
    
    threshold = 210 # slightly higher threshold to catch near-whites
    
    min_x = img.width
    min_y = img.height
    max_x = 0
    max_y = 0
    
    x = 0
    y = 0
    for item in datas:
        brightness = (item[0] + item[1] + item[2]) / 3
        if brightness > threshold:
            newDataBlack.append((255, 255, 255, 0))
            newDataWhite.append((255, 255, 255, 0))
        else:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y
            
            # Make the actual logo parts smooth. We can do a simple alpha blending based on brightness
            # For anti-aliasing effect, let's map brightness [0, threshold] -> alpha [255, 0]
            # Darker = more opaque
            alpha = int(255 * (1 - (brightness / threshold)))
            
            newDataBlack.append((20, 25, 20, alpha)) # Use a very dark green/black
            newDataWhite.append((255, 255, 255, alpha))
            
        x += 1
        if x == img.width:
            x = 0
            y += 1
            
    img_black = Image.new("RGBA", img.size)
    img_black.putdata(newDataBlack)
    
    img_white = Image.new("RGBA", img.size)
    img_white.putdata(newDataWhite)
    
    padding = 10
    min_x = max(0, min_x - padding)
    min_y = max(0, min_y - padding)
    max_x = min(img.width, max_x + padding)
    max_y = min(img.height, max_y + padding)
    
    img_black_cropped = img_black.crop((min_x, min_y, max_x, max_y))
    img_white_cropped = img_white.crop((min_x, min_y, max_x, max_y))
    
    img_black_cropped.save(output_black_path, "PNG")
    img_white_cropped.save(output_white_path, "PNG")
    print(f"Successfully created {output_black_path} and {output_white_path}")

input_path = "d:/Pengmas/web-pemasaran-melon-honey/gambar/logo_poktan.jpeg"
output_black = "d:/Pengmas/web-pemasaran-melon-honey/public/images/logo-utama.png"
output_white = "d:/Pengmas/web-pemasaran-melon-honey/public/images/logo-putih.png"

try:
    process_logo(input_path, output_black, output_white)
except Exception as e:
    print(f"Error: {e}")
