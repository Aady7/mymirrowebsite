export interface FormValues {
    [key: string]: any;
    name?: string;
    gender?: string;
    phone?: string;
    otp?: string;
    bodyType?: string;
    upperWear?: string;
    waistSize?: string;
    outfitAdventurous?: string[];
    minimalistic?: string;
    goToStyle?: string[];
    feedback?: string;
    colorAnalysis?: string;
    // Update personality question fields to be string arrays
    weekendPreference?: string[];
    shoppingStyle?: string[];
    workspaceStyle?: string[];
    friendCompliments?: string[];
    workOutfit?: string[];
    wardrobeContent?: string[];
}

export interface StyleQuizData {
    styleQuizId?: string;
    name: string;
    phone: string;
    gender: string;
    bodyType?: string;
    upperWear?: string;
    waistSize?: string;
    outfitAdventurous: string[];
    minimalistic?: string;
    goToStyle: string[];
    feedback?: string;
    created_at: string;
    updated_at: string;
    usertags: any[];
    weekendPreference?: string[];
    shoppingStyle?: string[];
    workspaceStyle?: string[];
    friendCompliments?: string[];
    workOutfit?: string[];
    wardrobeContent?: string[];
    colorAnalysis?: any;
    userId?: string;
}


  

  