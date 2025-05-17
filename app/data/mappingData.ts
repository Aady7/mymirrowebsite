
  export interface FitMappingEntry {
    gender: string;
    bodyType: string;
    fit: string;
  }
  
  // All values are lowercase for consistent matching
  export const FIT_MAPPING_DATA: FitMappingEntry[] = [
    { gender: 'female', bodyType: 'hourglass', fit: 'bodycon' },
    { gender: 'female', bodyType: 'hourglass', fit: 'fitted' },
    { gender: 'female', bodyType: 'hourglass', fit: 'fitted at waist' },
    { gender: 'female', bodyType: 'hourglass', fit: 'flared fit' },
    { gender: 'female', bodyType: 'hourglass', fit: 'slim fit' },
    { gender: 'female', bodyType: 'hourglass', fit: 'tailored fit' },
    { gender: 'female', bodyType: 'inverted triangle', fit: 'fitted' },
    { gender: 'female', bodyType: 'inverted triangle', fit: 'loose fit' },
    { gender: 'female', bodyType: 'inverted triangle', fit: 'oversized fit' },
    { gender: 'female', bodyType: 'inverted triangle', fit: 'relaxed fit' },
    { gender: 'female', bodyType: 'inverted triangle', fit: 'tailored fit' },
    { gender: 'female', bodyType: 'inverted triangle', fit: 'tight fit' },
    { gender: 'female', bodyType: 'oval', fit: 'bodycon' },
    { gender: 'female', bodyType: 'oval', fit: 'fitted' },
    { gender: 'female', bodyType: 'oval', fit: 'fitted at waist' },
    { gender: 'female', bodyType: 'oval', fit: 'flared fit' },
    { gender: 'female', bodyType: 'oval', fit: 'loose fit' },
    { gender: 'female', bodyType: 'oval', fit: 'oversized fit' },
    { gender: 'female', bodyType: 'oval', fit: 'relaxed fit' },
    { gender: 'female', bodyType: 'oval', fit: 'slim fit' },
    { gender: 'female', bodyType: 'rectangle', fit: 'boxy fit' },
    { gender: 'female', bodyType: 'rectangle', fit: 'loose fit' },
    { gender: 'female', bodyType: 'rectangle', fit: 'relaxed fit' },
    { gender: 'female', bodyType: 'rectangle', fit: 'straight fit' },
    { gender: 'male', bodyType: 'inverted triangle', fit: 'boxy fit' },
    { gender: 'male', bodyType: 'inverted triangle', fit: 'fitted' },
    { gender: 'male', bodyType: 'inverted triangle', fit: 'loose fit' },
    { gender: 'male', bodyType: 'inverted triangle', fit: 'relaxed fit' },
    { gender: 'male', bodyType: 'inverted triangle', fit: 'slim fit' },
    { gender: 'male', bodyType: 'inverted triangle', fit: 'tailored fit' },
    { gender: 'male', bodyType: 'inverted triangle', fit: 'tapered fit' },
    { gender: 'male', bodyType: 'oval', fit: 'boxy fit' },
    { gender: 'male', bodyType: 'oval', fit: 'fitted' },
    { gender: 'male', bodyType: 'oval', fit: 'loose fit' },
    { gender: 'male', bodyType: 'oval', fit: 'regular fit' },
    { gender: 'male', bodyType: 'oval', fit: 'relaxed fit' },
    { gender: 'male', bodyType: 'oval', fit: 'slim fit' },
    { gender: 'male', bodyType: 'oval', fit: 'straight fit' },
    { gender: 'male', bodyType: 'oval', fit: 'tapered fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'boxy fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'classic fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'fitted' },
    { gender: 'male', bodyType: 'rectangle', fit: 'loose fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'regular fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'relaxed fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'slim fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'straight fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'tapered fit' },
    { gender: 'male', bodyType: 'rectangle', fit: 'wide fit' },
    { gender: 'male', bodyType: 'triangle', fit: 'boxy fit' },
    { gender: 'male', bodyType: 'triangle', fit: 'fitted' },
    { gender: 'male', bodyType: 'triangle', fit: 'loose fit' },
    { gender: 'male', bodyType: 'triangle', fit: 'slim fit' },
    { gender: 'male', bodyType: 'triangle', fit: 'tapered fit' },
  ];
  export interface QuestionMappingEntry {
    questionKey: string;       // identifier for the question
    option: string;            // the exact option text (lowercase)
    personalityTags: string[]; // lowercase tags
  }
  
  /**
   * Mappings of each possible answer option to its personality tags.
   * All text is lowercase for consistent matching.
   */
  export const QUESTION_MAPPING_DATA: QuestionMappingEntry[] = [
    // Your alarm rings
    { questionKey: 'alarmRings', option: 'snooze 5 times', personalityTags: ['mo', 'intr'] },
    { questionKey: 'alarmRings', option: 'jump out like a hero', personalityTags: ['rl', 'pl'] },
    { questionKey: 'alarmRings', option: 'check whatsapp or insta first', personalityTags: ['mo', 'sc'] },
    { questionKey: 'alarmRings', option: 'mentally plan your outfit', personalityTags: ['pl', 'ex'] },
    
    // Your friend cancels plans
    { questionKey: 'friendCancels', option: 'feel secretly relieved - solo time hits different', personalityTags: ['intr', 'rl'] },
    { questionKey: 'friendCancels', option: 'still getting ready. plans or no plans', personalityTags: ['ex', 'mo'] },
    { questionKey: 'friendCancels', option: 'spam them with memes and voice notes', personalityTags: ['sc', 'ex'] },
    { questionKey: 'friendCancels', option: 'that is  my cue to finish a side project', personalityTags: ['in', 'intr'] },
    
    // Your friends are running late
    { questionKey: 'friendsLate', option: 'already there, slightly annoyed but chill', personalityTags: ['rl', 'pl'] },
    { questionKey: 'friendsLate', option: 'oh crap. i completely lost track of time', personalityTags: ['mo', 'intr'] },
    { questionKey: 'friendsLate', option: 'texting "on my way"… while still wrapped in a blanket', personalityTags: ['mo', 'rb'] },
    { questionKey: 'friendsLate', option: 'chilling. music on, snacks ready. i like the pause', personalityTags: ['intr', 'mo'] },
    
    // Go-to selfie face?
    { questionKey: 'selfieFace', option: 'smirk or pout', personalityTags: ['ex', 'sc'] },
    { questionKey: 'selfieFace', option: 'laughing candid', personalityTags: ['sc', 'mo'] },
    { questionKey: 'selfieFace', option: 'serious side profile', personalityTags: ['in', 'rl'] },
    { questionKey: 'selfieFace', option: 'not into selfies', personalityTags: ['intr', 'in'] },
    
    // How often do you plan outfits?
    { questionKey: 'planOutfits', option: 'just for events', personalityTags: ['rl', 'pl'] },
    { questionKey: 'planOutfits', option: 'every. single. day.', personalityTags: ['ex', 'pl'] },
    { questionKey: 'planOutfits', option: 'whatever is  clean', personalityTags: ['mo', 'rb'] },
    { questionKey: 'planOutfits', option: 'mood-based chaos', personalityTags: ['mo', 'in'] },
    
    // What do people compliment you on?
    { questionKey: 'peopleCompliment', option: 'love your style — always bold', personalityTags: ['ex', 'rb'] },
    { questionKey: 'peopleCompliment', option: 'you are such a vibe booster', personalityTags: ['sc', 'ex'] },
    { questionKey: 'peopleCompliment', option: 'you are so honest and grounded', personalityTags: ['in', 'rl'] },
    { questionKey: 'peopleCompliment', option: 'you have a really calming presence', personalityTags: ['intr', 'mo'] },
  ];
  
  export interface PatternMappingEntry {
    gender: string;
    personalityTag: string; // code only: ex, in, mo, rb, pl, intr, sc, rl
    styleType: string;
    patterns: string[];
  }
  
  export const PATTERN_MAPPING_DATA: PatternMappingEntry[] = [
    { gender: 'men',    personalityTag: 'ex',   styleType: 'business casual', patterns: ['pinstripes', 'windowpane checks', 'glen plaid', 'polka dots'] },
    { gender: 'men',    personalityTag: 'ex',   styleType: 'streetwear',      patterns: ['camo', 'tie-dye', 'graphic prints', 'floral prints'] },
    { gender: 'men',    personalityTag: 'ex',   styleType: 'athleisure',      patterns: ['color blocking', 'stripes', 'geometric prints', 'neon highlights'] },
    { gender: 'men',    personalityTag: 'in',   styleType: 'business casual', patterns: ['herringbone', 'birdseye', 'micro prints', 'solid with texture'] },
    { gender: 'men',    personalityTag: 'in',   styleType: 'streetwear',      patterns: ['plaid', 'camo', 'geometric prints', 'polka dots'] },
    { gender: 'men',    personalityTag: 'in',   styleType: 'athleisure',      patterns: ['geometric prints', 'abstract prints', 'space dye', 'tie-dye'] },
    { gender: 'men',    personalityTag: 'mo',   styleType: 'business casual', patterns: ['micro prints', 'houndstooth', 'solid', 'textured fabrics'] },
    { gender: 'men',    personalityTag: 'mo',   styleType: 'streetwear',      patterns: ['tie-dye', 'paisley', 'graphic prints', 'animal prints'] },
    { gender: 'men',    personalityTag: 'mo',   styleType: 'athleisure',      patterns: ['tie-dye', 'ombre', 'geometric prints', 'space dye'] },
    { gender: 'men',    personalityTag: 'rb',   styleType: 'business casual', patterns: ['bold plaid', 'pinstripes with color', 'abstract geometric', 'polka dots'] },
    { gender: 'men',    personalityTag: 'rb',   styleType: 'streetwear',      patterns: ['camo', 'tie-dye', 'graphic prints', 'floral prints'] },
    { gender: 'men',    personalityTag: 'rb',   styleType: 'athleisure',      patterns: ['color blocking', 'neon highlights', 'geometric prints', 'chevron'] },
    { gender: 'men',    personalityTag: 'pl',   styleType: 'business casual', patterns: ['glen plaid', 'tattersall', 'micro-prints', 'stripes'] },
    { gender: 'men',    personalityTag: 'pl',   styleType: 'streetwear',      patterns: ['plaid', 'paisley', 'camo', 'geometric'] },
    { gender: 'men',    personalityTag: 'pl',   styleType: 'athleisure',      patterns: ['ombre', 'geometric', 'space dye', 'stripes'] },
    { gender: 'men',    personalityTag: 'intr', styleType: 'business casual', patterns: ['herringbone', 'pinstripes', 'solid with texture', 'subtle plaid'] },
    { gender: 'men',    personalityTag: 'intr', styleType: 'streetwear',      patterns: ['plaid', 'camo', 'animal prints', 'polka dots'] },
    { gender: 'men',    personalityTag: 'intr', styleType: 'athleisure',      patterns: ['space dye', 'tie-dye', 'geometric', 'subtle ombre'] },
    { gender: 'men',    personalityTag: 'sc',   styleType: 'business casual', patterns: ['gingham checks', 'glen plaid', 'tattersall'] },
    { gender: 'men',    personalityTag: 'sc',   styleType: 'streetwear',      patterns: ['graphic prints', 'camo', 'paisley', 'tie-dye'] },
    { gender: 'men',    personalityTag: 'sc',   styleType: 'athleisure',      patterns: ['stripes', 'color blocking', 'geometric prints', 'ombre'] },
    { gender: 'men',    personalityTag: 'rl',   styleType: 'business casual', patterns: ['solid', 'stripes', 'houndstooth', 'polka dots'] },
    { gender: 'men',    personalityTag: 'rl',   styleType: 'streetwear',      patterns: ['camo', 'plaid', 'logo prints', 'polka dots'] },
    { gender: 'men',    personalityTag: 'rl',   styleType: 'athleisure',      patterns: ['stripes', 'space dye', 'geometric prints', 'ombre'] },
    { gender: 'women',  personalityTag: 'ex',   styleType: 'business casual', patterns: ['pinstripes', 'windowpane checks', 'glen plaid', 'polka dots'] },
    { gender: 'women',  personalityTag: 'ex',   styleType: 'streetwear',      patterns: ['camo', 'tie-dye', 'graphic prints', 'floral prints'] },
    { gender: 'women',  personalityTag: 'ex',   styleType: 'athleisure',      patterns: ['color blocking', 'stripes', 'geometric prints', 'neon highlights'] },
    { gender: 'women',  personalityTag: 'in',   styleType: 'business casual', patterns: ['herringbone', 'birdseye', 'micro prints', 'solid with texture'] },
    { gender: 'women',  personalityTag: 'in',   styleType: 'streetwear',      patterns: ['plaid', 'camo', 'geometric prints', 'polka dots'] },
    { gender: 'women',  personalityTag: 'in',   styleType: 'athleisure',      patterns: ['geometric prints', 'abstract prints', 'space dye', 'tie-dye'] },
    { gender: 'women',  personalityTag: 'mo',   styleType: 'business casual', patterns: ['micro prints', 'houndstooth', 'solid', 'textured fabrics'] },
    { gender: 'women',  personalityTag: 'mo',   styleType: 'streetwear',      patterns: ['tie-dye', 'paisley', 'graphic prints', 'animal prints'] },
    { gender: 'women',  personalityTag: 'mo',   styleType: 'athleisure',      patterns: ['tie-dye', 'ombre', 'geometric prints', 'space dye'] },
    { gender: 'women',  personalityTag: 'rb',   styleType: 'business casual', patterns: ['bold plaid', 'pinstripes with color', 'abstract geometric', 'polka dots'] },
    { gender: 'women',  personalityTag: 'rb',   styleType: 'streetwear',      patterns: ['camo', 'tie-dye', 'graphic prints', 'floral prints'] },
    { gender: 'women',  personalityTag: 'rb',   styleType: 'athleisure',      patterns: ['color blocking', 'neon highlights', 'geometric prints', 'chevron'] },
    { gender: 'women',  personalityTag: 'pl',   styleType: 'business casual', patterns: ['glen plaid', 'tattersall', 'micro-prints', 'stripes'] },
    { gender: 'women',  personalityTag: 'pl',   styleType: 'streetwear',      patterns: ['plaid', 'paisley', 'camo', 'geometric'] },
    { gender: 'women',  personalityTag: 'pl',   styleType: 'athleisure',      patterns: ['ombre', 'geometric', 'space dye', 'stripes'] },
    { gender: 'women',  personalityTag: 'intr', styleType: 'business casual', patterns: ['herringbone', 'pinstripes', 'solid with texture', 'subtle plaid'] },
    { gender: 'women',  personalityTag: 'intr', styleType: 'streetwear',      patterns: ['plaid', 'camo', 'animal prints', 'polka dots'] },
    { gender: 'women',  personalityTag: 'intr', styleType: 'athleisure',      patterns: ['space dye', 'tie-dye', 'geometric', 'subtle ombre'] },
    { gender: 'women',  personalityTag: 'sc',   styleType: 'business casual', patterns: ['polka dots', 'gingham checks', 'glen plaid', 'tattersall'] },
    { gender: 'women',  personalityTag: 'sc',   styleType: 'streetwear',      patterns: ['graphic prints', 'camo', 'paisley', 'tie-dye'] },
    { gender: 'women',  personalityTag: 'sc',   styleType: 'athleisure',      patterns: ['stripes', 'color blocking', 'geometric prints', 'ombre'] },
    { gender: 'women',  personalityTag: 'rl',   styleType: 'business casual', patterns: ['solid', 'stripes', 'houndstooth', 'polka dots'] },
    { gender: 'women',  personalityTag: 'rl',   styleType: 'streetwear',      patterns: ['camo', 'plaid', 'logo prints', 'polka dots'] },
    { gender: 'women',  personalityTag: 'rl',   styleType: 'athleisure',      patterns: ['stripes', 'space dye', 'geometric prints', 'ombre'] },
  ];
  