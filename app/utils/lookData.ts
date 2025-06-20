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
  rating: number;
}

export const looksData = {
  urbanShift: {
    title: "URBAN SHIFT",
    lookNumber: 1,
    products: [
      {
        id: 1,
        brandName: "Glitchez Vivid Edge Shirt",
        description:
          "The Glitchez Vivid Edge Shirt pairs bold prints with a relaxed cut—effortless and unapologetically you.",
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks.png",
          foreground: "/assets/tex-2.png",
        },
      },
      {
        id: 2,
        brandName: "Kook N Keech Trousers",
        description:
          "Function meets fashion. These split trousers go from full-length to street-ready—built to move.",
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looksk.png",
          foreground: "/assets/pant-2.png",
        },
      },
      {
        id: 3,
        brandName: "Adidas Samba OG",
        description:
          "Timeless kicks with attitude. The Samba OG fuses vintage sport with streetwear cool—every step makes a statement.",
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks .png",
          foreground: "/assets/shooes.png",
        },
      },
    ],
    totalPrice: 6900,
    description: {
      mainText:
        "This outfit brings bold energy with laid-back structure designed for comfort, movement, and style that doesn’t try too hard.",

      whyPicked:
        "You lean toward bold yet balanced styles with streetwear influences. This look keeps you versatile and expressive.",
      features: [
        "Style Vive: Chill Relaxed fits and unfussy layers match your easygoing approach to fashion",
        " Skin Tone: Warm Beige Soft, grounded tones work with your undertone—not against it—and bring natural balance to the full look.  ",
        " Body Type: Hourglass Balanced pieces that flow with your shape—not against it—create a flattering silhouette. ",
      ],
    },
    rating: 5,
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
      features: [
        "Style Vive: ChillRelaxed fits and unfussy layers match your easygoing approach to fashion",
        " Skin Tone: Warm Beige Soft, grounded tones work with your undertone—not against it—and bring natural balance to the full look.  ",
        " Body Type: Hourglass Balanced pieces that flow with your shape—not against it—create a flattering silhouette. ",
      ],
      whyPicked:
        "Your appreciation for refined minimalism and quality basics shows you understand that true style often lies in restraint.",
    },
    rating: 5,
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

      features: [
        "Style Vive: ChillRelaxed fits and unfussy layers match your easygoing approach to fashion",
        " Skin Tone: Warm Beige Soft, grounded tones work with your undertone—not against it—and bring natural balance to the full look.  ",
        " Body Type: Hourglass Balanced pieces that flow with your shape—not against it—create a flattering silhouette. ",
      ],

      whyPicked:
        "Your bold approach to style and appreciation for functional fashion makes this piece perfect for your wardrobe.",
    },
    rating: 5,
  },
  sleekMonochrome: {
    title: "SLEEK MONOCHROME",
    lookNumber: 4,
    products: [
      {
        id: 7,
        brandName: "Minimal Move",
        description:
          "Cropped Monochrome Hoodie paired with Streamlined Joggers—effortlessly blending comfort and urban sharpness. Designed for those who thrive in simplicity with impact.",
        price: 3800,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-2-back.png",
          foreground: "/assets/monochrome-hoodie-jogger.png",
        },
      },
    ],
    totalPrice: 3800,
    description: {
      mainText:
        "Master the art of monochrome with this sleek set. Whether you're hitting the streets or the studio, this look offers an understated yet powerful silhouette.",
      features: [
        "Style Vive: ChillRelaxed fits and unfussy layers match your easygoing approach to fashion",
        " Skin Tone: Warm Beige Soft, grounded tones work with your undertone—not against it—and bring natural balance to the full look.  ",
        " Body Type: Hourglass Balanced pieces that flow with your shape—not against it—create a flattering silhouette. ",
      ],
      whyPicked:
        "Your love for minimal yet striking styles makes this set an easy pick—offering versatility and a touch of edge.",
    },
    rating: 4.5,
  },
  retroRewind: {
    title: "RETRO REWIND",
    lookNumber: 5,
    products: [
      {
        id: 8,
        brandName: "Vibe Vault",
        description:
          "Throwback Varsity Jacket with Contrast Detailing—crafted for the modern nostalgic. Pair with relaxed-fit jeans and chunky sneakers for an effortlessly cool vibe.",
        price: 5200,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-3-back.png",
          foreground: "/assets/varsity-jacket.png",
        },
      },
    ],
    totalPrice: 5200,
    description: {
      mainText:
        "Channel vintage energy with this elevated varsity jacket. Whether layered or worn solo, it’s a guaranteed head-turner.",
      features: [
        "Style Vive: ChillRelaxed fits and unfussy layers match your easygoing approach to fashion",
        " Skin Tone: Warm Beige Soft, grounded tones work with your undertone—not against it—and bring natural balance to the full look.  ",
        " Body Type: Hourglass Balanced pieces that flow with your shape—not against it—create a flattering silhouette. ",
      ],
      whyPicked:
        "Your love for timeless statement pieces and appreciation for retro styles make this the ideal choice.",
    },
    rating: 4.8,
  },
  grittyLayers: {
    title: "GRITTY LAYERS",
    lookNumber: 6,
    products: [
      {
        id: 9,
        brandName: "Layered Code",
        description:
          "Oversized Graphic Tee layered with Lightweight Technical Vest—combining art and utility for the streets.",
        price: 3700,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-4-back.png",
          foreground: "/assets/layered-tee-vest.png",
        },
      },
    ],
    totalPrice: 3700,
    description: {
      mainText:
        "A look built on contrasts—bold graphics paired with functional layering. Designed to let your personality shine through every street corner.",
      features: [
        "Style Vive: ChillRelaxed fits and unfussy layers match your easygoing approach to fashion",
        " Skin Tone: Warm Beige Soft, grounded tones work with your undertone—not against it—and bring natural balance to the full look.  ",
        " Body Type: Hourglass Balanced pieces that flow with your shape—not against it—create a flattering silhouette. ",
      ],
      whyPicked:
        "Because your style thrives on individuality and utility, this layered look offers the perfect canvas to express both.",
    },
    rating: 4.6,
  },
};
