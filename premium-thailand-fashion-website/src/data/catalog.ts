/* ============================================================
   ARUN® — PRODUCT CATALOG
   ------------------------------------------------------------
   NOTE FOR FUTURE INTEGRATION:
   This is the seed catalog. When Firebase is configured, replace
   this static data with a Firestore `products` collection
   (see src/lib/store.tsx for the integration point).
   All product names, descriptions and copy are original to ARUN.
   ============================================================ */

export type Category = "Tees" | "Shirts" | "Trousers" | "Outerwear" | "Accessories";

export const CATEGORIES: Category[] = ["Tees", "Shirts", "Trousers", "Outerwear", "Accessories"];

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price: number; // THB
  compareAt?: number; // optional anchor price
  description: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  inventory: number;
  featured: boolean;
  newArrival: boolean;
  tags: string[];
  material: string;
  fit: string;
  season: string;
}

export const SIZES = ["XS", "S", "M", "L", "XL"];

export const COLOR_WAY: Record<string, ProductColor> = {
  Ink: { name: "Ink", hex: "#1d1b17" },
  Bone: { name: "Bone", hex: "#e3dccd" },
  Ecru: { name: "Ecru", hex: "#efe9db" },
  Clay: { name: "Clay", hex: "#c2542b" },
  Stone: { name: "Stone", hex: "#a49b8b" },
  Moss: { name: "Moss", hex: "#5c5a48" },
  Charcoal: { name: "Charcoal", hex: "#37342e" },
};

const px = (id: number, w = 900, h = 1350) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const products: Product[] = [
  {
    id: "P01",
    name: "Meridian Oversized Tee",
    slug: "meridian-oversized-tee",
    category: "Tees",
    price: 1290,
    description:
      "The Meridian is our definition of the perfect tee — cut boxy through the body with a structured 240gsm cotton that holds its shape wash after wash. Dropped shoulders, a quiet ribbed collar, and a hem that sits exactly where it should.",
    images: [px(18516743), px(5706273), px(18444201)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Ecru, COLOR_WAY.Stone],
    inventory: 42,
    featured: true,
    newArrival: true,
    tags: ["oversized", "heavyweight", "essential", "everyday"],
    material: "100% long-staple cotton, 240gsm",
    fit: "Oversized — take one size down for a regular fit",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P02",
    name: "Horizon Longsleeve",
    slug: "horizon-longsleeve",
    category: "Tees",
    price: 1490,
    description:
      "A longsleeve built for in-between weather. Mid-weight jersey with ribbed cuffs and a slightly tapered sleeve — layer it under everything, or wear it alone when the Bangkok evening cools.",
    images: [px(6592245), px(4862912)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ecru, COLOR_WAY.Charcoal, COLOR_WAY.Clay],
    inventory: 35,
    featured: false,
    newArrival: true,
    tags: ["longsleeve", "layering", "jersey", "unisex"],
    material: "95% cotton, 5% elastane, 200gsm",
    fit: "Regular with tapered sleeve",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P03",
    name: "Rift Pocket Tee",
    slug: "rift-pocket-tee",
    category: "Tees",
    price: 1190,
    description:
      "Our classic tee with one quiet addition — a cleanly bar-tacked chest pocket. Garment-dyed for a lived-in tone from the very first wear.",
    images: [px(15451683), px(7671168)],
    sizes: SIZES,
    colors: [COLOR_WAY.Moss, COLOR_WAY.Bone, COLOR_WAY.Ink],
    inventory: 28,
    featured: false,
    newArrival: false,
    tags: ["pocket", "garment-dyed", "casual", "everyday"],
    material: "100% cotton jersey, 220gsm, garment-dyed",
    fit: "Relaxed",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P04",
    name: "Dawn Utility Shirt",
    slug: "dawn-utility-shirt",
    category: "Shirts",
    price: 1890,
    description:
      "A work shirt re-drawn. Four pockets, a soft-point collar and a brushed twill that breaks in like a favourite jacket. Equally at home over a tee or on its own.",
    images: [px(34713100), px(7671168), px(4554339)],
    sizes: SIZES,
    colors: [COLOR_WAY.Clay, COLOR_WAY.Moss, COLOR_WAY.Ink],
    inventory: 24,
    featured: true,
    newArrival: true,
    tags: ["utility", "overshirt", "twill", "pockets"],
    material: "100% brushed cotton twill, 280gsm",
    fit: "Boxy — true to size",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P05",
    name: "Studio Poplin Shirt",
    slug: "studio-poplin-shirt",
    category: "Shirts",
    price: 1690,
    description:
      "Crisp where it should be, soft where it matters. A relaxed poplin shirt with a collar that stands on its own and a placket finished by hand. The quiet backbone of a considered wardrobe.",
    images: [px(8484013), px(18444201)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ecru, COLOR_WAY.Ink],
    inventory: 30,
    featured: false,
    newArrival: false,
    tags: ["poplin", "crisp", "minimal", "shirting"],
    material: "100% organic cotton poplin",
    fit: "Relaxed",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P06",
    name: "Lua Camp Shirt",
    slug: "lua-camp-shirt",
    category: "Shirts",
    price: 1790,
    description:
      "An open-collar camp shirt in a breathable linen-cotton blend — made for the long walk between breakfast and wherever the day goes. Straight hem, chest pocket, zero fuss.",
    images: [px(18632573), px(8581381)],
    sizes: SIZES,
    colors: [COLOR_WAY.Bone, COLOR_WAY.Stone],
    inventory: 26,
    featured: false,
    newArrival: true,
    tags: ["camp collar", "linen", "summer", "tropical"],
    material: "55% linen, 45% cotton",
    fit: "Straight — true to size",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P07",
    name: "Axis Cargo Trouser",
    slug: "axis-cargo-trouser",
    category: "Trousers",
    price: 2190,
    compareAt: 2590,
    description:
      "Our most-asked-for silhouette. A wide, softly tapered cargo in ripstop cotton with six pockets that actually work — bellowed, lined and cut to sit clean on the waist.",
    images: [px(19189055), px(1487713)],
    sizes: SIZES,
    colors: [COLOR_WAY.Moss, COLOR_WAY.Ink, COLOR_WAY.Stone],
    inventory: 20,
    featured: true,
    newArrival: true,
    tags: ["cargo", "wide leg", "ripstop", "utility"],
    material: "100% cotton ripstop, 260gsm",
    fit: "Wide, tapered leg — true to size",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P08",
    name: "Terra Wide Pant",
    slug: "terra-wide-pant",
    category: "Trousers",
    price: 1990,
    description:
      "A pleated wide pant with a fluid drape — pressed sharp at the waist and falling straight to the floor. Tailoring logic, everyday fabric.",
    images: [px(36742654), px(5908241)],
    sizes: SIZES,
    colors: [COLOR_WAY.Bone, COLOR_WAY.Charcoal],
    inventory: 22,
    featured: false,
    newArrival: false,
    tags: ["pleated", "wide", "tailored", "drape"],
    material: "68% cotton, 30% viscose, 2% elastane",
    fit: "High-rise, wide leg",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P09",
    name: "Kinetic Track Pant",
    slug: "kinetic-track-pant",
    category: "Trousers",
    price: 1890,
    description:
      "A tailored take on the track pant — brushed-back jersey with a tapered leg, ankle zips and hidden side pockets. Movement, refined.",
    images: [px(11317811), px(6275942)],
    sizes: SIZES,
    colors: [COLOR_WAY.Charcoal, COLOR_WAY.Ecru],
    inventory: 31,
    featured: false,
    newArrival: false,
    tags: ["track pant", "jersey", "tapered", "comfort"],
    material: "80% cotton, 20% recycled polyester brushed jersey",
    fit: "Tapered",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P10",
    name: "Quarry Pleated Short",
    slug: "quarry-pleated-short",
    category: "Trousers",
    price: 1390,
    description:
      "A just-above-the-knee short with a single forward pleat, cut from the same drapey twill as the Terra pant. Built for the tropics, finished for the city.",
    images: [px(13070044), px(5908241)],
    sizes: SIZES,
    colors: [COLOR_WAY.Stone, COLOR_WAY.Ink],
    inventory: 27,
    featured: false,
    newArrival: false,
    tags: ["shorts", "pleated", "tropical", "summer"],
    material: "68% cotton, 30% viscose, 2% elastane",
    fit: "Mid-length, relaxed",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P11",
    name: "Solstice Bomber",
    slug: "solstice-bomber",
    category: "Outerwear",
    price: 3490,
    description:
      "The statement layer of the collection. A boxy bomber in dense melton wool with a ribbed collar, two-way zip and fully lined body — warmth without weight, presence without noise.",
    images: [px(6726841), px(10482937), px(4554339)],
    sizes: SIZES,
    colors: [COLOR_WAY.Clay, COLOR_WAY.Ink],
    inventory: 14,
    featured: true,
    newArrival: false,
    tags: ["bomber", "wool", "statement", "limited"],
    material: "70% wool, 30% recycled poly melton",
    fit: "Boxy — true to size",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P12",
    name: "Monsoon Coach Jacket",
    slug: "monsoon-coach-jacket",
    category: "Outerwear",
    price: 2890,
    description:
      "A coach jacket rated for the season it's named after. Water-repellent recycled shell, mesh lining, snap front and a drawcord hem — honest rain gear with a clean line.",
    images: [px(10596845), px(7671167)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ecru, COLOR_WAY.Ink],
    inventory: 18,
    featured: false,
    newArrival: true,
    tags: ["coach jacket", "water-repellent", "rainy season", "recycled"],
    material: "100% recycled nylon with DWR finish",
    fit: "Regular",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P13",
    name: "Vertex Windbreaker",
    slug: "vertex-windbreaker",
    category: "Outerwear",
    price: 2590,
    description:
      "Featherweight and packable — the Vertex folds into its own pocket and disappears into a bag until the sky changes. Elasticated cuffs, storm collar, matte finish.",
    images: [px(19978240), px(33393791)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Clay],
    inventory: 21,
    featured: false,
    newArrival: false,
    tags: ["windbreaker", "packable", "lightweight", "travel"],
    material: "100% recycled polyester ripstop",
    fit: "Regular",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P14",
    name: "Drift Heavy Hoodie",
    slug: "drift-heavy-hoodie",
    category: "Outerwear",
    price: 2290,
    compareAt: 2690,
    description:
      "480gsm of loopback cotton with a double-layer hood, hidden phone pocket and a hem cut slightly long. The Drift is the hoodie you reach for without thinking — which is the point.",
    images: [px(9594667), px(35050037), px(6275942)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ecru, COLOR_WAY.Moss, COLOR_WAY.Ink],
    inventory: 33,
    featured: true,
    newArrival: true,
    tags: ["hoodie", "heavyweight", "loopback", "essential"],
    material: "100% cotton loopback, 480gsm",
    fit: "Oversized — take one size down",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P15",
    name: "Lumen Knit Polo",
    slug: "lumen-knit-polo",
    category: "Shirts",
    price: 1890,
    description:
      "A knitted polo in a fine-gauge cotton silk blend — soft texture, clean two-button placket, and a collar that relaxes beautifully over a day of wear.",
    images: [px(19222080), px(6275942)],
    sizes: SIZES,
    colors: [COLOR_WAY.Bone, COLOR_WAY.Moss],
    inventory: 19,
    featured: false,
    newArrival: false,
    tags: ["knit", "polo", "silk blend", "texture"],
    material: "85% cotton, 15% silk, fine gauge",
    fit: "Regular",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P16",
    name: "Atlas Cap",
    slug: "atlas-cap",
    category: "Accessories",
    price: 790,
    description:
      "A six-panel cap in brushed cotton twill with a brass slider and a soft, pre-curved brim. Embroidered with the ARUN dawn mark — small, on the side, where it belongs.",
    images: [px(8581381)],
    sizes: ["ONE SIZE"],
    colors: [COLOR_WAY.Ecru, COLOR_WAY.Ink, COLOR_WAY.Clay],
    inventory: 60,
    featured: false,
    newArrival: false,
    tags: ["cap", "embroidered", "twill", "accessory"],
    material: "100% brushed cotton twill",
    fit: "Adjustable, one size",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P17",
    name: "Vessel Canvas Tote",
    slug: "vessel-canvas-tote",
    category: "Accessories",
    price: 990,
    description:
      "18oz natural canvas with reinforced base stitching and an interior zip pocket. Carries a laptop, a market run, or everything you pretend you don't need.",
    images: [px(8581033)],
    sizes: ["ONE SIZE"],
    colors: [COLOR_WAY.Ecru],
    inventory: 45,
    featured: false,
    newArrival: true,
    tags: ["tote", "canvas", "everyday carry", "market"],
    material: "18oz natural cotton canvas",
    fit: "38 × 42 × 12 cm",
    season: "Vol. 01 — First Light",
  },
  {
    id: "P18",
    name: "Basin Bucket Hat",
    slug: "basin-bucket-hat",
    category: "Accessories",
    price: 850,
    description:
      "A soft-structured bucket hat in washed cotton twill with a bound brim that keeps its curve. Sun protection that doesn't shout about it.",
    images: [px(9218533)],
    sizes: ["S/M", "L/XL"],
    colors: [COLOR_WAY.Stone, COLOR_WAY.Ink],
    inventory: 38,
    featured: false,
    newArrival: false,
    tags: ["bucket hat", "washed twill", "summer", "tropical"],
    material: "100% washed cotton twill",
    fit: "Two sizes",
    season: "Vol. 01 — First Light",
  },
];

/* ---------- Lookbook data (editorial sets) ---------- */
export interface Look {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  pieces: string[];
  mood: string;
}

export const looks: Look[] = [
  {
    id: "LOOK 01",
    title: "First Light",
    subtitle: "Terracotta bomber over washed ecru — dawn over the city",
    image: "/images/look-01.jpg",
    pieces: ["Solstice Bomber", "Meridian Oversized Tee", "Terra Wide Pant"],
    mood: "Warm · Structured · Quiet",
  },
  {
    id: "LOOK 02",
    title: "Hard Shadows",
    subtitle: "Utility twill against raw concrete — geometry of the everyday",
    image: "/images/look-02.jpg",
    pieces: ["Dawn Utility Shirt", "Axis Cargo Trouser"],
    mood: "Utilitarian · Sharp · Grounded",
  },
  {
    id: "LOOK 03",
    title: "Soft Focus",
    subtitle: "Heavyweight fleece in stillness — the comfort of weight",
    image: "/images/look-03.jpg",
    pieces: ["Drift Heavy Hoodie", "Kinetic Track Pant"],
    mood: "Calm · Heavy · Considered",
  },
  {
    id: "LOOK 04",
    title: "Golden Hour",
    subtitle: "Bangkok, 18:42 — the city turns to amber",
    image: "/images/lifestyle-01.jpg",
    pieces: ["Lua Camp Shirt", "Quarry Pleated Short", "Atlas Cap"],
    mood: "Tropical · Loose · Alive",
  },
  {
    id: "LOOK 05",
    title: "Concrete Garden",
    subtitle: "Street forms against the city's architecture",
    image: px(31207606),
    pieces: ["Monsoon Coach Jacket", "Axis Cargo Trouser"],
    mood: "Urban · Contrast · Modern",
  },
  {
    id: "LOOK 06",
    title: "Uniform",
    subtitle: "One tone, head to toe — the quiet flex",
    image: px(6592254),
    pieces: ["Horizon Longsleeve", "Terra Wide Pant"],
    mood: "Monochrome · Minimal · Precise",
  },
  {
    id: "LOOK 07",
    title: "Night Shift",
    subtitle: "The city after dark — reflective, restless",
    image: px(19978240),
    pieces: ["Vertex Windbreaker", "Kinetic Track Pant"],
    mood: "Technical · Nocturnal · Fast",
  },
  {
    id: "LOOK 08",
    title: "Studio Session",
    subtitle: "The fitting room notes — shapes under worklight",
    image: px(9619654),
    pieces: ["Studio Poplin Shirt", "Terra Wide Pant"],
    mood: "Editorial · Raw · Honest",
  },
];

/* ---------- Helpers ---------- */
export const formatTHB = (n: number) =>
  `THB ${n.toLocaleString("en-US")}`;

export const findProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
