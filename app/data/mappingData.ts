  export interface FitMappingEntry {
    gender: string;
    bodyType: string;
    fit: string;
  }
  
  // All values are lowercase for consistent matching
  export const FIT_MAPPING_DATA: FitMappingEntry[] = [
  { gender: "female", bodyType: "hourglass", fit: "bodycon" },
  { gender: "female", bodyType: "hourglass", fit: "fitted" },
  { gender: "female", bodyType: "hourglass", fit: "fitted at waist" },
  { gender: "female", bodyType: "hourglass", fit: "flared fit" },
  { gender: "female", bodyType: "hourglass", fit: "slim fit" },
  { gender: "female", bodyType: "hourglass", fit: "tailored fit" },
  { gender: "female", bodyType: "inverted triangle", fit: "fitted" },
  { gender: "female", bodyType: "inverted triangle", fit: "loose fit" },
  { gender: "female", bodyType: "inverted triangle", fit: "oversized fit" },
  { gender: "female", bodyType: "inverted triangle", fit: "relaxed fit" },
  { gender: "female", bodyType: "inverted triangle", fit: "tailored fit" },
  { gender: "female", bodyType: "inverted triangle", fit: "tight fit" },
  { gender: "female", bodyType: "oval", fit: "bodycon" },
  { gender: "female", bodyType: "oval", fit: "fitted" },
  { gender: "female", bodyType: "oval", fit: "fitted at waist" },
  { gender: "female", bodyType: "oval", fit: "flared fit" },
  { gender: "female", bodyType: "oval", fit: "loose fit" },
  { gender: "female", bodyType: "oval", fit: "oversized fit" },
  { gender: "female", bodyType: "oval", fit: "relaxed fit" },
  { gender: "female", bodyType: "oval", fit: "slim fit" },
  { gender: "female", bodyType: "rectangle", fit: "boxy fit" },
  { gender: "female", bodyType: "rectangle", fit: "loose fit" },
  { gender: "female", bodyType: "rectangle", fit: "relaxed fit" },
  { gender: "female", bodyType: "rectangle", fit: "straight fit" },
  { gender: "male", bodyType: "inverted triangle", fit: "boxy fit" },
  { gender: "male", bodyType: "inverted triangle", fit: "fitted" },
  { gender: "male", bodyType: "inverted triangle", fit: "loose fit" },
  { gender: "male", bodyType: "inverted triangle", fit: "relaxed fit" },
  { gender: "male", bodyType: "inverted triangle", fit: "slim fit" },
  { gender: "male", bodyType: "inverted triangle", fit: "tailored fit" },
  { gender: "male", bodyType: "inverted triangle", fit: "tapered fit" },
  { gender: "male", bodyType: "oval", fit: "boxy fit" },
  { gender: "male", bodyType: "oval", fit: "fitted" },
  { gender: "male", bodyType: "oval", fit: "loose fit" },
  { gender: "male", bodyType: "oval", fit: "regular fit" },
  { gender: "male", bodyType: "oval", fit: "relaxed fit" },
  { gender: "male", bodyType: "oval", fit: "slim fit" },
  { gender: "male", bodyType: "oval", fit: "straight fit" },
  { gender: "male", bodyType: "oval", fit: "tapered fit" },
  { gender: "male", bodyType: "rectangle", fit: "boxy fit" },
  { gender: "male", bodyType: "rectangle", fit: "classic fit" },
  { gender: "male", bodyType: "rectangle", fit: "fitted" },
  { gender: "male", bodyType: "rectangle", fit: "loose fit" },
  { gender: "male", bodyType: "rectangle", fit: "regular fit" },
  { gender: "male", bodyType: "rectangle", fit: "relaxed fit" },
  { gender: "male", bodyType: "rectangle", fit: "slim fit" },
  { gender: "male", bodyType: "rectangle", fit: "straight fit" },
  { gender: "male", bodyType: "rectangle", fit: "tapered fit" },
  { gender: "male", bodyType: "rectangle", fit: "wide fit" },
  { gender: "male", bodyType: "triangle", fit: "boxy fit" },
  { gender: "male", bodyType: "triangle", fit: "fitted" },
  { gender: "male", bodyType: "triangle", fit: "loose fit" },
  { gender: "male", bodyType: "triangle", fit: "slim fit" },
  { gender: "male", bodyType: "triangle", fit: "tapered fit" },
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
    option: "PJ bottoms, OTT binge, snack delivery",
    personalityTags: ["comf", "mini"],
  },
  {
    questionKey: "weekendPreference",
    option: "Trying the café that blew up on Reels this week",
    personalityTags: ["trend", "sc"],
  },
  {
    questionKey: "weekendPreference",
    option: "Evening run club / badminton game, then coconut water",
    personalityTags: ["prac", "comf"],
  },
  {
    questionKey: "weekendPreference",
    option: "Tickets to an indie stand-up or art gig you found on BookMyShow",
    personalityTags: ["ex", "rb"],
  },

  // Shopping Style (Q2)
  {
    questionKey: "shoppingStyle",
    option: "Premium brand that screams success",
    personalityTags: ["stat", "conf"],
  },
  {
    questionKey: "shoppingStyle",
    option: "Eye-catching, one-of-a-kind collab to flex creativity",
    personalityTags: ["bold", "ex"],
  },
  {
    questionKey: "shoppingStyle",
    option: "Reliable classic label you've trusted for years",
    personalityTags: ["trad", "pl"],
  },
  {
    questionKey: "shoppingStyle",
    option: "Spreadsheet of specs, coupon codes, top reviews—then checkout",
    personalityTags: ["pl", "prac"],
  },

  // Workspace Style (Q3)
  {
    questionKey: "workspaceStyle",
    option: "Clean, neutral desk with only the essentials",
    personalityTags: ["mini", "pl"],
  },
  {
    questionKey: "workspaceStyle",
    option: "Cushions, snack bowl, foot-rest—comfort paradise",
    personalityTags: ["comf", "prac"],
  },
  {
    questionKey: "workspaceStyle",
    option: "Sleek gadgets, wireless everything—LinkedIn-ad vibe",
    personalityTags: ["conf", "stat"],
  },
  {
    questionKey: "workspaceStyle",
    option: "Random gifts, ticket stubs, action figures—fun chaos",
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
    option: "Your organised, thoughtful, Google-Sheet-for-everything approach",
    personalityTags: ["pl", "conf"],
  },

  // Work Outfit (Q5)
  {
    questionKey: "workOutfit",
    option: "Tailored blazer, crisp shirt—power stance",
    personalityTags: ["conf", "stat"],
  },
  {
    questionKey: "workOutfit",
    option: "Lightweight cotton set—polished yet breathable",
    personalityTags: ["prac", "comf"],
  },
  {
    questionKey: "workOutfit",
    option: "Statement jacket / saree detail that shows personality",
    personalityTags: ["ex", "bold"],
  },
  {
    questionKey: "workOutfit",
    option: "Timeless white kurta-pyjama or sober suit",
    personalityTags: ["trad", "mini"],
  },

  // Wardrobe Content (Q6)
  {
    questionKey: "wardrobeContent",
    option: "Designer labels or premium pieces you treasure",
    personalityTags: ["stat", "bold"],
  },
  {
    questionKey: "wardrobeContent",
    option: "Neutral basics that mix-and-match effortlessly",
    personalityTags: ["mini", "comf"],
  },
  {
    questionKey: "wardrobeContent",
    option: "Curated ethnic + western classics, all paired up",
    personalityTags: ["sc", "trend"],
  },
  {
    questionKey: "wardrobeContent",
    option: "Eclectic thrift finds, DIY patches—totally you",
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
  