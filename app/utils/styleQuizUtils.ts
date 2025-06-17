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
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('No authenticated user found');
    }

    // Get the user's styleQuizId from users table
    const { data: userData, error: userError } = await supabase
      .from('users_updated')
      .select('style_quiz_id')
      .eq('user_id', session.user.id)
      .single();

    if (userError || !userData?.style_quiz_id) {
      throw new Error('No style quiz data found for user');
    }

    // Fetch the style quiz data using styleQuizId
    const { data: quizData, error: quizError } = await supabase
      .from('style-quiz-updated')
      .select('*')
      .eq('id', userData.style_quiz_id)
      .single();

    if (quizError) {
      throw new Error('Error fetching style quiz data');
    }

    return { data: quizData, error: null };
  } catch (error) {
    console.error('Error in getStyleQuizData:', error);
    return { data: null, error };
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
    label: "It's finally the weekend! What's your ideal Saturday evening?",
    options: [
      'PJ bottoms, OTT binge, snack delivery',
      'Trying the café that blew up on Reels this week',
      'Evening run club / badminton game, then coconut water',
      'Tickets to an indie stand-up or art gig you found on BookMyShow'
    ],
    group: 'personality'
  },
  {
    key: 'friendCompliments',
    label: 'Your friends typically compliment you most on:',
    options: [
      'Always knowing what\'s trending and the newest cool spots',
      'Being calm, dependable, and rooted',
      'Your bold ideas and adventurous spirit',
      'Your organised, thoughtful, Google-Sheet-for-everything approach'
    ],
    group: 'personality'
  },
  {
    key: 'shoppingStyle',
    label: 'When shopping online, how do you usually make your final choice?',
    options: [
      'Premium brand that screams success',
      'Eye-catching, one-of-a-kind collab to flex creativity',
      'Reliable classic label you\'ve trusted for years',
      'Spreadsheet of specs, coupon codes, top reviews—then checkout'
    ],
    group: 'social1'
  },
  {
    key: 'wardrobeContent',
    label: 'If someone flung open your wardrobe, they\'d mostly see:',
    options: [
      'Designer labels or premium pieces you treasure',
      'Neutral basics that mix-and-match effortlessly',
      'Curated ethnic + western classics, all paired up',
      'Eclectic thrift finds, DIY patches—totally you'
    ],
    group: 'social1'
  },
  {
    key: 'workOutfit',
    label: 'Big work presentation tomorrow—your outfit vibe?',
    options: [
      'Crisp formal shirt, sharp trousers, polished shoes',
      'Comfortable polo and well-fitted trousers',
      'Bold printed shirt with statement accessories',
      'Simple white/black shirt with clean lines—let your work speak'
    ],
    group: 'work'
  },
  {
    key: 'workspaceStyle',
    label: 'Your work or study desk usually looks like:',
    options: [
      'Clean, neutral desk with only the essentials',
      'Cushions, snack bowl, foot-rest—comfort paradise',
      'Sleek gadgets, wireless everything—LinkedIn-ad vibe',
      'Random gifts, ticket stubs, action figures—fun chaos',
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
      Dressses: '/stylequizimages/GotoStyle/FemalePrefBus/image107.png',
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