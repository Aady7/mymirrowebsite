import { FIT_MAPPING_DATA, FitMappingEntry } from "../data/mappingData";
import { QuestionMappingEntry, QUESTION_MAPPING_DATA } from "../data/mappingData";

import { PATTERN_CHARACTERISTICS_DATA, PatternCharacteristicsEntry } from "../data/mappingData";

interface FitTagsInput {
  gender: string;
  bodyType: string;
}

interface PersonalityMapInput {
  weekendPreference?: string;
  shoppingStyle?: string;
  workspaceStyle?: string;
  friendCompliments?: string;
  workOutfit?: string;
  wardrobeContent?: string;
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



export function generateFitTags({ gender, bodyType }: FitTagsInput): string[] {
  // Convert inputs to lowercase for consistent matching
  const normalizedGender = gender.toLowerCase();
  const normalizedBodyType = bodyType.toLowerCase();

  // Filter the mapping data to get all fits for the given gender and body type
  const matchingFits = FIT_MAPPING_DATA.filter(
    (entry) => 
      entry.gender === normalizedGender &&
      entry.bodyType === normalizedBodyType
  );

  // Extract unique fits
  const fitTags = [...new Set(matchingFits.map((entry) => entry.fit))];
  
  // Return unique tags
  return fitTags;
}


export function generatePersonalityTags({ 
  weekendPreference,
  shoppingStyle,
  workspaceStyle,
  friendCompliments,
  workOutfit,
  wardrobeContent
}: PersonalityMapInput): string[] {
  // Convert inputs to lowercase for consistent matching
  const normalizedInputs: { [key: string]: string } = {
    weekendPreference: weekendPreference?.toLowerCase() || '',
    shoppingStyle: shoppingStyle?.toLowerCase() || '',
    workspaceStyle: workspaceStyle?.toLowerCase() || '',
    friendCompliments: friendCompliments?.toLowerCase() || '',
    workOutfit: workOutfit?.toLowerCase() || '',
    wardrobeContent: wardrobeContent?.toLowerCase() || ''
  };

  // Create a map to count occurrences of each personality tag
  const tagCounts: { [key: string]: number } = {};

  // Process each answer and accumulate personality tag counts
  Object.entries(normalizedInputs).forEach(([questionKey, answer]) => {
    if (!answer) return; // Skip empty answers

    // Find the matching question entry
    const matchingEntry = QUESTION_MAPPING_DATA.find(
      entry => entry.questionKey === questionKey && entry.option.toLowerCase() === answer
    );

    // If we found a match, count its personality tags
    if (matchingEntry) {
      matchingEntry.personalityTags.forEach(tag => {
        // Primary tags (first in the array) get more weight
        const weight = matchingEntry.personalityTags.indexOf(tag) === 0 ? 2 : 1;
        tagCounts[tag] = (tagCounts[tag] || 0) + weight;
      });
    }
  });

  // Convert the counts to an array and sort by frequency
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => {
      // Sort by count first (descending)
      const countDiff = b[1] - a[1];
      if (countDiff !== 0) return countDiff;
      // If counts are equal, sort alphabetically
      return a[0].localeCompare(b[0]);
    })
    .map(([tag]) => tag);
    console.log(sortedTags.slice(0,2));

  // Return the top 2  personality tags (since we have more questions now)
  return sortedTags.slice(0,2);
 
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