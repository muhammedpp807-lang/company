/* Six pieces presented through the showroom journey.
   Product names, prices, colourways and imagery are carried over unchanged
   from the existing TOMSTILL catalogue (src/App.tsx) — nothing is invented. */
export type ShowProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  priceNote: string;
  description: string;
  image: string;
  colors: string[];
  sizes: string;
  spec: string;
};

const img = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export const SHOW_PRODUCTS: ShowProduct[] = [
  {
    id: 1,
    name: "Rama Box Tee",
    category: "Tees",
    price: 1490,
    priceNote: "Retail incl. tax · wholesale on enquiry",
    description:
      "A boxy heavyweight tee cut for Bangkok heat. Shoulder seam sits wide, the body falls clean — the everyday anchor of the collection.",
    image: img("13831454"),
    colors: ["Ink", "Rice"],
    sizes: "XS – XL · age bands 2–13Y in kids runs",
    spec: "240 GSM cotton · relaxed box fit",
  },
  {
    id: 4,
    name: "Monsoon Shell",
    category: "Outerwear",
    price: 4290,
    priceNote: "Retail incl. tax · wholesale on enquiry",
    description:
      "Light weather shell with a taped hood and quiet hardware. Built for sudden rain and warm wind in equal measure.",
    image: img("14283386"),
    colors: ["Ink", "Black"],
    sizes: "XS – XL · age bands 2–13Y in kids runs",
    spec: "Water-repellent shell · unisex cut",
  },
  {
    id: 7,
    name: "Noon Linen Shirt",
    category: "Shirts",
    price: 2690,
    priceNote: "Retail incl. tax · wholesale on enquiry",
    description:
      "Airy linen-blend shirt with a soft collar and straight hem. Wears open over a tee or buttoned clean.",
    image: img("27786103"),
    colors: ["Rice", "Stone"],
    sizes: "XS – XL · age bands 2–13Y in kids runs",
    spec: "Linen blend · garment washed",
  },
  {
    id: 8,
    name: "Transit Cargo",
    category: "Trousers",
    price: 3290,
    priceNote: "Retail incl. tax · wholesale on enquiry",
    description:
      "Wide cargo with articulated knee and adjustable hem. Utility pockets sit flat until you need them.",
    image: img("8558857"),
    colors: ["Stone", "Moss"],
    sizes: "XS – XL · age bands 2–13Y in kids runs",
    spec: "Cotton ripstop · relaxed straight",
  },
  {
    id: 13,
    name: "Grid Overshirt",
    category: "Streetwear",
    price: 2990,
    priceNote: "Retail incl. tax · wholesale on enquiry",
    description:
      "Structured overshirt with a squared chest pocket line. Layers over everything in the collection without bulk.",
    image: img("34001454"),
    colors: ["Ink", "Clay"],
    sizes: "XS – XL · age bands 2–13Y in kids runs",
    spec: "Brushed twill · boxy layer",
  },
  {
    id: 17,
    name: "Arc Shoulder Bag",
    category: "Accessories",
    price: 1790,
    priceNote: "Retail incl. tax · wholesale on enquiry",
    description:
      "Compact shoulder bag with a curved flap and webbing strap. The finishing piece for any full look.",
    image: img("35322147"),
    colors: ["Black", "Clay"],
    sizes: "One size",
    spec: "Coated canvas · magnetic close",
  },
];

/* Verified business details, read from the deployed site's own structured data
   (schema.org/ClothingStore on tomstill-delta.vercel.app). Replace only if the
   real business supplies new details. */
export const BIZ = {
  name: "TOMSTILL Kids & Boys",
  email: "hello@tomstill-studio.com",
  site: "https://tomstill-studio.com/",
  city: "Tirupur",
  country: "IN",
  ageBands: "2–13Y",
  whatsapp: "https://wa.me/?text=Hello%20TOMSTILL%2C%20I%27d%20like%20a%20wholesale%20quote%20for%20kids%20%26%20boys%20streetwear.",
  directions: "https://www.google.com/maps/search/?api=1&query=Tirupur%2C%20India",
};
