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
    fbq?: (
      command: 'track' | 'trackCustom' | 'init',
      eventName: string,
      parameters?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const pageview = (url: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_location: url,
      });
    }
  } catch (error) {
    console.warn('Analytics pageview error:', error);
  }
};

// Track custom events
export const event = (action: string, parameters?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        ...parameters,
      });
    }
  } catch (error) {
    console.warn('Analytics event error:', error);
  }
};

// Track Meta Pixel events
export const fbPixelEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      if (parameters) {
        window.fbq('track', eventName, parameters);
      } else {
        window.fbq('track', eventName);
      }
    }
  } catch (error) {
    console.warn('Meta Pixel event error:', error);
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
    // Track with Google Analytics
    event('quiz_start', {
      quiz_type: 'style_quiz',
    });
    
    // Track with Meta Pixel
    fbPixelEvent('InitiateCheckout', {
      content_name: 'Style Quiz',
      content_category: 'quiz_start'
    });
  },

  completeStyleQuiz: () => {
    // Track with Google Analytics
    event('quiz_complete', {
      quiz_type: 'style_quiz',
    });
    
    // Track with Meta Pixel
    fbPixelEvent('CompleteRegistration', {
      content_name: 'Style Quiz',
      content_category: 'quiz_completion',
      status: 'completed'
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