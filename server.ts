import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@viviqueens.com';
const INITIAL_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || randomBytes(24).toString('base64url');
const INITIAL_ADMIN_PASSWORD_HASH = bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, bcrypt.genSaltSync(10));

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Admin sessions will reset when the server restarts.');
}

app.use(express.json());
app.use(cookieParser());

// Database persistence directory
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial luxury seed data
const getInitialData = () => {
  return {
    admins: [
      {
        id: 'admin_1',
        name: 'Vivi Queens Creative Director',
        email: ADMIN_EMAIL,
        passwordHash: INITIAL_ADMIN_PASSWORD_HASH,
        role: 'super_admin',
        createdAt: new Date().toISOString()
      }
    ],
    settings: {
      brandName: 'VIVI QUEENS',
      tagline: 'Made to fit you.',
      subTagline: 'Custom clothes, sewn with care.',
      location: 'Biogbolo, Yenagoa, Bayelsa State, Nigeria',
      phone: '+234 814 892 0145',
      whatsappNumber: '2348148920145',
      whatsappMessage: 'Hello VIVI Queens, I would like to ask about an outfit.',
      email: 'atelier@viviqueens.com',
      instagramHandle: '@viviqueens',
      facebookHandle: '@viviqueenscouture',
      tiktokHandle: '@viviqueens',
      openingHours: 'Monday to Saturday, 9:00 AM to 6:00 PM. Sundays by appointment.',
      aboutPhilosophy: 'We make clothes that fit well and suit your style.',
      aboutPromise: 'We make quality clothes with care and skill.',
      updatedAt: new Date().toISOString()
    },
    products: [
      {
        id: 'prod_1',
        name: 'Emerald Corset Gown',
        slug: 'sovereign-emerald-corset-gown',
        category: 'Occasion Wear',
        collection: 'The Bespoke Edit',
        description: 'Emerald silk gown with a fitted corset, one-shoulder design, and gold embroidery.',
        price: 185000,
        currency: 'NGN',
        images: [
          '/src/assets/images/hero_nigerian_fashion_1791459700947.jpg',
          '/src/assets/images/bespoke_gown_showcase_1791459725159.jpg'
        ],
        sizes: ['Custom Bespoke', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16'],
        colors: ['Emerald Green', 'Champagne Gold', 'Royal Burgundy'],
        fabric: 'Silk crepe, French lace, and gold thread',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-09-15T10:00:00.000Z'
      },
      {
        id: 'prod_2',
        name: 'Royal Niger Brocade Outfit',
        slug: 'bespoke-royal-niger-brocade-silhouette',
        category: 'Traditional & Contemporary',
        collection: 'Heritage Couture',
        description: 'Nigerian brocade outfit with a peplum and beaded neckline.',
        price: 165000,
        currency: 'NGN',
        images: [
          '/src/assets/images/traditional_contemporary_attire_1791459737601.jpg',
          '/src/assets/images/tailoring_craft_details_1791459750476.jpg'
        ],
        sizes: ['Custom Bespoke', 'UK 10', 'UK 12', 'UK 14', 'UK 18'],
        colors: ['Deep Burgundy & Gold', 'Sapphire Navy & Bronze'],
        fabric: 'Jacquard brocade and silk organza',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-09-18T11:00:00.000Z'
      },
      {
        id: 'prod_3',
        name: 'Yenagoa Crepe Suit',
        slug: 'yenagoa-executive-crepe-ensemble',
        category: 'Corporate Wear',
        collection: 'Executive Atelier',
        description: 'Two-piece crepe suit with a double-breasted jacket and straight-leg trousers.',
        price: 120000,
        currency: 'NGN',
        images: [
          '/src/assets/images/bespoke_gown_showcase_1791459725159.jpg',
          '/src/assets/images/studio_atelier_interior_1791459713381.jpg'
        ],
        sizes: ['Custom Bespoke', 'UK 8', 'UK 10', 'UK 12', 'UK 14'],
        colors: ['Deep Espresso', 'Charcoal Black', 'Soft Ivory'],
        fabric: 'Wool-blend crepe',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-09-20T14:30:00.000Z'
      },
      {
        id: 'prod_4',
        name: 'Beaded Mermaid Gown',
        slug: 'biogbolo-heritage-beaded-mermaid',
        category: 'Occasion Wear',
        collection: 'The Bespoke Edit',
        description: 'Fitted mermaid gown with glass beads for weddings and special events.',
        price: 240000,
        currency: 'NGN',
        images: [
          '/src/assets/images/bespoke_gown_showcase_1791459725159.jpg',
          '/src/assets/images/hero_nigerian_fashion_1791459700947.jpg'
        ],
        sizes: ['Custom Bespoke Only'],
        colors: ['Champagne Blush', 'Onyx Black', 'Ivory'],
        fabric: 'Mikado silk with crystal details',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-09-22T09:15:00.000Z'
      },
      {
        id: 'prod_5',
        name: 'Silk Kaftan with Brass Collar',
        slug: 'fluid-artisanal-kaftan-brass-collar',
        category: 'Ready-to-Wear',
        collection: 'Modern Minimalism',
        description: 'Loose silk kaftan with a simple brass collar.',
        price: 95000,
        currency: 'NGN',
        images: [
          '/src/assets/images/traditional_contemporary_attire_1791459737601.jpg',
          '/src/assets/images/studio_atelier_interior_1791459713381.jpg'
        ],
        sizes: ['One Size (Free Flowing)', 'Custom Length'],
        colors: ['Muted Champagne', 'Olive Bronze', 'Warm Beige'],
        fabric: 'Mulberry silk with a brass detail',
        isBespokeAvailable: true,
        isFeatured: false,
        status: 'published',
        createdAt: '2026-09-25T16:00:00.000Z'
      },
      {
        id: 'prod_6',
        name: 'Cape Gown',
        slug: 'sovereign-cape-column-gown',
        category: 'New Arrivals',
        collection: 'The Bespoke Edit',
        description: 'Straight-cut gown with a cape shoulder for special events.',
        price: 175000,
        currency: 'NGN',
        images: [
          '/src/assets/images/hero_nigerian_fashion_1791459700947.jpg',
          '/src/assets/images/tailoring_craft_details_1791459750476.jpg'
        ],
        sizes: ['Custom Bespoke', 'UK 8', 'UK 10', 'UK 12', 'UK 14'],
        colors: ['Warm Ivory', 'Midnight Emerald', 'Imperial Wine'],
        fabric: 'Double-faced Crepe & Pure Silk Chiffon Cape',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-09-28T12:00:00.000Z'
      },
      {
        id: 'prod_7',
        name: 'Ijaw George Wrapper and Peplum',
        slug: 'bayelsa-ijaw-heritage-george-wrapper-peplum',
        category: 'Traditional & Contemporary',
        collection: 'Heritage Couture',
        description: 'Blue and gold Ijaw George wrapper with a peplum top and coral beads.',
        price: 195000,
        currency: 'NGN',
        images: [
          '/src/assets/images/nigerian_native_ijaw_george_1791460885980.jpg',
          '/src/assets/images/traditional_contemporary_attire_1791459737601.jpg'
        ],
        sizes: ['Custom Bespoke', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
        colors: ['Royal Sapphire Blue & Gold', 'Deep Wine & Champagne', 'Emerald & Bronze'],
        fabric: 'George fabric and beaded silk',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-10-01T10:00:00.000Z'
      },
      {
        id: 'prod_8',
        name: 'Aso-Oke Corset Gown',
        slug: 'sovereign-asooke-sculpted-corset-gown',
        category: 'Traditional & Contemporary',
        collection: 'Heritage Couture',
        description: 'Aso-Oke gown with a fitted corset and pleated shoulders.',
        price: 210000,
        currency: 'NGN',
        images: [
          '/src/assets/images/nigerian_native_asooke_corset_1791460902042.jpg'
        ],
        sizes: ['Custom Bespoke', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16'],
        colors: ['Champagne Gold & Deep Wine', 'Onyx Black & Metallic Bronze'],
        fabric: 'Woven Aso-Oke with silk lining',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-10-03T11:30:00.000Z'
      },
      {
        id: 'prod_9',
        name: 'Silk and Velvet Boubou',
        slug: 'imperial-silk-velvet-royal-boubou',
        category: 'Traditional & Contemporary',
        collection: 'Heritage Couture',
        description: 'Velvet boubou with a gold embroidered neckline.',
        price: 135000,
        currency: 'NGN',
        images: [
          '/src/assets/images/nigerian_native_boubou_kaftan_1791460913058.jpg'
        ],
        sizes: ['Free Flowing (One Size Luxury)', 'Custom Length Tailored'],
        colors: ['Espresso Velvet & Gold', 'Royal Navy & Champagne'],
        fabric: 'Silk velvet with gold embroidery',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-10-04T15:00:00.000Z'
      },
      {
        id: 'prod_10',
        name: 'Coral Bridal Gown',
        slug: 'niger-delta-coral-ceremonial-bridal-mermaid',
        category: 'Traditional & Contemporary',
        collection: 'Heritage Couture',
        description: 'Red wedding gown with coral beads and a long train.',
        price: 275000,
        currency: 'NGN',
        images: [
          '/src/assets/images/nigerian_native_coral_bridal_1791460924140.jpg'
        ],
        sizes: ['Custom Bespoke Commission Only'],
        colors: ['Imperial Scarlet Red & Gold', 'Royal Coral Pink & Champagne'],
        fabric: 'Mikado silk, French lace, and coral beads',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-10-05T12:00:00.000Z'
      },
      {
        id: 'prod_11',
        name: 'Custom Ijaw George Set',
        slug: 'custom-ijaw-george-set',
        category: 'Traditional & Contemporary',
        collection: 'Heritage Couture',
        description: 'Blue and gold Ijaw George wrapper and top, made to your measurements.',
        price: 195000,
        currency: 'NGN',
        images: ['/src/assets/images/nigerian_native_ijaw_george_1791460885980.jpg'],
        sizes: ['Custom fit', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
        colors: ['Blue and gold', 'Wine and gold'],
        fabric: 'Ijaw George fabric with coral beads',
        isBespokeAvailable: true,
        isFeatured: true,
        status: 'published',
        createdAt: '2026-10-08T00:00:00.000Z'
      }
    ],
    collections: [
      {
        id: 'col_1',
        title: 'The Bespoke Edit',
        subtitle: 'Custom clothes made to fit you',
        description: 'Outfits made to match your style and measurements.',
        image: '/src/assets/images/hero_nigerian_fashion_1791459700947.jpg',
        itemCount: 14,
        category: 'Bespoke'
      },
      {
        id: 'col_2',
        title: 'Heritage Couture',
        subtitle: 'Nigerian styles for today',
        description: 'George, lace, and brocade outfits for weddings and events.',
        image: '/src/assets/images/traditional_contemporary_attire_1791459737601.jpg',
        itemCount: 9,
        category: 'Traditional'
      },
      {
        id: 'col_3',
        title: 'Occasion & Evening',
        subtitle: 'Clothes for special events',
        description: 'Dresses for weddings, parties, and other events.',
        image: '/src/assets/images/bespoke_gown_showcase_1791459725159.jpg',
        itemCount: 12,
        category: 'Occasion Wear'
      },
      {
        id: 'col_4',
        title: 'Executive Atelier',
        subtitle: 'Smart work clothes',
        description: 'Suits, waistcoats, and dresses made for work.',
        image: '/src/assets/images/studio_atelier_interior_1791459713381.jpg',
        itemCount: 8,
        category: 'Corporate'
      }
    ],
    services: [
      {
        id: 'srv_1',
        title: 'Bespoke Tailoring',
        slug: 'bespoke-tailoring',
        shortDescription: 'We make clothes to fit your measurements and style.',
        detailedDescription: 'We plan your design, take your measurements, and sew your outfit. Fittings help us get the right fit.',
        duration: '10 to 14 days. Ask about urgent orders.',
        pricingNote: 'From ₦80,000 + fabric',
        steps: ['Choose a design', 'Take measurements', 'Try on a fitting sample', 'Sew and finish the outfit']
      },
      {
        id: 'srv_2',
        title: 'Occasion Wear',
        slug: 'occasion-wear',
        shortDescription: 'Outfits for weddings, birthdays, and special events.',
        detailedDescription: 'Tell us about your event. We will help you choose an outfit, fabric, and fit.',
        duration: '7–12 days',
        pricingNote: 'From ₦75,000',
        steps: ['Tell us about your event', 'Choose a style', 'Choose fabric and colors', 'We sew your outfit']
      },
      {
        id: 'srv_3',
        title: 'Traditional & Contemporary',
        slug: 'traditional-contemporary',
        shortDescription: 'Nigerian native clothes with a modern look.',
        detailedDescription: 'Choose George, Aso-Oke, or another Nigerian style. We make it to fit you.',
        duration: '10–14 days',
        pricingNote: 'From ₦90,000',
        steps: ['Choose a style', 'Choose fabric', 'Take measurements', 'Fit and finish the outfit']
      },
      {
        id: 'srv_4',
        title: 'Corporate Wear',
        slug: 'corporate-wear',
        shortDescription: 'Work clothes made to fit you.',
        detailedDescription: 'We make suits, skirts, and dresses for work.',
        duration: '5–8 days',
        pricingNote: 'From ₦60,000',
        steps: ['Choose a style', 'Choose fabric', 'Take measurements', 'Finish your outfit']
      },
      {
        id: 'srv_5',
        title: 'Alterations & Restyling',
        slug: 'alterations',
        shortDescription: 'We adjust clothes to fit better.',
        detailedDescription: 'We can shorten, resize, or repair many clothes.',
        duration: '2–4 days',
        pricingNote: 'From ₦15,000',
        steps: ['Check the fit', 'Mark the changes', 'Make the changes', 'Press the clothes']
      },
      {
        id: 'srv_6',
        title: 'Style Advice',
        slug: 'personal-styling',
        shortDescription: 'Get help choosing fabric, colors, and outfits.',
        detailedDescription: 'Visit our studio to talk about styles and colors that suit you.',
        duration: '60–90 minutes',
        pricingNote: '₦25,000 (Credited towards bespoke orders)',
        steps: ['Tell us what you like', 'Choose colors and styles', 'Look at fabric samples', 'Plan your outfits']
      }
    ],
    gallery: [
      {
        id: 'gal_1',
        title: 'Emerald Gown',
        category: 'Bespoke',
        image: '/src/assets/images/hero_nigerian_fashion_1791459700947.jpg',
        caption: 'Emerald gown with gold stitching.'
      },
      {
        id: 'gal_2',
        title: 'Our Studio',
        category: 'Behind the Scenes',
        image: '/src/assets/images/studio_atelier_interior_1791459713381.jpg',
        caption: 'Inside our fitting room.'
      },
      {
        id: 'gal_3',
        title: 'Champagne Evening Dress',
        category: 'Occasion',
        image: '/src/assets/images/bespoke_gown_showcase_1791459725159.jpg',
        caption: 'An embroidered dress for a celebration.'
      },
      {
        id: 'gal_4',
        title: 'Brocade Outfit',
        category: 'Traditional',
        image: '/src/assets/images/traditional_contemporary_attire_1791459737601.jpg',
        caption: 'A Nigerian outfit made with brocade and silk.'
      },
      {
        id: 'gal_5',
        title: 'At the Cutting Table',
        category: 'Behind the Scenes',
        image: '/src/assets/images/tailoring_craft_details_1791459750476.jpg',
        caption: 'Preparing fabric at our studio.'
      },
      {
        id: 'gal_6',
        title: 'Executive Crepe Tailored Set',
        category: 'Corporate',
        image: '/src/assets/images/studio_atelier_interior_1791459713381.jpg',
        caption: 'A two-piece crepe suit in dark brown.'
      },
      {
        id: 'gal_7',
        title: 'Ijaw George Outfit',
        category: 'Traditional',
        image: '/src/assets/images/nigerian_native_ijaw_george_1791460885980.jpg',
        caption: 'Blue and gold George with a peplum top and coral beads.'
      },
      {
        id: 'gal_8',
        title: 'Aso-Oke Gown',
        category: 'Traditional',
        image: '/src/assets/images/nigerian_native_asooke_corset_1791460902042.jpg',
        caption: 'Champagne and wine Aso-Oke with pleated shoulders.'
      },
      {
        id: 'gal_9',
        title: 'Velvet Boubou',
        category: 'Traditional',
        image: '/src/assets/images/nigerian_native_boubou_kaftan_1791460913058.jpg',
        caption: 'Velvet boubou with a gold embroidered neckline.'
      },
      {
        id: 'gal_10',
        title: 'Coral Bridal Gown',
        category: 'Traditional',
        image: '/src/assets/images/nigerian_native_coral_bridal_1791460924140.jpg',
        caption: 'Red wedding gown with coral beads.'
      },
      {
        id: 'gal_11',
        title: 'Custom Ijaw George Set',
        category: 'Traditional',
        image: '/src/assets/images/nigerian_native_ijaw_george_1791460885980.jpg',
        caption: 'Blue and gold George wrapper and top, made to fit you.'
      }
    ],
    testimonials: [],
    appointments: [],
    orders: [],
    customers: [],
    messages: [],
    journal: [
      {
        id: 'post_1',
        title: 'How We Make Custom Clothes',
        slug: 'architecture-of-nigerian-haute-couture',
        excerpt: 'We use Ijaw and Nigerian fabrics to make clothes for today.',
        content: 'First, we learn what you want. Then we choose fabric, take your measurements, and sew your outfit. Each piece is made to fit you.',
        author: 'VIVI Queens Team',
        category: 'Our Work',
        image: '/src/assets/images/studio_atelier_interior_1791459713381.jpg',
        readTime: '2 min read',
        publishedAt: '2026-09-12'
      },
      {
        id: 'post_2',
        title: 'How to Care for Lace and Brocade',
        slug: 'caring-for-bespoke-brocades-french-laces',
        excerpt: 'Simple ways to keep your special clothes looking good.',
        content: 'Store special clothes in a cool, dry place. Use low heat when pressing. For delicate details, ask a cleaner who knows how to handle fine fabrics.',
        author: 'VIVI Queens Team',
        category: 'Garment Care',
        image: '/src/assets/images/tailoring_craft_details_1791459750476.jpg',
        readTime: '1 min read',
        publishedAt: '2026-09-24'
      }
    ]
  };
};

// Database load and save helpers
const loadDB = () => {
  const initial = getInitialData();
  if (!fs.existsSync(DB_PATH)) {
    if (!process.env.ADMIN_PASSWORD) {
      console.warn(`Initial admin password: ${INITIAL_ADMIN_PASSWORD}`);
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Automatically merge any newly added seed products or gallery items
    let modified = false;
    if (initial.products) {
      initial.products.forEach((initProd: any) => {
        if (!parsed.products.some((p: any) => p.id === initProd.id)) {
          parsed.products.push(initProd);
          modified = true;
        }
      });
    }
    if (initial.gallery) {
      initial.gallery.forEach((initGal: any) => {
        if (!parsed.gallery.some((g: any) => g.id === initGal.id)) {
          parsed.gallery.push(initGal);
          modified = true;
        }
      });
    }
    if (modified) {
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
};

const saveDB = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// Initialize DB on start
let db = loadDB();

// Helper to authenticate JWT token
const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.vivi_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
};

// ==================== API ROUTES ====================

// 1. AUTHENTICATION
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db = loadDB();
  const admin = db.admins.find((a: any) => a.email.toLowerCase() === email.toLowerCase());

  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email credentials or password' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('vivi_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('vivi_token');
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticateAdmin, (req: Request, res: Response) => {
  const currentAdmin = (req as any).admin;
  return res.json({ success: true, admin: currentAdmin });
});

app.post('/api/auth/change-password', authenticateAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Valid current password and new password (min 6 chars) required' });
  }

  db = loadDB();
  const currentAdmin = (req as any).admin;
  const adminIdx = db.admins.findIndex((a: any) => a.id === currentAdmin.id);

  if (adminIdx === -1 || !bcrypt.compareSync(currentPassword, db.admins[adminIdx].passwordHash)) {
    return res.status(400).json({ error: 'Current password does not match' });
  }

  db.admins[adminIdx].passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDB(db);

  return res.json({ success: true, message: 'Password updated successfully' });
});

// 2. SITE SETTINGS
app.get('/api/settings', (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.settings = {
    ...db.settings,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDB(db);
  return res.json({ success: true, settings: db.settings });
});

// 3. PRODUCTS
app.get('/api/products', (req: Request, res: Response) => {
  db = loadDB();
  const { category, collection, search } = req.query;
  let items = [...db.products];

  if (category && category !== 'All') {
    items = items.filter((p: any) => p.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (collection && collection !== 'All') {
    items = items.filter((p: any) => p.collection.toLowerCase() === (collection as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter((p: any) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  return res.json({ success: true, products: items });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  db = loadDB();
  const product = db.products.find((p: any) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json({ success: true, product });
});

app.post('/api/products', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const newProduct = {
    id: `prod_${Date.now()}`,
    slug: (req.body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    createdAt: new Date().toISOString(),
    status: 'published',
    isBespokeAvailable: true,
    ...req.body
  };
  db.products.unshift(newProduct);
  saveDB(db);
  return res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.products.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  db.products[idx] = { ...db.products[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveDB(db);
  return res.json({ success: true, product: db.products[idx] });
});

app.delete('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.products = db.products.filter((p: any) => p.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Product removed' });
});

// 4. COLLECTIONS
app.get('/api/collections', (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, collections: db.collections });
});

app.post('/api/collections', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const newCol = {
    id: `col_${Date.now()}`,
    ...req.body
  };
  db.collections.push(newCol);
  saveDB(db);
  return res.status(201).json({ success: true, collection: newCol });
});

app.put('/api/collections/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.collections.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Collection not found' });

  db.collections[idx] = { ...db.collections[idx], ...req.body };
  saveDB(db);
  return res.json({ success: true, collection: db.collections[idx] });
});

app.delete('/api/collections/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.collections = db.collections.filter((c: any) => c.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Collection deleted' });
});

// 5. SERVICES
app.get('/api/services', (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, services: db.services });
});

app.post('/api/services', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const newService = {
    id: `srv_${Date.now()}`,
    slug: (req.body.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...req.body
  };
  db.services.push(newService);
  saveDB(db);
  return res.status(201).json({ success: true, service: newService });
});

app.put('/api/services/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.services.findIndex((s: any) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });

  db.services[idx] = { ...db.services[idx], ...req.body };
  saveDB(db);
  return res.json({ success: true, service: db.services[idx] });
});

app.delete('/api/services/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.services = db.services.filter((s: any) => s.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Service deleted' });
});

// 6. APPOINTMENTS
app.get('/api/appointments', authenticateAdmin, (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, appointments: db.appointments });
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const { fullName, phone, email, preferredDate, preferredTime, service, outfitType, occasion, notes } = req.body;

  if (!fullName || !phone || !preferredDate || !service) {
    return res.status(400).json({ error: 'Please provide full name, phone number, date, and desired service' });
  }

  db = loadDB();
  const newApt = {
    id: `apt_${Date.now()}`,
    fullName,
    phone,
    email: email || '',
    preferredDate,
    preferredTime: preferredTime || 'Morning (10:00 AM)',
    service,
    outfitType: outfitType || 'Bespoke Outfit',
    occasion: occasion || '',
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.appointments.unshift(newApt);

  // Link or create customer record
  let existingCust = db.customers.find((c: any) => c.phone === phone || (email && c.email === email));
  if (existingCust) {
    existingCust.appointmentsCount = (existingCust.appointmentsCount || 0) + 1;
  } else {
    db.customers.push({
      id: `cust_${Date.now()}`,
      name: fullName,
      email: email || '',
      phone,
      address: 'Biogbolo, Yenagoa',
      measurements: {},
      ordersCount: 0,
      appointmentsCount: 1,
      createdAt: new Date().toISOString()
    });
  }

  saveDB(db);
  return res.status(201).json({
    success: true,
    message: 'Thank you. Your appointment request has been received. VIVI Queens will contact you to confirm your appointment.',
    appointment: newApt
  });
});

app.put('/api/appointments/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.appointments.findIndex((a: any) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });

  db.appointments[idx] = { ...db.appointments[idx], ...req.body };
  saveDB(db);
  return res.json({ success: true, appointment: db.appointments[idx] });
});

app.delete('/api/appointments/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.appointments = db.appointments.filter((a: any) => a.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Appointment deleted' });
});

// 7. ORDERS & BESPOKE REQUESTS
app.get('/api/orders', authenticateAdmin, (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, orders: db.orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, productName, productId, customMeasurements, notes, amount } = req.body;

  if (!customerName || !customerPhone || !productName) {
    return res.status(400).json({ error: 'Name, phone, and outfit details required' });
  }

  db = loadDB();
  const newOrder = {
    id: `ord_${Date.now()}`,
    customerName,
    customerEmail: customerEmail || '',
    customerPhone,
    productName,
    productId: productId || '',
    customMeasurements: customMeasurements || 'To be measured in Biogbolo Studio',
    notes: notes || '',
    amount: amount || 0,
    currency: 'NGN',
    paymentStatus: 'pending_invoice',
    fulfillmentStatus: 'inquiry_received',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Link or create customer
  let existingCust = db.customers.find((c: any) => c.phone === customerPhone);
  if (existingCust) {
    existingCust.ordersCount = (existingCust.ordersCount || 0) + 1;
  } else {
    db.customers.push({
      id: `cust_${Date.now()}`,
      name: customerName,
      email: customerEmail || '',
      phone: customerPhone,
      address: 'Bayelsa State',
      measurements: {},
      ordersCount: 1,
      appointmentsCount: 0,
      createdAt: new Date().toISOString()
    });
  }

  saveDB(db);
  return res.status(201).json({
    success: true,
    message: 'Bespoke design request submitted. Our senior styling team will reach out via WhatsApp/call.',
    order: newOrder
  });
});

app.put('/api/orders/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.orders.findIndex((o: any) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });

  db.orders[idx] = { ...db.orders[idx], ...req.body };
  saveDB(db);
  return res.json({ success: true, order: db.orders[idx] });
});

app.delete('/api/orders/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.orders = db.orders.filter((o: any) => o.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Order removed' });
});

// 8. CUSTOMERS
app.get('/api/customers', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const { search } = req.query;
  let items = [...db.customers];
  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter((c: any) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q));
  }
  return res.json({ success: true, customers: items });
});

app.put('/api/customers/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.customers.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Customer not found' });

  db.customers[idx] = { ...db.customers[idx], ...req.body };
  saveDB(db);
  return res.json({ success: true, customer: db.customers[idx] });
});

// 9. GALLERY & LOOKBOOK
app.get('/api/gallery', (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, gallery: db.gallery });
});

app.post('/api/gallery', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const newItem = {
    id: `gal_${Date.now()}`,
    ...req.body
  };
  db.gallery.unshift(newItem);
  saveDB(db);
  return res.status(201).json({ success: true, item: newItem });
});

app.delete('/api/gallery/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.gallery = db.gallery.filter((g: any) => g.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Gallery item removed' });
});

// 10. TESTIMONIALS
app.get('/api/testimonials', (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, testimonials: db.testimonials });
});

app.post('/api/testimonials', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const newT = {
    id: `test_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'published',
    ...req.body
  };
  db.testimonials.push(newT);
  saveDB(db);
  return res.status(201).json({ success: true, testimonial: newT });
});

app.put('/api/testimonials/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.testimonials.findIndex((t: any) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Testimonial not found' });

  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  saveDB(db);
  return res.json({ success: true, testimonial: db.testimonials[idx] });
});

app.delete('/api/testimonials/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.testimonials = db.testimonials.filter((t: any) => t.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Testimonial removed' });
});

// 11. CONTACT MESSAGES
app.get('/api/messages', authenticateAdmin, (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, messages: db.messages });
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  db = loadDB();
  const newMsg = {
    id: `msg_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.messages.unshift(newMsg);
  saveDB(db);
  return res.status(201).json({ success: true, message: 'Message sent successfully. We will respond promptly.' });
});

app.put('/api/messages/:id/read', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const idx = db.messages.findIndex((m: any) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });

  db.messages[idx].isRead = true;
  saveDB(db);
  return res.json({ success: true, message: db.messages[idx] });
});

app.delete('/api/messages/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.messages = db.messages.filter((m: any) => m.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Message removed' });
});

// 12. JOURNAL / BLOG POSTS
app.get('/api/journal', (_req: Request, res: Response) => {
  db = loadDB();
  return res.json({ success: true, posts: db.journal });
});

app.post('/api/journal', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  const newPost = {
    id: `post_${Date.now()}`,
    slug: (req.body.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    publishedAt: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.journal.unshift(newPost);
  saveDB(db);
  return res.status(201).json({ success: true, post: newPost });
});

app.delete('/api/journal/:id', authenticateAdmin, (req: Request, res: Response) => {
  db = loadDB();
  db.journal = db.journal.filter((j: any) => j.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Post removed' });
});

// 13. ANALYTICS
app.get('/api/analytics', authenticateAdmin, (_req: Request, res: Response) => {
  db = loadDB();
  const totalCustomers = db.customers.length;
  const totalAppointments = db.appointments.length;
  const pendingAppointments = db.appointments.filter((a: any) => a.status === 'pending').length;
  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const totalMessages = db.messages.length;
  const unreadMessages = db.messages.filter((m: any) => !m.isRead).length;

  const totalRevenue = db.orders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);

  return res.json({
    success: true,
    analytics: {
      totalCustomers,
      totalAppointments,
      pendingAppointments,
      totalOrders,
      totalProducts,
      totalMessages,
      unreadMessages,
      totalRevenue,
      recentOrders: db.orders.slice(0, 5),
      recentAppointments: db.appointments.slice(0, 5),
      recentMessages: db.messages.slice(0, 5)
    }
  });
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ VIVI QUEENS Luxury Fashion Atelier server listening on port ${PORT}`);
  });
}

startServer();
