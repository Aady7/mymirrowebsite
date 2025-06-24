export interface Garment {
    id: string;
    title: string;
    image: string;
    price: number;
    style: string;
    color: string;
    semantic_score: number;
  }
export interface Outfit {
    main_outfit_id: string;
    rank: number;
    score: number;
    explanation: string;
    top: Garment;
    bottom: Garment;
    total_price: number;
    generated_at: string;
    generation_method: string;
    outfit_name:string;
    outfit_description:string;
    why_picked_explanation:string;
  }