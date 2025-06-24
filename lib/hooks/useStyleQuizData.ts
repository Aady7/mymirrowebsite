import { useState, useEffect } from 'react';
import { getStyleQuizData } from '@/app/utils/styleQuizUtils';

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

interface UserTagsData {
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
  usertags: UserTagsData[] | string; // Could be string if stored as JSON
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
      try {
        setIsLoading(true);
        const { data, error } = await getStyleQuizData();
        
        if (error) throw error;

        if (data) {
          setQuizData(data);
          
          // Parse the data and handle usertags
          const processedData = { ...data };
          
          // Parse usertags if it's a string
          if (typeof data.user_tags === 'string') {
            try {
              processedData.usertags = JSON.parse(data.user_tags);
            } catch (e) {
              console.error("Error parsing usertags:", e);
              setError("Error parsing usertags data");
              return;
            }
          }
          
          setParsedData(processedData as StyleQuizData & { usertags: UserTagsData[] });
          
          // Parse all color data if it exists
          if (data.color_analysis && data.color_family && data.hex_codes) {
            try {
              const colorData = parseColorData(data);
              setColorAnalysis(colorData);
            } catch (e) {
              console.error("Error parsing color data:", e);
              setError("Error parsing color data");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching style quiz data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch style quiz data");
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
    refetch: async () => {
      setIsLoading(true);
      const { data, error } = await getStyleQuizData();
      if (data) {
        setQuizData(data);
        const processedData = { ...data };
        if (typeof data.user_tags === 'string') {
          try {
            processedData.usertags = JSON.parse(data.user_tags);
          } catch (e) {
            console.error("Error parsing usertags:", e);
          }
        }
        setParsedData(processedData as StyleQuizData & { usertags: UserTagsData[] });
        
        if (data.color_analysis && data.color_family && data.hex_codes) {
          try {
            const colorData = parseColorData(data);
            setColorAnalysis(colorData);
          } catch (e) {
            console.error("Error parsing color data:", e);
          }
        }
      }
      if (error) setError(error as string);
      setIsLoading(false);
    }
  };
}; 