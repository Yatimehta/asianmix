import sqlite3
import json
import uuid
from datetime import datetime, timedelta

conn = sqlite3.connect('/Users/yatimehta/asianmix/backend/prisma/dev.db')
cursor = conn.cursor()

# Get 2 real products
cursor.execute('SELECT id, name, price, images FROM Product LIMIT 3')
prods = cursor.fetchall()

if len(prods) >= 2:
    p1 = prods[0]
    p2 = prods[1]
    
    p1_images = json.loads(p1[3]) if p1[3].startswith('[') else [p1[3]]
    p2_images = json.loads(p2[3]) if p2[3].startswith('[') else [p2[3]]
    
    order1_id = str(uuid.uuid4())
    order1_num = "AM-2026-84920"
    address1 = {
        "fullName": "Sean O'Connor",
        "addressLine1": "42 Grand Parade",
        "addressLine2": "Apt 4B",
        "city": "Cork",
        "county": "Co. Cork",
        "eircode": "T12 A3CD",
        "phone": "+353 87 123 4567"
    }
    
    item1_1 = str(uuid.uuid4())
    item1_2 = str(uuid.uuid4())
    
    subtotal1 = round(p1[2] * 2 + p2[2] * 1, 2)
    shipping1 = 0.0 if subtotal1 >= 35 else 3.99
    total1 = round(subtotal1 + shipping1, 2)
    
    cursor.execute('''
        INSERT OR REPLACE INTO "Order" (
            id, orderNumber, guestEmail, guestName, guestPhone, status,
            subtotal, shippingFee, discount, totalAmount, shippingAddress,
            deliveryMethod, paymentStatus, paymentMethod, trackingNumber,
            createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        order1_id, order1_num, "sean.oconnor@example.ie", "Sean O'Connor", "+353 87 123 4567",
        "SHIPPED", subtotal1, shipping1, 0.0, total1, json.dumps(address1),
        "EXPRESS_CORK", "PAID", "STRIPE", "ANPOST-92847291IE",
        int((datetime.now() - timedelta(days=1)).timestamp() * 1000),
        int(datetime.now().timestamp() * 1000)
    ))
    
    cursor.execute('''
        INSERT OR REPLACE INTO "OrderItem" (
            id, orderId, productId, productName, productImage, price, quantity, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        item1_1, order1_id, p1[0], p1[1], p1_images[0] if p1_images else '', p1[2], 2, round(p1[2]*2, 2)
    ))
    
    cursor.execute('''
        INSERT OR REPLACE INTO "OrderItem" (
            id, orderId, productId, productName, productImage, price, quantity, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        item1_2, order1_id, p2[0], p2[1], p2_images[0] if p2_images else '', p2[2], 1, round(p2[2]*1, 2)
    ))
    
    conn.commit()
    print(f"Sample order created: {order1_num}")

conn.close()
