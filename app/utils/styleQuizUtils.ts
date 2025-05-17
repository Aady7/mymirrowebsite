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
  'inverted triangle': '/body-types/inverted-triangle.png',
  'rectangle': '/body-types/rectangle.png',
  'oval': '/body-types/oval.png',
  'hourglass': '/body-types/hourglass.png',
  'triangle': '/body-types/triangle.png'
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
  },
]; 