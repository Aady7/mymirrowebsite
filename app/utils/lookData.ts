interface Product {
  id: number;
  brandName: string;
  description: string;
  price: number;
  sizes: string[];
  images: {
    background: string;
    foreground: string;
  };
}

export interface Look {
  title: string;
  lookNumber: number;
  products: Product[];
  totalPrice: number;
  description: {
    mainText: string;
    features: string[];
    whyPicked: string;
  };
}

export const looksData = {
  urbanShift: {
    title: "URBAN SHIFT",
    lookNumber: 1,
    products: [
      {
        id: 1,
        brandName: "Glitchez Vivid Edge Shirt",
        description: ["Bold Print", "Relaxed fit", "Breathable", "Street vibe"],
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/tex-2.png",
        },
      },
      {
        id: 2,
        brandName: " Kook N Keech Trousers",
        description: "Convertible.Zip detail. Easy movement.Utility feel",
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/pant-2.png",
        },
      },
      {
        id: 3,
        brandName: "Adidas Samba OG",
        description: [
          "Iconic look",
          "Leather upper",
          "Cushioned sole",
          "Everyday cool",
        ],
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/shooes.png",
        },
      },
    ],
    totalPrice: 6900,
    description: {
      mainText:
        "This outfit brings bold energy with laid-back structure designed for comfort, movement, and style that doesn’t try too hard.",
      features: [],
      whyPicked: "",
    },
  },
  minimalElegance: {
    title: "MINIMAL ELEGANCE",
    lookNumber: 2,
    products: [
      {
        id: 4,
        brandName: "Essentials",
        description:
          "The Minimalist Oversized Tee in pristine white—where simplicity meets sophistication. Premium cotton, perfect drape.",
        price: 1800,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/minimal-tee.png",
        },
      },
      {
        id: 5,
        brandName: "Essentials",
        description:
          "High-waisted Wide Leg Trousers in charcoal—fluid movement meets architectural lines. Tailored for the modern minimalist.",
        price: 3200,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/minimal-pants.png",
        },
      },
    ],
    totalPrice: 5000,
    description: {
      mainText:
        "Less is more with this carefully curated minimal look. The oversized white tee creates a clean canvas, while the wide-leg trousers add architectural interest through their considered proportions. This look proves that simplicity, when executed with precision, makes the boldest statement.",
      features: [],
      whyPicked:
        "Your appreciation for refined minimalism and quality basics shows you understand that true style often lies in restraint.",
    },
  },
  streetCore: {
    title: "STREET CORE",
    lookNumber: 3,
    products: [
      {
        id: 6,
        brandName: "Urban Edge",
        description:
          "The All-in-One Cargo Jumpsuit—utility meets urban flair. Multiple pockets, adjustable fit, and statement zippers make this piece as functional as it is fashion-forward.",
        price: 4500,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/jumpsuit.png",
        },
      },
    ],
    totalPrice: 4500,
    description: {
      mainText:
        "One piece, endless possibilities. This cargo jumpsuit is the ultimate statement in effortless street style. With its perfect blend of utility and urban edge, it's designed for those who want their clothing to work as hard as they do while making a bold style statement.",
      features: [],
      whyPicked: "",
    },
  },
  neoNomad: {
    title: "NEO NOMAD",
    lookNumber: 4,
    products: [
      {
        id: 7,
        brandName: "Nomadic Layers Hoodie",
        description: [
          "Layered texture",
          "Earth tones",
          "Tech fleece",
          "Urban drape",
        ],
        price: 2800,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/hoodie.png",
        },
      },
    ],
    totalPrice: 2800,
    description: {
      mainText:
        "Channel the energy of modern wanderers. This hoodie look is crafted to move with you across terrains—urban or otherwise.",
      features: [],
      whyPicked: "",
    },
  },

  monochromeMotion: {
    title: "MONOCHROME MOTION",
    lookNumber: 5,
    products: [
      {
        id: 8,
        brandName: "RunTrack Monochrome Set",
        description: ["Streamlined", "Performance-ready", "Minimal logo"],
        price: 3400,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/monochrome.png",
        },
      },
    ],
    totalPrice: 3400,
    description: {
      mainText:
        "Sleek lines and movement in focus. This monochrome set is the go-to for elevated street-active hybrids.",
      features: [],
      whyPicked: "",
    },
  },

  vibrantPulse: {
    title: "VIBRANT PULSE",
    lookNumber: 6,
    products: [
      {
        id: 9,
        brandName: "Pulse Pop Jacket",
        description: ["Colorblock", "Retro vibe", "Energetic feel"],
        price: 3100,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/pulse-jacket.png",
        },
      },
    ],
    totalPrice: 3100,
    description: {
      mainText:
        "Bold hues and playful contrast. This look speaks to the high-energy streetwear enthusiast.",
      features: [],
      whyPicked: "",
    },
  },
};
