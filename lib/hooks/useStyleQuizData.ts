import { useState, useEffect, useRef } from 'react';
import { getStyleQuizData } from '@/app/utils/styleQuizUtils';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/utils/cache';



export interface ColorAnalysis {
  method: string;
  selectedHex: string;
  selectedToneName: string;
  undertone: string;
  fitzpatrick_scale: string;
  recommended_colours: {
    Formal: [string, string][];
    Streetwear: [string, string][];
    Athleisure: [string, string][];
  };
  color_family: {
    Formal: string[];
    Streetwear: string[];
    Athleisure: string[];
  };
  hex_codes: {
    Formal: string[];
    Streetwear: string[];
    Athleisure: string[];
  };
  analysis_metadata: {
    lab_values: number[];
    skin_pixel_count: number;
    total_pixels: number;
    input_method: string;
    input_hex: string;
  };
  isComplete: boolean;
  timestamp: string;
}

export interface UserTagsData {
  personality_tags: string[];
  fit_tags_upper: string[];
  fit_tags_lower: string[];
  fit_tags_full: string[];
  print_type_tags: string[];
  print_scale_tags: string[];
  print_density_tags: string[];
  pattern_placement_tags: string[];
  surface_texture_tags: string[];
}

export interface StyleQuizData {
  name: string;
  color_analysis: string;
  color_family: string;
  hex_codes: string;
  gender: string;
  body_shape: string;
  upperWear: string;
  waistSize: string;
  outfitAdventurous: string[];
  minimalistic: string;
  goToStyle: string[];
  feedback: string;
  user_tags: UserTagsData[] | string; // Database column name
  usertags?: UserTagsData[]; // Processed field for component compatibility
  weekendPreference: string;
  shoppingStyle: string;
  workspaceStyle: string;
  friendCompliments: string;
  workOutfit: string;
  wardrobeContent: string;
  personality_tag_1:string;
  personality_tag_2:string;
  

  // Add other fields as needed
}

export const useStyleQuizData = () => {
  const [quizData, setQuizData] = useState<StyleQuizData | null>(null);
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<(StyleQuizData & { usertags: UserTagsData[] }) | null>(null);
  const hasFetchedRef = useRef(false);

  const parseColorData = (data: StyleQuizData) => {
    try {
      // Parse all color-related columns
      const parsedColorAnalysis = JSON.parse(data.color_analysis);
      const parsedColorFamily = data.color_family ? JSON.parse(data.color_family) : null;
      const parsedHexCodes = data.hex_codes ? JSON.parse(data.hex_codes) : null;

      // Validate the parsed data has the required structure
      if (
        parsedColorAnalysis.method &&
        parsedColorAnalysis.recommended_colours &&
        parsedColorAnalysis.analysis_metadata &&
        parsedColorFamily &&
        parsedHexCodes
      ) {
        // Merge all color data into one object
        return {
          ...parsedColorAnalysis,
          color_family: parsedColorFamily,
          hex_codes: parsedHexCodes
        };
      } else {
        throw new Error("Invalid or missing color data structure");
      }
    } catch (e) {
      console.error("Error parsing color data:", e);
      throw e;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Prevent duplicate calls in React Strict Mode
      if (hasFetchedRef.current) {
        return;
      }
      
      hasFetchedRef.current = true;
      
      try {
        setIsLoading(true);
        
        // Check if we have cached data first
        const cachedData = cache.get<{
          quizData: StyleQuizData & { usertags: UserTagsData[] };
          colorAnalysis: ColorAnalysis;
        }>(CACHE_KEYS.STYLE_QUIZ_DATA);
        
        if (cachedData) {
          console.log("Using cached style quiz data");
          setQuizData(cachedData.quizData);
          setParsedData(cachedData.quizData);
          setColorAnalysis(cachedData.colorAnalysis);
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching style quiz data from API...");
        const { data, error } = await getStyleQuizData();
        
        if (error) throw error;

        if (data) {
          setQuizData(data);
          
          // Parse the data and handle usertags
          const processedData = { ...data };
          
          // Parse user_tags and create usertags for compatibility
          if (data.user_tags) {
            try {
              if (typeof data.user_tags === 'string') {
                processedData.usertags = JSON.parse(data.user_tags);
              } else {
                processedData.usertags = data.user_tags;
              }
              console.log("Successfully processed user_tags:", processedData.usertags);
            } catch (e) {
              console.error("Error parsing user_tags:", e);
              setError("Error parsing user_tags data");
              return;
            }
          } else {
            console.log("No user_tags found in data, available keys:", Object.keys(data));
          }
          
          const finalProcessedData = processedData as StyleQuizData & { usertags: UserTagsData[] };
          setParsedData(finalProcessedData);
          
          // Parse all color data if it exists
          let colorData: ColorAnalysis | null = null;
          if (data.color_analysis && data.color_family && data.hex_codes) {
            try {
              colorData = parseColorData(data);
              setColorAnalysis(colorData);
            } catch (e) {
              console.error("Error parsing color data:", e);
              setError("Error parsing color data");
              return;
            }
          }
          
          // Cache the processed data
          if (colorData) {
            cache.set(CACHE_KEYS.STYLE_QUIZ_DATA, {
              quizData: finalProcessedData,
              colorAnalysis: colorData
            }, CACHE_TTL.MEDIUM);
            console.log("Style quiz data cached successfully");
          }
        }
      } catch (err) {
        console.error("Error fetching style quiz data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch style quiz data");
        // Reset the flag on error so retry can work
        hasFetchedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    quizData: parsedData,
    colorAnalysis,
    isLoading,
    error,
    refetch: async (forceRefresh = false) => {
      // Reset the flag to allow refetch
      hasFetchedRef.current = false;
      setIsLoading(true);
      setError(null);
      
      try {
        // If not forcing refresh, check cache first
        if (!forceRefresh) {
          const cachedData = cache.get<{
            quizData: StyleQuizData & { usertags: UserTagsData[] };
            colorAnalysis: ColorAnalysis;
          }>(CACHE_KEYS.STYLE_QUIZ_DATA);
          
          if (cachedData) {
            console.log("Using cached style quiz data on refetch");
            setQuizData(cachedData.quizData);
            setParsedData(cachedData.quizData);
            setColorAnalysis(cachedData.colorAnalysis);
            setIsLoading(false);
            return;
          }
        } else {
          // Clear cache if force refresh is requested
          cache.remove(CACHE_KEYS.STYLE_QUIZ_DATA);
          console.log("Force refreshing style quiz data...");
        }
        
        console.log("Refetching style quiz data from API...");
        const { data, error } = await getStyleQuizData();
        
        if (error) throw new Error(error as string);
        
        if (data) {
          setQuizData(data);
          const processedData = { ...data };
          if (data.user_tags) {
            try {
              if (typeof data.user_tags === 'string') {
                processedData.usertags = JSON.parse(data.user_tags);
              } else {
                processedData.usertags = data.user_tags;
              }
            } catch (e) {
              console.error("Error parsing user_tags:", e);
              throw new Error("Error parsing user_tags data");
            }
          }
          
          const finalProcessedData = processedData as StyleQuizData & { usertags: UserTagsData[] };
          setParsedData(finalProcessedData);
          
          let colorData: ColorAnalysis | null = null;
          if (data.color_analysis && data.color_family && data.hex_codes) {
            try {
              colorData = parseColorData(data);
              setColorAnalysis(colorData);
            } catch (e) {
              console.error("Error parsing color data:", e);
              throw new Error("Error parsing color data");
            }
          }
          
          // Cache the new data
          if (colorData) {
            cache.set(CACHE_KEYS.STYLE_QUIZ_DATA, {
              quizData: finalProcessedData,
              colorAnalysis: colorData
            }, CACHE_TTL.MEDIUM);
            console.log("Style quiz data re-cached successfully");
          }
        }
      } catch (err) {
        console.error("Error refetching style quiz data:", err);
        setError(err instanceof Error ? err.message : "Failed to refetch style quiz data");
        hasFetchedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    }
  };
}; 