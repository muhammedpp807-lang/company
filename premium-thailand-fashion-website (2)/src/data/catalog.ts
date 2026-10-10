/* ============================================================
   TOMSTILL KIDS & BOYS — PRODUCT CATALOG
   ------------------------------------------------------------
   Streetwear retail catalogue. Sizes are kids/boys age bands.
   NOTE FOR FUTURE INTEGRATION: this is the seed catalog. When
   Firebase is configured, replace with a Firestore `products`
   collection (see src/lib/store.tsx for the integration point).
   All product names, descriptions and copy are original.
   ============================================================ */

export type Category = "Tees" | "Jackets" | "Hoodies" | "Bottoms" | "Caps";

export const CATEGORIES: Category[] = ["Tees", "Jackets", "Hoodies", "Bottoms", "Caps"];

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price: number; // INR
  compareAt?: number;
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

/* kids / boys age bands */
export const SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];

export const COLOR_WAY: Record<string, ProductColor> = {
  Ink: { name: "Ink", hex: "#14100E" },
  Bone: { name: "Bone", hex: "#E8E1D5" },
  Ecru: { name: "Ecru", hex: "#F2ECE0" },
  Ember: { name: "Ember", hex: "#E8452C" },
  Rust: { name: "Rust", hex: "#A8442A" },
  Stone: { name: "Stone", hex: "#9A9184" },
  Olive: { name: "Olive", hex: "#5E5C43" },
  Chocolate: { name: "Chocolate", hex: "#4A3527" },
};

const px = (id: number, w = 900, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const products: Product[] = [
  {
    id: "P01",
    name: "BREAKERS 72",
    slug: "breakers-72",
    category: "Jackets",
    price: 2499,
    description:
      "The Breakers 72 is our signature varsity — heavyweight melton body, ribbed collar and cuffs, and a chain-stitched 72 on the back. Built to be handed down, not thrown out.",
    images: [px(18761008), px(3695660), px(6554171)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Ember, COLOR_WAY.Chocolate],
    inventory: 24,
    featured: true,
    newArrival: true,
    tags: ["varsity", "jacket", "melton", "chain-stitch", "heavyweight"],
    material: "70% wool, 30% recycled poly melton",
    fit: "Boxy — true to size",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P02",
    name: "HEYCATS 313",
    slug: "heycats-313",
    category: "Tees",
    price: 899,
    description:
      "A 240gsm cotton tee with a puff-printed 313 across the chest. Garment-dyed so it breaks in from the first wear and fades like a favourite.",
    images: [px(31995223), px(9594692), px(30940601)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ember, COLOR_WAY.Bone, COLOR_WAY.Ink],
    inventory: 48,
    featured: true,
    newArrival: true,
    tags: ["tee", "puff print", "garment-dyed", "graphic", "everyday"],
    material: "100% cotton jersey, 240gsm, garment-dyed",
    fit: "Regular — true to size",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P03",
    name: "DANGER PANEL",
    slug: "danger-panel",
    category: "Tees",
    price: 949,
    compareAt: 1199,
    description:
      "Chocolate brown heavyweight tee with a stacked DANGER panel print. Cut boxy through the body with a ribbed collar that holds its shape.",
    images: [px(26601197), px(7857552), px(5698847)],
    sizes: SIZES,
    colors: [COLOR_WAY.Chocolate, COLOR_WAY.Ecru, COLOR_WAY.Ink],
    inventory: 36,
    featured: true,
    newArrival: true,
    tags: ["tee", "graphic", "heavyweight", "panel print", "boxy"],
    material: "100% cotton jersey, 260gsm",
    fit: "Boxy",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P04",
    name: "NIGHT SHIFT 88",
    slug: "night-shift-88",
    category: "Hoodies",
    price: 1799,
    description:
      "480gsm loopback fleece with a double-layer hood, kangaroo pocket and a hem cut slightly long. The hoodie they'll reach for without thinking.",
    images: [px(9594692), px(5706273), px(6347888)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Ecru, COLOR_WAY.Olive],
    inventory: 30,
    featured: false,
    newArrival: true,
    tags: ["hoodie", "fleece", "heavyweight", "loopback", "essential"],
    material: "100% cotton loopback, 480gsm",
    fit: "Oversized — one size down",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P05",
    name: "STATIC KIDS 21",
    slug: "static-kids-21",
    category: "Tees",
    price: 849,
    description:
      "A glitch-static graphic on a mid-weight tee, screen-printed by hand in small runs so no two are quite identical.",
    images: [px(30940601), px(31995223)],
    sizes: SIZES,
    colors: [COLOR_WAY.Bone, COLOR_WAY.Ink],
    inventory: 40,
    featured: false,
    newArrival: true,
    tags: ["tee", "graphic", "screen print", "hand printed", "static"],
    material: "100% cotton jersey, 220gsm",
    fit: "Regular",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P06",
    name: "CONCRETE 04",
    slug: "concrete-04",
    category: "Bottoms",
    price: 1599,
    description:
      "Wide-leg cargo in washed cotton ripstop with six working pockets and a drawcord hem. Designed to be climbed on.",
    images: [px(6347888), px(5698851)],
    sizes: SIZES,
    colors: [COLOR_WAY.Olive, COLOR_WAY.Ink, COLOR_WAY.Stone],
    inventory: 26,
    featured: false,
    newArrival: false,
    tags: ["cargo", "wide leg", "ripstop", "utility", "pockets"],
    material: "100% cotton ripstop, 260gsm",
    fit: "Wide, tapered",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P07",
    name: "SIGNAL RED 12",
    slug: "signal-red-12",
    category: "Tees",
    price: 899,
    description:
      "Our house red, on a boxy heavyweight tee. A single 12 hits the back yoke — quiet from the front, loud from behind.",
    images: [px(7857552), px(26601197)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ember, COLOR_WAY.Bone],
    inventory: 44,
    featured: false,
    newArrival: false,
    tags: ["tee", "graphic", "boxy", "house red", "back print"],
    material: "100% cotton jersey, 240gsm",
    fit: "Boxy",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P08",
    name: "BACKSTREET 55",
    slug: "backstreet-55",
    category: "Jackets",
    price: 2899,
    description:
      "A coach jacket in water-repellent recycled shell with a snap front, mesh lining and embroidered 55 at the chest. Rain gear that looks like streetwear.",
    images: [px(6554171), px(36008176)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Ember],
    inventory: 18,
    featured: false,
    newArrival: true,
    tags: ["coach jacket", "water-repellent", "recycled", "embroidered"],
    material: "100% recycled nylon with DWR finish",
    fit: "Regular",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P09",
    name: "OVERDRIVE 09",
    slug: "overdrive-09",
    category: "Hoodies",
    price: 1899,
    description:
      "Zip-through hoodie in brushed-back jersey with a two-way zip and hidden phone pocket. Movement, refined.",
    images: [px(5706273), px(6347888)],
    sizes: SIZES,
    colors: [COLOR_WAY.Chocolate, COLOR_WAY.Ink],
    inventory: 28,
    featured: false,
    newArrival: false,
    tags: ["zip hoodie", "jersey", "brushed", "everyday"],
    material: "80% cotton, 20% recycled polyester",
    fit: "Regular",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P10",
    name: "GRAFFITI 77",
    slug: "graffiti-77",
    category: "Tees",
    price: 949,
    description:
      "A hand-drawn tag printed across the whole back, with the small 77 sitting at the hem. Made for the ones who write on walls.",
    images: [px(31995223), px(9594692)],
    sizes: SIZES,
    colors: [COLOR_WAY.Bone, COLOR_WAY.Ink, COLOR_WAY.Ecru],
    inventory: 34,
    featured: false,
    newArrival: false,
    tags: ["tee", "graphic", "all over print", "graffiti", "tag"],
    material: "100% cotton jersey, 240gsm",
    fit: "Boxy",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P11",
    name: "MIDNIGHT 31",
    slug: "midnight-31",
    category: "Bottoms",
    price: 1499,
    description:
      "Tapered track pant in heavyweight fleece with ankle zips and a tonal 31 down the leg. Gym, street, everywhere.",
    images: [px(5698851), px(6347888)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Stone],
    inventory: 32,
    featured: false,
    newArrival: false,
    tags: ["track pant", "fleece", "tapered", "ankle zip"],
    material: "80% cotton, 20% recycled polyester fleece",
    fit: "Tapered",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P12",
    name: "CHROME 16",
    slug: "chrome-16",
    category: "Jackets",
    price: 3199,
    description:
      "A cropped bomber in metallic-finish shell with a ribbed collar and reflective trims. Catches every light in the room.",
    images: [px(3695660), px(18761008)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Ember],
    inventory: 14,
    featured: true,
    newArrival: false,
    tags: ["bomber", "metallic", "reflective", "statement", "limited"],
    material: "100% recycled poly with metallic coating",
    fit: "Cropped, boxy",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P13",
    name: "VOLTAGE 63",
    slug: "voltage-63",
    category: "Tees",
    price: 899,
    description:
      "A cracked-lightning graphic in discharge ink, so the print softens with every wash. 63 sits small on the front.",
    images: [px(26601197), px(7857552)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ecru, COLOR_WAY.Ink],
    inventory: 38,
    featured: false,
    newArrival: false,
    tags: ["tee", "graphic", "discharge print", "lightning"],
    material: "100% cotton jersey, 240gsm",
    fit: "Regular",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P14",
    name: "SHADOW PLAY 05",
    slug: "shadow-play-05",
    category: "Bottoms",
    price: 1699,
    description:
      "Pleated wide pant with a fluid drape and a tonal side stripe. Tailoring logic, street fabric.",
    images: [px(6347888), px(5698847)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Chocolate],
    inventory: 22,
    featured: false,
    newArrival: false,
    tags: ["wide pant", "pleated", "drape", "side stripe"],
    material: "68% cotton, 30% viscose, 2% elastane",
    fit: "High-rise, wide",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P15",
    name: "NEON RUN 42",
    slug: "neon-run-42",
    category: "Hoodies",
    price: 1999,
    compareAt: 2399,
    description:
      "Panelled hoodie with reflective piping and a neon 42 across the shoulders. Built to be seen after dark.",
    images: [px(5706273), px(9594692)],
    sizes: SIZES,
    colors: [COLOR_WAY.Ink, COLOR_WAY.Ecru],
    inventory: 20,
    featured: false,
    newArrival: true,
    tags: ["hoodie", "reflective", "panelled", "neon", "night"],
    material: "100% cotton loopback, 420gsm",
    fit: "Regular",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P16",
    name: "RAW EDGE 19",
    slug: "raw-edge-19",
    category: "Tees",
    price: 999,
    description:
      "Cut from a single panel with an unfinished raw hem and a torn-out neckline. Deliberately imperfect, deliberately ours.",
    images: [px(30940601), px(31995223)],
    sizes: SIZES,
    colors: [COLOR_WAY.Bone, COLOR_WAY.Ecru],
    inventory: 16,
    featured: false,
    newArrival: false,
    tags: ["tee", "raw hem", "deconstructed", "limited", "one panel"],
    material: "100% cotton slub jersey, 230gsm",
    fit: "Oversized",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P17",
    name: "PAVEMENT 27",
    slug: "pavement-27",
    category: "Bottoms",
    price: 1099,
    description:
      "Just-above-the-knee short in washed twill with a single forward pleat. Made for hot concrete and long evenings.",
    images: [px(5698847), px(5698851)],
    sizes: SIZES,
    colors: [COLOR_WAY.Stone, COLOR_WAY.Ink, COLOR_WAY.Olive],
    inventory: 30,
    featured: false,
    newArrival: false,
    tags: ["shorts", "pleated", "washed twill", "summer"],
    material: "100% washed cotton twill",
    fit: "Mid-length, relaxed",
    season: "Vol. 01 — Stock The Street",
  },
  {
    id: "P18",
    name: "TAPE DECK 08",
    slug: "tape-deck-08",
    category: "Caps",
    price: 649,
    description:
      "Six-panel cap in brushed twill with an embroidered T monogram and a brass slider. The finishing piece on every fit.",
    images: [px(30940601), px(5706273)],
    sizes: ["ONE SIZE"],
    colors: [COLOR_WAY.Ink, COLOR_WAY.Ember, COLOR_WAY.Ecru],
    inventory: 60,
    featured: false,
    newArrival: false,
    tags: ["cap", "embroidered", "twill", "accessory"],
    material: "100% brushed cotton twill",
    fit: "Adjustable, one size",
    season: "Vol. 01 — Stock The Street",
  },
];

/* ---------- Lookbook (retail editorial) ---------- */
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
    title: "The Street At Night",
    subtitle: "Ember light on wet concrete — the collection after dark",
    image: "https://images.pexels.com/photos/29356751/pexels-photo-29356751.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500",
    pieces: ["BREAKERS 72", "HEYCATS 313", "CONCRETE 04"],
    mood: "Nocturnal · Neon · Alive",
  },
  {
    id: "LOOK 02",
    title: "The Golddigio",
    subtitle: "Warm interior light against the rail — retail as theatre",
    image: "https://images.pexels.com/photos/38443852/pexels-photo-38443852.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500",
    pieces: ["DANGER PANEL", "MIDNIGHT 31"],
    mood: "Warm · Interior · Cinematic",
  },
  {
    id: "LOOK 03",
    title: "The Shopfront",
    subtitle: "Glass, signage and the first impression of the house",
    image: "https://images.pexels.com/photos/19047723/pexels-photo-19047723.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500",
    pieces: ["BACKSTREET 55", "TAPE DECK 08"],
    mood: "Urban · Bold · Lit",
  },
  {
    id: "LOOK 04",
    title: "Built To Stock",
    subtitle: "Back of house, where the volume actually lives",
    image: "https://images.pexels.com/photos/5698847/pexels-photo-5698847.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500",
    pieces: ["NIGHT SHIFT 88", "SHADOW PLAY 05"],
    mood: "Working · Honest · Layered",
  },
  {
    id: "LOOK 05",
    title: "Rail After Rail",
    subtitle: "The wall of product — one rail, one story at a time",
    image: "https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500",
    pieces: ["GRAFFITI 77", "PAVEMENT 27"],
    mood: "Dense · Ordered · Tactile",
  },
  {
    id: "LOOK 06",
    title: "Big Style, Small Sizes",
    subtitle: "Adult proportions, cut for the next generation",
    image: "https://images.pexels.com/photos/18761008/pexels-photo-18761008.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500",
    pieces: ["BREAKERS 72", "CHROME 16", "NEON RUN 42"],
    mood: "Confident · Scaled · Sharp",
  },
];

/* ---------- Store locations (from the brand storyboard) ---------- */
export const STORES = [
  { city: "Kids & Boys", detail: "The flagship. Three floors, one collection." },
  { city: "Tirupur", detail: "The knitwear capital — where the cotton begins." },
  { city: "Bangalore", detail: "Street-level, open late, always stocked." },
  { city: "Bengaluru", detail: "The second door. Same rails, new light." },
];

/* ---------- Helpers ---------- */
export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
/** legacy alias kept so existing imports keep working */
export const formatTHB = formatPrice;

export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
