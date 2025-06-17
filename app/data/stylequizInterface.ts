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
    id?: string;
    name: string;
    phone_number: string;
    gender: string;
    body_shape?: string;
    upper_size?: string;
    lower_waist_size?: string;
    outfit_adventurous: string[];
    minimalistic?: string;
    fashion_style: string[];
    feedback?: string;
    created_at: string;
    updated_at: string;
    user_tags: any[];
    weekend_preference?: string[];
    shopping_style?: string[];
    workspace_style?: string[];
    friend_compliments?: string[];
    work_outfit?: string[];
    wardrobe_content?: string[];
    color_analysis?: any;
    user_id?: string;
    personality_tag_1?: string;
    personality_tag_2?: string;
    print_type?: string[];
    print_scale?: string[];
    print_density?: string[];
    pattern_placement?: string[];
    surface_texture?: string[];
    upper_fit?: string[];
    lower_fit?: string[];
    full_body_fit?: string[];
    upper_wear_caption?: string;
    lower_wear_caption?: string;
    full_body_dress_caption?: string;
}


  

  