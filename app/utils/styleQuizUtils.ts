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
    key: 'alarmResponse',
    label: 'Your alarm rings. You...',
    options: [
      'Snooze 5 times',
      'Jump out like a hero',
      'Check WhatsApp or Insta first',
      'Mentally plan your outfit',
    ],
    group: 'morning'
  },
  {
    key: 'cancelPlansResponse',
    label: 'Your friend cancels plans. You...',
    options: [
      'Feel secretly relieved - solo time hits different',
      'Still getting ready. Plans or no plans',
      'Spam them with memes and voice notes',
      'That is my cue to finish a side project',
    ],
    group: 'social1'
  },
  {
    key: 'friendsLateResponse',
    label: 'Your friends are running late. You are',
    options: [
      'Already there, slightly annoyed but chill',
      'Oh crap. I completely lost track of time',
      'Texting "on my way"… while still wrapped in a blanket',
      'Chilling. Music on, snacks ready. I like the wait',
    ],
    group: 'social1'
  },
  {
    key: 'selfieFace',
    label: 'Go-to selfie face?',
    options: [
      'Smirk or pout',
      'Laughing candid',
      'Serious side profile',
      'Not into selfies',
    ],
    group: 'selfie'
  },
  {
    key: 'outfitPlanning',
    label: 'How often do you plan outfits?',
    options: [
      'Just for events',
      'Every. Single. Day.',
      'Whatever is clean',
      'Mood-based chaos',
    ],
    group: 'fashion1'
  },
  {
    key: 'complimentOn',
    label: 'What do people compliment you on?',
    options: [
      'Love your style — always bold',
      'You are such a vibe booster',
      'You are so honest and grounded',
      'You have a really calming presence',
    ],
    group: 'fashion1'
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
      Tshirts: '/stylequizimages/GotoStyle/MaleAthleiseure/image124.png',
      'Tank Tops': '/stylequizimages/GotoStyle/MaleAthleiseure/image125.png',
      Joggers: '/stylequizimages/GotoStyle/MaleAthleiseure/image126.png',
      Shorts: '/stylequizimages/GotoStyle/MaleAthleiseure/image127.png',   
    },
    female: {
      option_1: '/stylequizimages/GotoStyle/FemaleAthleisure/image98.png',
      option_2: '/stylequizimages/GotoStyle/FemaleAthleisure/image99.png',
      'Sports Bra': '/stylequizimages/GotoStyle/FemaleAthleisure/image100.png',
      option_4: '/stylequizimages/GotoStyle/FemaleAthleisure/image101.png',
      option_5: '/stylequizimages/GotoStyle/FemaleAthleisure/image102.png',
      Joggers: '/stylequizimages/GotoStyle/FemaleAthleisure/image104.png',
      Shorts: '/stylequizimages/GotoStyle/FemaleAthleisure/image105.png',
    }
  }
}; 