import { useState, useEffect } from "react";

interface ColorResult {
  success: boolean;
  average_skin_tone: number[];
  undertone: string;
  fitzpatrick_scale: string;
  lightness: number;
  a_value: number;
  b_value: number;
  dominant_colors: number[][];
  recommended_colours: {
    Formal: string[][];
    Streetwear: string[][];
    Athleisure: string[][];
  };
  skin_regions_detected: boolean;
  analysis_metadata: {
    lab_values: number[];
    skin_pixel_count: number;
    total_pixels: number;
    input_method: string;
    input_hex: string;
  };
}

interface ColorAnalyzerProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Expose the trigger function globally so the parent can call it
declare global {
  interface Window {
    triggerColorAnalysis?: () => Promise<void>;
  }
}

const SKIN_TONES = [
  { hex: "#E8C3B6", name: "Light" },
  { hex: "#E5BBB4", name: "Light Indian" },
  { hex: "#DCBAB3", name: "Light-Medium Indian" },
  { hex: "#C68B6A", name: "Medium Indian" },
  { hex: "#BA8578", name: "Medium Tan" },
  { hex: "#B58578", name: "Medium-Deep" },
  { hex: "#955D3B", name: "Deep Tan" },
  { hex: "#8D5A4C", name: "Deep Rich" },
];

export default function ColorAnalyzer({
  formValues,
  handleChange,
}: ColorAnalyzerProps) {
  const [result, setResult] = useState<ColorResult | null>(null);
  const [selectedTone, setSelectedTone] = useState<string>("");
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isReadyForAnalysis, setIsReadyForAnalysis] = useState(false);

  // Initialize component state from existing formValues data
  useEffect(() => {
    if (formValues.colorAnalysis) {
      try {
        const existingData = JSON.parse(formValues.colorAnalysis);
        console.log("Restoring color analysis data:", existingData);

        // Restore analysis completion state
        if (existingData.isComplete) {
          setIsAnalysisComplete(true);
          setIsReadyForAnalysis(true);
        } else if (existingData.isReadyForAnalysis) {
          setIsReadyForAnalysis(true);
        }

        // Restore method and related data (manual selection only)
        if (existingData.method === "manual" && existingData.selectedHex) {
          setSelectedTone(existingData.selectedHex);
        }

        // Restore analysis results if available
        if (
          existingData.recommended_colours &&
          existingData.analysis_metadata
        ) {
          const mockResult = {
            success: true,
            undertone: existingData.undertone,
            fitzpatrick_scale: existingData.fitzpatrick_scale,
            recommended_colours: existingData.recommended_colours,
            analysis_metadata: existingData.analysis_metadata,
            average_skin_tone: existingData.analysis_metadata?.lab_values || [],
            lightness: 0,
            a_value: 0,
            b_value: 0,
            dominant_colors: [],
            skin_regions_detected: true,
          };
          setResult(mockResult);
        }
      } catch (error) {
        console.error("Error restoring color analysis data:", error);
      }
    }
  }, []); // Only run once on mount



  // Expose the analysis trigger function globally
  useEffect(() => {
    window.triggerColorAnalysis = async () => {
      if (!isReadyForAnalysis) {
        throw new Error("No image or manual selection ready for analysis");
      }

      const currentAnalysisData = formValues.colorAnalysis
        ? JSON.parse(formValues.colorAnalysis)
        : null;

      if (currentAnalysisData?.method === "manual" && currentAnalysisData?.selectedHex) {
        // Handle manual selection
        await handleManualAnalysis(currentAnalysisData.selectedHex);
      }
    };

    return () => {
      delete window.triggerColorAnalysis;
    };
  }, [isReadyForAnalysis, formValues.colorAnalysis]);

  // Separate function for manual analysis
  const handleManualAnalysis = async (hex: string) => {
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const res = await fetch(
        "https://backend.mymirro.in/api/v1/color/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hex_color: hex }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to analyze color: ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data);
      setIsAnalysisComplete(true);

      // Create a detailed manual selection object
      const manualSelectionData = {
        method: "manual",
        selectedHex: hex,
        selectedToneName:
          SKIN_TONES.find((tone) => tone.hex === hex)?.name || "",
        undertone: data.undertone,
        fitzpatrick_scale: data.fitzpatrick_scale,
        recommended_colours: data.recommended_colours,
        analysis_metadata: data.analysis_metadata,
        isComplete: true,
        timestamp: new Date().toISOString(),
      };

      const syntheticEvent = {
        target: {
          name: "colorAnalysis",
          value: JSON.stringify(manualSelectionData),
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleChange(syntheticEvent);
      console.log("Manual Selection Analysis Complete:", manualSelectionData);
    } catch (error) {
      console.error("Error analyzing color:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to analyze the color. Please try again."
      );
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };





  const handleManualSelect = (hex: string) => {
    setSelectedTone(hex);
    setIsReadyForAnalysis(true);

    // Set the form to ready state without triggering API
    const syntheticEvent = {
      target: {
        name: "colorAnalysis",
        value: JSON.stringify({
          isReadyForAnalysis: true,
          selectedHex: hex,
          selectedToneName:
            SKIN_TONES.find((tone) => tone.hex === hex)?.name || "",
          method: "manual",
        }),
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent);
    console.log("Manual selection ready for analysis:", hex);
  };



  return (
    <div className="space-y-8">
      <div>
        <p className="text-gray-600 mb-8">
          Select the shade that best matches your skin tone for personalized color recommendations.
        </p>



        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">{apiError}</p>
                <p className="text-sm text-red-600 mt-1">
                  Please try uploading your image again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual skin tone selection */}
        <div className="space-y-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-3">
                  <p className="text-[14px] text-gray-700">
                    {isAnalysisComplete
                      ? "Analysis complete! You can proceed to the next step"
                      : "Analyzing your selected skin tone... hang tight!"}
                  </p>
                  {isAnalysisComplete ? (
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 border-2 border-[#007e90] border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-8 gap-2">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.hex}
                  onClick={() => handleManualSelect(tone.hex)}
                  className={`w-full aspect-[1/4] rounded-sm transition-all ${
                    selectedTone === tone.hex
                      ? "ring-2 ring-[#007e90] ring-offset-2"
                      : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                  }`}
                  style={{ backgroundColor: tone.hex }}
                  title={tone.name}
                />
              ))}
            </div>
            {selectedTone && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: selectedTone }}
                  />
                  <p className="text-green-700">
                    Selected:{" "}
                    {SKIN_TONES.find((tone) => tone.hex === selectedTone)?.name}
                  </p>
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Ready for analysis - click Next to continue
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 italic">
              Tip: Choose the tone closest to your inner forearm or jawline.
            </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
