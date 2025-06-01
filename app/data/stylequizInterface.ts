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
    // New personality questions
    weekendPreference?: string;
    shoppingStyle?: string;
    workspaceStyle?: string;
    friendCompliments?: string;
    workOutfit?: string;
    wardrobeContent?: string;
}

export interface StyleQuizData {
    userId: string;
    name: string;
    phone: string;
    gender: string;
    bodyType?: string;
    upperWear?: string;
    waistSize?: string;
    outfitAdventurous?: string[];
    minimalistic?: string;
    goToStyle?: string[];
    feedback?: string;
    created_at: string;
    updated_at: string;
    usertags: {
        personality_tags: string[];
        fit_tags: string[];
        print_type_tags: string[];
        print_scale_tags: string[];
        print_density_tags: string[];
        pattern_placement_tags: string[];
        surface_texture_tags:string[];



        
       
       
    }[];
    // New personality questions
    weekendPreference?: string;
    shoppingStyle?: string;
    workspaceStyle?: string;
    friendCompliments?: string;
    workOutfit?: string;
    wardrobeContent?: string;
    [key: string]: any;
}


  

  