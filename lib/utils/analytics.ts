// Google Analytics utility functions
export const GA_MEASUREMENT_ID = 'G-VE0MRBMNF5';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: url,
    });
  }
};

// Track custom events
export const event = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      ...parameters,
    });
  }
};

// Track specific user actions
export const trackEvent = {
  // E-commerce events
  addToCart: (item: { item_id: string; item_name: string; price: number; category?: string }) => {
    event('add_to_cart', {
      currency: 'INR',
      value: item.price,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          category: item.category || 'product',
          price: item.price,
          quantity: 1,
        },
      ],
    });
  },

  // Purchase event
  purchase: (transactionId: string, value: number, items: any[]) => {
    event('purchase', {
      transaction_id: transactionId,
      currency: 'INR',
      value: value,
      items: items,
    });
  },

  // Style quiz events
  startStyleQuiz: () => {
    event('quiz_start', {
      quiz_type: 'style_quiz',
    });
  },

  completeStyleQuiz: () => {
    event('quiz_complete', {
      quiz_type: 'style_quiz',
    });
  },

  // Outfit generation
  generateOutfit: (userId?: string) => {
    event('generate_outfit', {
      user_id: userId,
    });
  },

  // Product views
  viewProduct: (productId: string, productName: string, category?: string) => {
    event('view_item', {
      currency: 'INR',
      items: [
        {
          item_id: productId,
          item_name: productName,
          category: category || 'product',
        },
      ],
    });
  },

  // Search events
  search: (searchTerm: string) => {
    event('search', {
      search_term: searchTerm,
    });
  },

  // User engagement
  signUp: (method?: string) => {
    event('sign_up', {
      method: method || 'email',
    });
  },

  login: (method?: string) => {
    event('login', {
      method: method || 'email',
    });
  },

  // Custom events
  viewRecommendations: () => {
    event('view_recommendations', {
      page_title: 'Recommendations',
    });
  },

  shareOutfit: (outfitId: string) => {
    event('share', {
      content_type: 'outfit',
      item_id: outfitId,
    });
  },

  rateProduct: (productId: string, rating: number) => {
    event('rate_product', {
      item_id: productId,
      rating: rating,
    });
  },
}; 