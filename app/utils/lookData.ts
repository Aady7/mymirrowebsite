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

interface Look {
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
        brandName: "Brand Name",
        description: "The Glitchez Vivid Edge Shirt pairs bold prints with a relaxed cut—effortless and unapologetically you.",
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/tex-2.png"
        }
      },
      {
        id: 2,
        brandName: "Brand Name",
        description: "Function meets fashion. These split trousers go from full-length to street-ready—built to move.",
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/pant-2.png"
        }
      },
      {
        id: 3,
        brandName: "Adidas Samba OG",
        description: "Timeless kicks with attitude. The Samba OG fuses vintage sport with streetwear cool—every step makes a statement.",
        price: 2300,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/shooes.png"
        }
      }
    ],
    totalPrice: 6900,
    description: {
      mainText: "Clean cuts. Confident energy. Curated for someone who loves to stand out in subtle, stylish ways. The Vivid Edge shirt adds just enough print to turn heads, while the convertible trousers adapt to your day—from plans to spontaneity. Grounded with the iconic Adidas Sambas, this look speaks to your adventurous, street-smart personality. You value comfort, but never at the cost of edge—and that's exactly why this one's for you.",
      features: [
        "Shirt: Bold print that brings movement and energy",
        "Trousers: Convertible, breathable, and flexible.",
        "Shoes: Timeless silhouette with street-ready traction."
      ],
      whyPicked: "You lean toward bold yet balanced styles with streetwear influences. This look keeps you versatile and expressive."
    }
  },
  minimalElegance: {
    title: "MINIMAL ELEGANCE",
    lookNumber: 2,
    products: [
      {
        id: 4,
        brandName: "Essentials",
        description: "The Minimalist Oversized Tee in pristine white—where simplicity meets sophistication. Premium cotton, perfect drape.",
        price: 1800,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/minimal-tee.png"
        }
      },
      {
        id: 5,
        brandName: "Essentials",
        description: "High-waisted Wide Leg Trousers in charcoal—fluid movement meets architectural lines. Tailored for the modern minimalist.",
        price: 3200,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/minimal-pants.png"
        }
      }
    ],
    totalPrice: 5000,
    description: {
      mainText: "Less is more with this carefully curated minimal look. The oversized white tee creates a clean canvas, while the wide-leg trousers add architectural interest through their considered proportions. This look proves that simplicity, when executed with precision, makes the boldest statement.",
      features: [
        "T-Shirt: Premium cotton with considered oversized cut",
        "Trousers: Architectural wide-leg silhouette with perfect drape"
      ],
      whyPicked: "Your appreciation for refined minimalism and quality basics shows you understand that true style often lies in restraint."
    }
  },
  streetCore: {
    title: "STREET CORE",
    lookNumber: 3,
    products: [
      {
        id: 6,
        brandName: "Urban Edge",
        description: "The All-in-One Cargo Jumpsuit—utility meets urban flair. Multiple pockets, adjustable fit, and statement zippers make this piece as functional as it is fashion-forward.",
        price: 4500,
        sizes: ["S", "M", "L", "XL"],
        images: {
          background: "/assets/looks-1-back.png",
          foreground: "/assets/jumpsuit.png"
        }
      }
    ],
    totalPrice: 4500,
    description: {
      mainText: "One piece, endless possibilities. This cargo jumpsuit is the ultimate statement in effortless street style. With its perfect blend of utility and urban edge, it's designed for those who want their clothing to work as hard as they do while making a bold style statement.",
      features: [
        "Jumpsuit: Technical fabric with utility pockets and custom hardware"
      ],
      whyPicked: "Your bold approach to style and appreciation for functional fashion makes this piece perfect for your wardrobe."
    }
  }
};
