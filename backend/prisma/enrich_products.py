import sqlite3
import re

conn = sqlite3.connect('backend/prisma/dev.db')
c = conn.cursor()

c.execute('SELECT p.id, p.name, c.name, p.brand, p.weight FROM Product p JOIN Category c ON p.categoryId = c.id')
products = c.fetchall()

def has_word(pattern, text):
    return bool(re.search(r'\b' + re.escape(pattern) + r'\b', text, re.IGNORECASE))

def has_any(patterns, text):
    return any(has_word(p, text) for p in patterns)

def generate_details(name, category, brand, weight):
    n = name.lower()
    cat = category.lower()
    
    # 1. Check Rice & Grains first (avoid matta / atta collisions)
    if has_any(['matta', 'basmati', 'ponni', 'jasmine', 'sona masoori', 'boiled rice', 'raw rice'], n) or (has_word('rice', n) and not has_any(['rice powder', 'rice flour', 'poha', 'flattened rice'], n)):
        desc = "Naturally aged, aromatic long-grain rice celebrated for its delicate fragrance, fluffy texture, and slender non-sticky grains. The centerpiece of any comforting Asian feast."
        ingredients = "100% Premium Grain Rice."
        origin = "India" if has_any(['matta', 'basmati', 'ponni', 'sona'], n) else "Thailand"
        dietary = "Vegetarian, Vegan, Gluten-Free"

    # 2. Rice Powders & South Indian Breakfast flours
    elif has_any(['rice powder', 'rice flour', 'puttu', 'idiyappam', 'appam', 'pathiri'], n):
        desc = "Specially milled fine rice flour designed for traditional South Indian breakfast delicacies such as soft puttu, delicate idiyappam (string hoppers), and pathiri."
        ingredients = "100% Selected White Rice Grains."
        origin = "India"
        dietary = "Vegetarian, Vegan, Gluten-Free"

    # 3. Atta & Wheat flour (strict word boundary on \batta\b)
    elif has_word('atta', n) or has_any(['wheat powder', 'wheat flour', 'chakki atta', 'maida'], n):
        desc = "Traditional stone-ground 100% whole wheat flour, milled to preserve the natural fiber and germ. Ideal for soft, fluffy chapatis, rotis, parathas, and puris."
        ingredients = "100% Whole Wheat Grain."
        origin = "India"
        dietary = "Vegetarian, Vegan, High Fiber"

    # 4. Gram Flour / Besan
    elif has_any(['gram flour', 'besan', 'chickpea flour'], n):
        desc = "Authentic premium stone-ground Bengal gram flour (Besan), crafted from 100% pure chickpeas. Essential for making crispy pakoras, savoury dhokla, Kadhi, and traditional Indian sweets like ladoo."
        ingredients = "100% Pure Bengal Gram (Chana Dal / Chickpea Flour)."
        origin = "India"
        dietary = "Vegetarian, Vegan, Gluten-Free"

    # 5. Rava / Semolina
    elif has_any(['rava', 'sooji', 'suji', 'semolina'], n):
        desc = "Premium roasted granulated wheat semolina (Rava/Sooji), perfect for making savory upma, crispy rava dosas, and luscious rava kesari halwa."
        ingredients = "100% Coarse Durum Wheat Semolina."
        origin = "India"
        dietary = "Vegetarian, Vegan"

    # 6. Pastes (Ginger Garlic)
    elif has_any(['ginger garlic', 'garlic paste', 'ginger paste'], n):
        desc = "Aromatic ready-to-cook cooking paste made from freshly crushed garlic and ginger root. Saves prep time while giving rich flavor and depth to curries, gravies, and marinades."
        ingredients = "Fresh Ginger (45%), Fresh Garlic (45%), Water, Salt, Edible Vegetable Oil, Acidity Regulator (Citric Acid)."
        origin = "India"
        dietary = "Vegetarian, Vegan, Gluten-Free"

    # 7. Pickles & Chutneys
    elif has_any(['pickle', 'achar', 'chutney', 'thokku'], n):
        desc = "Traditional slow-cured spicy and tangy Asian pickle, preserved in pure mustard and sesame oils with aromatic whole spices. Perfect accompaniment for rice, dal, and parathas."
        ingredients = "Vegetables/Fruits, Mustard Oil, Salt, Fenugreek, Mustard Seeds, Red Chilli Powder, Turmeric, Asafoetida."
        origin = "India"
        dietary = "Vegetarian, Vegan"

    # 8. Noodles & Ramen
    elif has_any(['noodle', 'noodles', 'ramen', 'vermicelli', 'soba', 'udon', 'pad thai'], n):
        desc = "Chewy, restaurant-quality Asian noodles, perfect for fiery stir-fries, comforting noodle soups, and spicy ramen bowls. Ready in just 3-5 minutes."
        ingredients = "Wheat Flour, Water, Modified Starch, Salt, Acidity Regulators."
        origin = "Korea / Japan" if has_any(['buldak', 'shin', 'samyang', 'soba', 'udon'], n) else "Asia"
        dietary = "Vegetarian, Halal"

    # 9. Dal, Lentils & Beans
    elif has_any(['dal', 'dhal', 'lentil', 'lentils', 'toor', 'moong', 'urad', 'chana', 'beans', 'peas', 'masoor'], n):
        desc = "High-protein, fiber-rich pulses sourced directly from certified farms. Cooks to a creamy, savory consistency perfect for Indian tadka dal, comforting sambars, and curries."
        ingredients = "100% Pure Dried Pulses / Lentils."
        origin = "India"
        dietary = "Vegetarian, Vegan, High Protein, Gluten-Free"

    # 10. Spices & Masalas
    elif has_any(['chilli', 'turmeric', 'coriander', 'cumin', 'masala', 'pepper', 'cardamom', 'clove', 'cinnamon', 'curry powder', 'spice'], n):
        desc = "Sun-dried and slowly ground whole spices bursting with natural essential oils, vibrant color, and intense aroma. Ethically harvested for pure authentic Asian flavor."
        ingredients = "100% Pure Natural Spices."
        origin = "India"
        dietary = "Vegetarian, Vegan, Gluten-Free"

    # 11. Snacks, Biscuits & Sweets
    elif has_any(['snack', 'chips', 'murukku', 'mixture', 'biscuit', 'biscotti', 'rusk', 'sweet', 'ladoo', 'haldiram', 'sev', 'bhujia', 'khatta meetha'], n):
        desc = "Crispy, crunchy authentic Asian snack prepared using time-honored recipes and pure vegetable oil. Perfect paired with hot chai or filter coffee."
        ingredients = "Gram Flour, Edible Vegetable Oil, Lentil Flour, Spices, Salt."
        origin = "India"
        dietary = "Vegetarian"

    # 12. Oils & Ghee
    elif has_any(['oil', 'ghee', 'butter'], n):
        desc = "Slow-simmered aromatic cooking fat with a rich golden grain and nutty aroma. Imparts an authentic home-style fragrance to biryanis, rotis, and sweets."
        ingredients = "100% Pure Milk Fat / Seed Oil."
        origin = "Ireland / India"
        dietary = "Vegetarian"

    # 13. Fresh Vegetables & Produce
    elif has_any(['coconut', 'thoran', 'vegetable', 'vegetables', 'yam', 'tapioca', 'drumstick', 'okra', 'karela', 'gourd', 'plantain'], n) or 'fresh' in cat:
        desc = "Carefully harvested and chilled fresh vegetables and produce, packed under temperature-controlled logistics to guarantee maximum freshness and authentic texture."
        ingredients = "100% Fresh Farm Produce."
        origin = "Asia / Ireland"
        dietary = "Vegetarian, Vegan, Fresh Produce"

    else:
        desc = "Authentic Asian grocery essential, carefully selected for Irish kitchens. Direct import by Asianmix Cork ensuring fresh quality and competitive value."
        ingredients = "Natural ingredients as per packaging specification."
        origin = "Asia / Ireland"
        dietary = "Vegetarian"

    return desc, ingredients, origin, dietary

for i, (pid, name, cat_name, brand, weight) in enumerate(products):
    desc, ing, origin, dietary = generate_details(name, cat_name, brand or '', weight or '')
    
    # Healthy realistic stock distribution
    if i % 25 == 0:
        stock = 0 # Out of stock
    elif i % 10 in (3, 7):
        stock = (i % 3) + 2 # Low stock: 2, 3, or 4
    else:
        stock = 15 + (i % 65) # Normal healthy stock

    c.execute('''
        UPDATE Product 
        SET description = ?, 
            ingredients = ?, 
            originCountry = ?, 
            dietaryTags = ?,
            stock = ?
        WHERE id = ?
    ''', (desc, ing, origin, dietary, stock, pid))

conn.commit()
conn.close()
print("Enrichment complete and verified with strict word boundaries!")
