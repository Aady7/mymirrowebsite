import { FIT_MAPPING_DATA, FitMappingEntry } from "@/app/data/mappingData";
import { QuestionMappingEntry, QUESTION_MAPPING_DATA } from "@/app/data/mappingData";

import { PATTERN_CHARACTERISTICS_DATA, PatternCharacteristicsEntry } from "@/app/data/mappingData";

interface FitTagsInput {
  gender: string;
  bodyType: string;
}

interface CategorizedFitTags {
  upperWear: string[];
  lowerWear: string[];
  fullBody: string[];
}

interface PersonalityMapInput {
  weekendPreference?: string[];
  shoppingStyle?: string[];
  workspaceStyle?: string[];
  friendCompliments?: string[];
  workOutfit?: string[];
  wardrobeContent?: string[];
}

type PatternCharacteristicsTagsInput = {
  gender: string;
  personalityTags: string[];
  styleTypes: string[];
};

type PatternCharacteristicsOutput = {
  printTypes: string[];
  printScales: string[];
  printDensities: string[];
  patternPlacements: string[];
  surfaceTextures: string[];
};



export function generateFitTags({ gender, bodyType }: FitTagsInput): CategorizedFitTags {
  // Convert inputs to lowercase for consistent matching
  const normalizedGender = gender.toLowerCase() === "male" ? "men" : "women";
  const normalizedBodyType = bodyType.toLowerCase();

  console.log("Searching fits for:", { normalizedGender, normalizedBodyType });

  // Filter the mapping data to get all fits for the given gender and body type
  const matchingFits = FIT_MAPPING_DATA.filter(
    (entry) => 
      entry.gender === normalizedGender &&
      entry.bodyShape === normalizedBodyType
  );

  console.log("Found matching fits:", matchingFits);

  if (matchingFits.length === 0) {
    console.warn(`No matching fits found for gender: ${normalizedGender}, body type: ${normalizedBodyType}`);
    // Return default fits if no matches found
    const defaultFits: CategorizedFitTags = {
      upperWear: ["regular", "fitted"],
      lowerWear: ["regular", "straight"],
      fullBody: normalizedGender === "women" ? ["regular", "a-line"] : []
    };
    return defaultFits;
  }

  // Initialize result object
  const result: CategorizedFitTags = {
    upperWear: [],
    lowerWear: [],
    fullBody: []
  };

  // Categorize fits based on category
  matchingFits.forEach((entry) => {
    if (!entry.recommendedFits || !Array.isArray(entry.recommendedFits)) {
      console.warn(`Invalid recommendedFits for entry:`, entry);
      return;
    }

    switch (entry.category) {
      case "upper wear":
        result.upperWear.push(...entry.recommendedFits);
        break;
      case "lower wear":
        result.lowerWear.push(...entry.recommendedFits);
        break;
      case "full body":
        result.fullBody.push(...entry.recommendedFits);
        break;
      default:
        console.warn(`Unknown category: ${entry.category}`);
    }
  });

  // Remove duplicates from each category
  result.upperWear = [...new Set(result.upperWear)];
  result.lowerWear = [...new Set(result.lowerWear)];
  result.fullBody = [...new Set(result.fullBody)];

  console.log("Generated fit tags:", result);
  return result;
}


export function generatePersonalityTags({ 
  weekendPreference,
  shoppingStyle,
  workspaceStyle,
  friendCompliments,
  workOutfit,
  wardrobeContent
}: PersonalityMapInput): string[] {
  // Initialize tag counts
  const tagCounts: { [key: string]: number } = {};

  // Helper function to process answers for a question
  const processAnswers = (questionKey: string, answers: string[] = []) => {
    answers.forEach(answer => {
      const normalizedAnswer = answer.toLowerCase();
      
      // Find all matching entries for this answer
      const matchingEntries = QUESTION_MAPPING_DATA.filter(
        entry => entry.questionKey === questionKey && entry.option.toLowerCase() === normalizedAnswer
      );

      matchingEntries.forEach(entry => {
        entry.personalityTags.forEach((tag, index) => {
          // Primary tags (first in array) get more weight
          const weight = index === 0 ? 2 : 1;
          tagCounts[tag] = (tagCounts[tag] || 0) + weight;
        });
      });
    });
  };

  // Process each question's answers
  processAnswers('weekendPreference', weekendPreference);
  processAnswers('shoppingStyle', shoppingStyle);
  processAnswers('workspaceStyle', workspaceStyle);
  processAnswers('friendCompliments', friendCompliments);
  processAnswers('workOutfit', workOutfit);
  processAnswers('wardrobeContent', wardrobeContent);

  // Convert counts to sorted array of tags
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => {
      // Sort by count first (descending)
      const countDiff = b[1] - a[1];
      if (countDiff !== 0) return countDiff;
      // If counts are equal, sort alphabetically
      return a[0].localeCompare(b[0]);
    })
    .map(([tag]) => tag);

  console.log("Generated personality tags:", sortedTags.slice(0, 3));
  
  // Return top 3 personality tags (increased from 2 since we now have multiple selections)
  return sortedTags.slice(0, 2);
}



export function generatePrintTags({
  gender,
  personalityTags,
  styleTypes
}: PatternCharacteristicsTagsInput): PatternCharacteristicsOutput {
  // Normalize inputs
  const normalizedGender = gender.toLowerCase();
  const normalizedPersonalityTags = personalityTags.map(tag => tag.toLowerCase());
  const normalizedStyleTypes = styleTypes.map(style => style.toLowerCase());
 
  console.log("Input:", { normalizedGender, normalizedPersonalityTags, normalizedStyleTypes });

  // Get all matching entries where either personality or style matches
  const matchingPrintTags = PATTERN_CHARACTERISTICS_DATA.filter(
    (entry) =>
      entry.gender === normalizedGender && (
        // Match if ANY of the personality tags match OR ANY of the style types match
        normalizedPersonalityTags.some(tag => entry.personality === tag) ||
        normalizedStyleTypes.some(style => entry.fashionStyle === style)
      )
  );

  console.log("matchingPrintTags:", matchingPrintTags);

  // Initialize result with empty arrays
  const result: PatternCharacteristicsOutput = {
    printTypes: [],
    printScales: [],
    printDensities: [],
    patternPlacements: [],
    surfaceTextures: []
  };

  // Aggregate all characteristics
  for (const entry of matchingPrintTags) {
    if (entry.printType) result.printTypes.push(...entry.printType);
    if (entry.printScale) result.printScales.push(...entry.printScale);
    if (entry.printDensity) result.printDensities.push(...entry.printDensity);
    if (entry.patternPlacement) result.patternPlacements.push(...entry.patternPlacement);
    if (entry.surfaceTexture) result.surfaceTextures.push(...entry.surfaceTexture);
  }

  // Deduplicate and return
  const finalResult = {
    printTypes: [...new Set(result.printTypes)],
    printScales: [...new Set(result.printScales)],
    printDensities: [...new Set(result.printDensities)],
    patternPlacements: [...new Set(result.patternPlacements)],
    surfaceTextures: [...new Set(result.surfaceTextures)]
  };

  console.log("Final result:", finalResult);
  return finalResult;
}