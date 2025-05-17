export interface FormValues {
    name?: string;
    phone?: string;
    gender?: string;
    bodyType?: string;
    upperWear?: string;
    waistSize?: string;
    outfitAdventurous?: string[];
    minimalistic?: string;
    goToStyle?: string[];
    feedback?: string;
    alarmResponse?: string;
    cancelPlansResponse?: string;
    friendsLateResponse?: string;
    selfieFace?: string;
    outfitPlanning?: string;
    complimentOn?: string;
    otp?: string;
    [key: string]: any;
  }

 export  interface StyleQuizData {
    userId: string;
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
    fittags?: string[];
    personalitytags?: string[];
    patterntags?: string[];
    alarmresponse?: string;
    cancelplansresponse?: string;
    friendslateresponse?: string;
    selfieface?: string;
    outfitplanning?: string;
    complimenton?: string;
    [key: string]: any;
  }
  

  