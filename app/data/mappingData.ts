export interface FitMappingEntry {
  gender: string;
  bodyShape: string;
  category: string;
  recommendedFits: string[];
}

// All values are lowercase for consistent matching
export const FIT_MAPPING_DATA: FitMappingEntry[] = [
  { gender: "men", bodyShape: "hourglass", category: "upper wear", recommendedFits: ["fitted", "tailored"] },
  { gender: "men", bodyShape: "hourglass", category: "lower wear", recommendedFits: ["slim", "straight"] },
  { gender: "men", bodyShape: "inverted triangle", category: "upper wear", recommendedFits: ["tailored", "regular"] },
  { gender: "men", bodyShape: "inverted triangle", category: "lower wear", recommendedFits: ["straight", "tapered"] },
  { gender: "men", bodyShape: "oval", category: "upper wear", recommendedFits: ["relaxed", "regular"] },
  { gender: "men", bodyShape: "oval", category: "lower wear", recommendedFits: ["straight", "relaxed"] },
  { gender: "men", bodyShape: "rectangle", category: "upper wear", recommendedFits: ["tailored", "fitted"] },
  { gender: "men", bodyShape: "rectangle", category: "lower wear", recommendedFits: ["straight", "tapered"] },
  { gender: "men", bodyShape: "triangle", category: "upper wear", recommendedFits: ["tailored", "fitted"] },
  { gender: "men", bodyShape: "triangle", category: "lower wear", recommendedFits: ["straight", "relaxed"] },
  { gender: "women", bodyShape: "hourglass", category: "upper wear", recommendedFits: ["fitted", "tailored"] },
  { gender: "women", bodyShape: "hourglass", category: "lower wear", recommendedFits: ["slim", "straight"] },
  { gender: "women", bodyShape: "hourglass", category: "full body", recommendedFits: ["bodycon", "wrap"] },
  { gender: "women", bodyShape: "inverted triangle", category: "upper wear", recommendedFits: ["relaxed", "oversized"] },
  { gender: "women", bodyShape: "inverted triangle", category: "lower wear", recommendedFits: ["wide", "relaxed"] },
  { gender: "women", bodyShape: "inverted triangle", category: "full body", recommendedFits: ["a-line", "empire"] },
  { gender: "women", bodyShape: "oval", category: "upper wear", recommendedFits: ["relaxed", "regular"] },
  { gender: "women", bodyShape: "oval", category: "lower wear", recommendedFits: ["straight", "tapered"] },
  { gender: "women", bodyShape: "oval", category: "full body", recommendedFits: ["empire", "a-line"] },
  { gender: "women", bodyShape: "rectangle", category: "upper wear", recommendedFits: ["fitted", "tailored"] },
  { gender: "women", bodyShape: "rectangle", category: "lower wear", recommendedFits: ["straight", "slim"] },
  { gender: "women", bodyShape: "rectangle", category: "full body", recommendedFits: ["shift", "a-line"] },
  { gender: "women", bodyShape: "triangle", category: "upper wear", recommendedFits: ["fitted", "tailored"] },
  { gender: "women", bodyShape: "triangle", category: "lower wear", recommendedFits: ["straight", "wide"] },
  { gender: "women", bodyShape: "triangle", category: "full body", recommendedFits: ["a-line", "wrap"] },
];

export interface QuestionMappingEntry {
  questionKey: string; // identifier for the question
  option: string; // the exact option text (lowercase)
  personalityTags: string[]; // lowercase tags
}

/**
 * Mappings of each possible answer option to its personality tags.
 * All text is lowercase for consistent matching.
 */
export const QUESTION_MAPPING_DATA: QuestionMappingEntry[] = [
  // Weekend Preference (Q1)
  {
    questionKey: "weekendPreference",
    option: "Relaxing at home",
    personalityTags: ["comf", "mini"],
  },
  {
    questionKey: "weekendPreference",
    option: "Exploring new spots",
    personalityTags: ["trend", "sc"],
  },
  {
    questionKey: "weekendPreference",
    option: "Being active",
    personalityTags: ["prac", "comf"],
  },
  {
    questionKey: "weekendPreference",
    option: "Attending events, parties",
    personalityTags: ["ex", "rb"],
  },

  // Shopping Style (Q2)
  {
    questionKey: "shoppingStyle",
    option: "Premium brands",
    personalityTags: ["stat", "conf"],
  },
  {
    questionKey: "shoppingStyle",
    option: "Unique finds",
    personalityTags: ["bold", "ex"],
  },
  {
    questionKey: "shoppingStyle",
    option: "Trusted labels",
    personalityTags: ["trad", "pl"],
  },
  {
    questionKey: "shoppingStyle",
    option: "Research & compare",
    personalityTags: ["pl", "prac"],
  },

  // Workspace Style (Q3)
  {
    questionKey: "workspaceStyle",
    option: "Clean and clutter-free",
    personalityTags: ["mini", "pl"],
  },
  {
    questionKey: "workspaceStyle",
    option: "Full of cozy touches (plants, cushions, mug)",
    personalityTags: ["comf", "prac"],
  },
  {
    questionKey: "workspaceStyle",
    option: "Tech-loaded",
    personalityTags: ["conf", "stat"],
  },
  {
    questionKey: "workspaceStyle",
    option: "Decor-rich and personal",
    personalityTags: ["rb", "ex"],
  },

  // Friend Compliments (Q4)
  {
    questionKey: "friendCompliments",
    option: "Always knowing what's trending and the newest cool spots",
    personalityTags: ["trend", "sc"],
  },
  {
    questionKey: "friendCompliments",
    option: "Being calm, dependable, and rooted",
    personalityTags: ["comf", "trad"],
  },
  {
    questionKey: "friendCompliments",
    option: "Your bold ideas and adventurous spirit",
    personalityTags: ["bold", "rb"],
  },
  {
    questionKey: "friendCompliments",
    option: "Your are organised and thoughtful",
    personalityTags: ["pl", "conf"],
  },

  // Work Outfit (Q5)
  {
    questionKey: "workOutfit",
    option: "Formal & sharp",
    personalityTags: ["conf", "stat"],
  },
  {
    questionKey: "workOutfit",
    option: "Elevated casual",
    personalityTags: ["prac", "comf"],
  },
  {
    questionKey: "workOutfit",
    option: "Standout bold",
    personalityTags: ["ex", "bold"],
  },
  {
    questionKey: "workOutfit",
    option: "Simple & classic",
    personalityTags: ["trad", "mini"],
  },

  // Wardrobe Content (Q6)
  {
    questionKey: "wardrobeContent",
    option: "Signature pieces",
    personalityTags: ["stat", "bold"],
  },
  {
    questionKey: "wardrobeContent",
    option: "Neutral basics ",
    personalityTags: ["mini", "comf"],
  },
  {
    questionKey: "wardrobeContent",
    option: "Curated ethnic + western classics, all paired up",
    personalityTags: ["sc", "trend"],
  },
  {
    questionKey: "wardrobeContent",
    option: "Signature pieces",
    personalityTags: ["rb", "ex"],
  },
];

export interface PatternMappingEntry {
  gender: string;
  personalityTag: string; // code only: ex, in, mo, rb, pl, intr, sc, rl
  styleType: string;
  patterns: string[];
}

export interface PatternCharacteristicsEntry {
  personality: string;
  gender: string;
  fashionStyle: string;
  printType: string[];
  printScale: string[];
  printDensity: string[];
  patternPlacement: string[];
  surfaceTexture: string[];
}

export const PATTERN_CHARACTERISTICS_DATA: PatternCharacteristicsEntry[] = [
  {
    personality: "ex",
    gender: "male",
    fashionStyle: "business casual",
    printType: ["geometric", "traditional"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "asymmetric"],
    surfaceTexture: ["smooth", "textured"],
  },
  {
    personality: "ex",
    gender: "male",
    fashionStyle: "streetwear",
    printType: ["graphic", "organic"],
    printScale: ["medium", "large"],
    printDensity: ["medium", "high"],
    patternPlacement: ["all-over", "placement"],
    surfaceTexture: ["textured", "soft"],
  },
  {
    personality: "ex",
    gender: "male",
    fashionStyle: "athleisure",
    printType: ["geometric", "graphic"],
    printScale: ["medium", "large"],
    printDensity: ["medium", "high"],
    patternPlacement: ["all-over", "placement"],
    surfaceTexture: ["technical", "textured"],
  },
  {
    personality: "ex",
    gender: "female",
    fashionStyle: "business casual",
    printType: ["geometric", "traditional"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "asymmetric"],
    surfaceTexture: ["smooth", "textured"],
  },
  {
    personality: "ex",
    gender: "female",
    fashionStyle: "streetwear",
    printType: ["graphic", "organic"],
    printScale: ["medium", "large"],
    printDensity: ["medium", "high"],
    patternPlacement: ["all-over", "placement"],
    surfaceTexture: ["textured", "soft"],
  },
  {
    personality: "ex",
    gender: "female",
    fashionStyle: "athleisure",
    printType: ["geometric", "graphic"],
    printScale: ["medium", "large"],
    printDensity: ["medium", "high"],
    patternPlacement: ["all-over", "placement"],
    surfaceTexture: ["technical", "textured"],
  },
  {
    personality: "conf",
    gender: "male",
    fashionStyle: "business casual",
    printType: ["geometric", "none"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "matched"],
    surfaceTexture: ["smooth", "luxury"],
  },
  {
    personality: "conf",
    gender: "male",
    fashionStyle: "streetwear",
    printType: ["geometric", "none"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "matched"],
    surfaceTexture: ["smooth", "textured"],
  },
  {
    personality: "conf",
    gender: "male",
    fashionStyle: "athleisure",
    printType: ["geometric", "none"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "matched"],
    surfaceTexture: ["technical", "smooth"],
  },
  {
    personality: "conf",
    gender: "female",
    fashionStyle: "business casual",
    printType: ["geometric", "none"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "matched"],
    surfaceTexture: ["smooth", "luxury"],
  },
  {
    personality: "conf",
    gender: "female",
    fashionStyle: "streetwear",
    printType: ["geometric", "none"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "matched"],
    surfaceTexture: ["smooth", "textured"],
  },
  {
    personality: "conf",
    gender: "female",
    fashionStyle: "athleisure",
    printType: ["geometric", "none"],
    printScale: ["small", "medium"],
    printDensity: ["low", "medium"],
    patternPlacement: ["centered", "matched"],
    surfaceTexture: ["technical", "smooth"],
  },
];
