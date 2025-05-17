import { FIT_MAPPING_DATA, FitMappingEntry } from "../data/mappingData";
import { QuestionMappingEntry, QUESTION_MAPPING_DATA } from "../data/mappingData";
import  {PATTERN_MAPPING_DATA, PatternMappingEntry } from "../data/mappingData"

interface FitTagsInput {
  gender: string;
  bodyType: string;
}

interface PersonalityMapInput{
    alarmRings: string;
    friendCancels: string;
    friendsLate: string;
    selfieFace: string;
    planOutfit: string;
    peopleCompliment: string;
}

interface PatternTagsInput {
  gender: string;
  personalityTags: string[];
  styleTypes: string[];
}

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

 
  
  // Combine specific and universal tags, ensure uniqueness
  return [...new Set([...fitTags])];
}


export function generatePersonalityTags({ alarmRings, friendCancels, friendsLate, selfieFace, planOutfit, peopleCompliment }: PersonalityMapInput): string[] {
  // Convert inputs to lowercase for consistent matching
  const normalizedInputs = {
    alarmRings: alarmRings.toLowerCase(),
    friendCancels: friendCancels.toLowerCase(),
    friendsLate: friendsLate.toLowerCase(),
    selfieFace: selfieFace.toLowerCase(),
    planOutfits: planOutfit.toLowerCase(),
    peopleCompliment: peopleCompliment.toLowerCase()
  };

  // Create a map to count occurrences of each personality tag
  const tagCounts: { [key: string]: number } = {};

  // Process each answer and accumulate personality tag counts
  Object.entries(normalizedInputs).forEach(([questionKey, answer]) => {
    // Find the matching question entry
    const matchingEntry = QUESTION_MAPPING_DATA.find(
      entry => entry.questionKey === questionKey && entry.option === answer
    );

    // If we found a match, count its personality tags
    if (matchingEntry) {
      matchingEntry.personalityTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
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

  // Return the top 2 personality tags (or all if less than 2)
  return sortedTags.slice(0, 2);
}

export function generatePatternTags({ gender, personalityTags, styleTypes }: PatternTagsInput): string[] {
  // Normalize inputs
  const normalizedGender = gender.toLowerCase() === 'male' ? 'men' : 'women';
  const normalizedStyleTypes = styleTypes.map(style => style.toLowerCase());

  // Get all pattern entries for this gender and style types
  const relevantPatterns = PATTERN_MAPPING_DATA.filter(entry => 
    entry.gender === normalizedGender && 
    normalizedStyleTypes.includes(entry.styleType) &&
    personalityTags.includes(entry.personalityTag)
  );

  // Extract all patterns and remove duplicates
  const allPatterns = relevantPatterns.reduce((acc, entry) => {
    entry.patterns.forEach(pattern => {
      if (!acc.includes(pattern)) {
        acc.push(pattern);
      }
    });
    return acc;
  }, [] as string[]);

  return allPatterns;
}




