import { supabase } from '@/lib/supabase';

export const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 10) {
    return cleaned
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+91 ${cleaned.slice(1)}`
  }
  return cleaned
}

export const handleSendOtp = async (phone: string) => {
  let cleanedPhone = phone.replace(/\D/g, '')
  if (cleanedPhone.startsWith('0')) {
    cleanedPhone = cleanedPhone.slice(1)
  }
  if (!cleanedPhone.startsWith('91')) {
    cleanedPhone = '91' + cleanedPhone
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: `+${cleanedPhone}`,
    options: { shouldCreateUser: true, channel: 'sms' }
  })

  return { error }
}

export const handleSendMail= async(email:string)=>{   
  const {error}=await supabase.auth.signInWithOtp({
    email:email,
    options:{shouldCreateUser:true,emailRedirectTo:'null'}
  })
  return {error}
}
export const handleVerifyMail= async(email:string,otp:string)=>{
  const {error}=await supabase.auth.verifyOtp({
    email:email,
    token:otp,
    type:'email'
  })
  return {error}
}
export const handleVerifyOtp = async (phone: string, otp: string) => {
  let cleanedPhone = phone.replace(/\D/g, '')
  if (cleanedPhone.startsWith('0')) {
    cleanedPhone = cleanedPhone.slice(1)
  }
  if (!cleanedPhone.startsWith('91')) {
    cleanedPhone = '91' + cleanedPhone
  }

  const { error } = await supabase.auth.verifyOtp({
    phone: `+${cleanedPhone}`,
    token: otp,
    type: 'sms'
  })

  return { error }
}

export const getStyleQuizData = async () => {
  try {
    // Get the current session with error handling
    let { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      // Try to refresh the session
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshedSession?.user) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      session = refreshedSession;
    }
    
    if (!session?.user) {
      throw new Error('No authenticated user found. Please sign in.');
    }

    console.log('Fetching style quiz data for user:', session.user.id);

    // Get the user's styleQuizId from users table with better error handling
    const { data: userData, error: userError } = await supabase
      .from('users_updated')
      .select('style_quiz_id')
      .eq('user_id', session.user.id)
      .maybeSingle(); // Use maybeSingle to avoid throwing on no rows

    if (userError) {
      console.error('User data fetch error:', userError);
      throw new Error(`Failed to fetch user data: ${userError.message}`);
    }
    
    if (!userData?.style_quiz_id) {
      throw new Error('No style quiz found for this user. Please complete the style quiz first.');
    }

    console.log('Found style quiz ID:', userData.style_quiz_id);

    // Fetch the style quiz data using styleQuizId
    const { data: quizData, error: quizError } = await supabase
      .from('style-quiz-updated')
      .select('*')
      .eq('id', userData.style_quiz_id)
      .single();

    if (quizError) {
      console.error('Quiz data fetch error:', quizError);
      throw new Error(`Error fetching style quiz data: ${quizError.message}`);
    }

    console.log('Successfully fetched quiz data');
    return { data: quizData, error: null };
  } catch (error) {
    console.error('Error in getStyleQuizData:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
};

export const STATIC_STEPS = ['Your Info', 'Your Body Type', 'Size Preferences', 'Style Preferences', "Go-to Style"];

export const BODY_TYPE_IMAGES = {
  'inverted triangle': {
    male: '/stylequizimages/bodytype/maleinvertedtriangle.jpg',
    female: '/stylequizimages/bodytype/femaleinvertedtriangle.jpg'
  },
  'rectangle': {
    male: '/stylequizimages/bodytype/malerectangle.jpg',
    female: '/stylequizimages/bodytype/femalerectangle.jpg'
  },
  'oval': {
    male: '/stylequizimages/bodytype/maleoval.jpg',
    female: '/stylequizimages/bodytype/femaleoval.jpg'
  },
  'hourglass': {
    male: '/stylequizimages/bodytype/malehourglasss.jpg',
    female: '/stylequizimages/bodytype/femalehourglass.jpg'
  },
  'triangle': {
    male: '/stylequizimages/bodytype/maletraingle.jpg',
    female: '/stylequizimages/bodytype/femaletriangle.jpg'
  }
};

export const SIZE_OPTIONS = {
  upperWear: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  waistSize: ['26', '28', '30', '32', '34', '36', '38', '40', '42']
};

export const PERSONALITY_QUESTIONS = [
  {
    key: 'weekendPreference',
    label: "Your ideal Saturday night?",
    options: [
      'Relaxing at home',
      'Exploring new spots',
      'Being active',
      'Attending events, parties'
    ],
    group: 'personality'
  },
  {
    key: 'friendCompliments',
    label: 'What do friends praise you for?',
    options: [
      'Always knowing what\'s trending and the newest cool spots',
      'Being calm, dependable, and rooted',
      'Your bold ideas and adventurous spirit',
      'Your organised and thoughtful'
    ],
    group: 'personality'
  },
  {
    key: 'shoppingStyle',
    label: 'How do you pick clothes online?',
    options: [
      'Premium brands',
      'Unique finds',
      'Trusted labels',
      'Research & compare'
    ],
    group: 'social1'
  },
  {
    key: 'wardrobeContent',
    label: 'Your wardrobe is mostly',
    options: [
      'Signature pieces',
      'Neutral basics',
      'Curated ethnic + western classics, all paired up',
      'Creative finds'
    ],
    group: 'social1'
  },
  {
    key: 'workOutfit',
    label: 'Big presentation tomorrow - what do you wear?',
    options: [
      'Formal & sharp',
      'Elevated casual',
      'Standout bold',
      'Simple & classic'
    ],
    group: 'work'
  },
  {
    key: 'workspaceStyle',
    label: 'Your work/study desk looks like',
    options: [
      'Clean and clutter-free',
      'Full of cozy touches (plants, cushions, mug)',
      'Tech-loaded',
      'Decor-rich and personal',
    ],
    group: 'work'
  },

  
 
];

export const STYLE_IMAGES = {
  streetwear: {
    male: '/stylequizimages/GotoStyle/malestreetwear.png',
    female: '/stylequizimages/GotoStyle/femalestreetwear.png'
  },
  'business casual': {
    male: '/stylequizimages/GotoStyle/malebusinesscasuals.png',
    female: '/stylequizimages/GotoStyle/femalebusinesscasual.png'
  },
  athleisure: {
    male: '/stylequizimages/GotoStyle/maleathliesure.png',
    female: '/stylequizimages/GotoStyle/femaleathliesure.png'
  }
};

export const STYLE_PREFERENCE_IMAGES = {
  streetwear: {
    male: {
      Tshirt: '/stylequizimages/GotoStyle/MalePrefStreet/image116.png',
      Shirt: '/stylequizimages/GotoStyle/MalePrefStreet/image118.png',
      Jeans: '/stylequizimages/GotoStyle/MalePrefStreet/image119.png',
      'Joggers and Sweatpants': '/stylequizimages/GotoStyle/MalePrefStreet/image120.png',
      Shorts: '/stylequizimages/GotoStyle/MalePrefStreet/image121.png',
      Cargos: '/stylequizimages/GotoStyle/MalePrefStreet/image122.png'
    },
    female: {
      'Cropped T-shirt': '/stylequizimages/GotoStyle/FemalePrefStreet/image90.png',
      Tshirts: '/stylequizimages/GotoStyle/FemalePrefStreet/image91.png',
      Shirts: '/stylequizimages/GotoStyle/FemalePrefStreet/image92.png',
      Jeans: '/stylequizimages/GotoStyle/FemalePrefStreet/image93.png',
      Cargoes: '/stylequizimages/GotoStyle/FemalePrefStreet/image94.png',
      'Joggers and Sweatpants': '/stylequizimages/GotoStyle/FemalePrefStreet/image95.png',
      Shorts: '/stylequizimages/GotoStyle/FemalePrefStreet/image96.png'
    }
  },
  'business casual': {
    male: {
      Shirts: '/stylequizimages/GotoStyle/MalePrefBus/image128.png',
      Blazers: '/stylequizimages/GotoStyle/MalePrefBus/image129.png',
      Trousers: '/stylequizimages/GotoStyle/MalePrefBus/image130.png',
      Turtlenecks: '/stylequizimages/GotoStyle/MalePrefBus/image158.png',
      Jeans: '/stylequizimages/GotoStyle/MalePrefBus/image161.png',
      'Polo T-shirts': '/stylequizimages/GotoStyle/MalePrefBus/image157.png',
    },
    female: {
      Dresses: '/stylequizimages/GotoStyle/FemalePrefBus/image107.png',
      Shirts: '/stylequizimages/GotoStyle/FemalePrefBus/image108.png',
      Blouse: '/stylequizimages/GotoStyle/FemalePrefBus/image109.png',
      Ethnics: '/stylequizimages/GotoStyle/FemalePrefBus/image110.png',
      Blazers: '/stylequizimages/GotoStyle/FemalePrefBus/image111.png',
      Pants: '/stylequizimages/GotoStyle/FemalePrefBus/image112.png',
      Jeans: '/stylequizimages/GotoStyle/FemalePrefBus/image113.png',
      Skirts: '/stylequizimages/GotoStyle/FemalePrefBus/image114.png',
    },
  },
  athleisure: {
    male: {
     'Tank Tops': '/stylequizimages/GotoStyle/MaleAthleiseure/image124.png',
     Tshirts: '/stylequizimages/GotoStyle/MaleAthleiseure/image125.png',
      Sweatpants: '/stylequizimages/GotoStyle/MaleAthleiseure/image126.png',
      Shorts: '/stylequizimages/GotoStyle/MaleAthleiseure/image127.png',  
      Joggers: '/stylequizimages/GotoStyle/MaleAthleiseure/image160.png',
    },
    female: {
      'Crop Top': '/stylequizimages/GotoStyle/FemaleAthleisure/image98.png',
      'Tanks': '/stylequizimages/GotoStyle/FemaleAthleisure/image99.png',
      'Sports Bra': '/stylequizimages/GotoStyle/FemaleAthleisure/image100.png',
      'Co-ords & Onesies': '/stylequizimages/GotoStyle/FemaleAthleisure/image101.png',
      'Leggings': '/stylequizimages/GotoStyle/FemaleAthleisure/image102.png',
      Joggers: '/stylequizimages/GotoStyle/FemaleAthleisure/image104.png',
      Shorts: '/stylequizimages/GotoStyle/FemaleAthleisure/image105.png',
    }
  }
};

// ========== STYLE QUIZ V2 DATA HANDLING ==========

// Interface for style-quiz-v2 table structure
export interface StyleQuizV2Data {
  name: string;
  gender: string;
  age: string;
  occupation: string;
  body_type: string;
  skin_tone: string;
  style_origin: string;
  style_vibes: string;
  personality_ques: string;
  outfit_swipe: string;
  phone_number: string;
  email: string;
}

// Local storage key for style quiz latest data
const QUIZ_STORAGE_KEY = 'style_quiz_latest_data';

// Store quiz data in local storage
export const storeQuizDataLocally = (data: any) => {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
    console.log('Quiz data stored locally:', data);
  } catch (error) {
    console.error('Error storing quiz data locally:', error);
  }
};

// Get quiz data from local storage
export const getQuizDataFromStorage = () => {
  try {
    const data = localStorage.getItem(QUIZ_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting quiz data from storage:', error);
    return null;
  }
};

// Clear quiz data from local storage
export const clearQuizDataFromStorage = () => {
  try {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    console.log('Quiz data cleared from local storage');
  } catch (error) {
    console.error('Error clearing quiz data from storage:', error);
  }
};

// Transform quiz state to style-quiz-v2 format
export const transformQuizDataForV2 = (quizState: any): StyleQuizV2Data => {
  return {
    name: quizState.personalInfo?.name || '',
    gender: quizState.personalInfo?.gender || '',
    age: quizState.personalInfo?.age || '',
    occupation: quizState.personalInfo?.occupation || '',
    body_type: quizState.bodyType?.bodyType || '',
    skin_tone: quizState.colorAnalysis?.selectedTone || '',
    style_origin: quizState.styleOrigin?.styleOrigin || '',
    style_vibes: JSON.stringify(quizState.styleVibe?.styleVibes || []),
    personality_ques: JSON.stringify(quizState.ansQuestion?.answers || []),
    outfit_swipe: JSON.stringify({
      liked: quizState.outfitSwipe?.likedOutfits || [],
      disliked: quizState.outfitSwipe?.dislikedOutfits || [],
      superLiked: quizState.outfitSwipe?.superLikedOutfits || []
    }),
    phone_number: quizState.contactVerification?.phone || '',
    email: quizState.contactVerification?.email || ''
  };
};

// Store quiz data in Supabase style-quiz-v2 table
export const storeQuizDataInSupabase = async (quizData: StyleQuizV2Data) => {
  try {
    // Get the current authenticated user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      throw new Error('No authenticated user found');
    }

    // Insert data into style-quiz-v2 table
    const { data, error } = await supabase
      .from('style-quiz-v2')
      .insert([{
        ...quizData,
        user_id: session.user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Quiz data successfully stored in Supabase:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error storing quiz data in Supabase:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to store quiz data' 
    };
  }
}; 