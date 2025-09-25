// Override hover videos per product (homepage collection)
// Fill one of these maps with your video URLs.

export const videoOverridesByHandle: Record<string, string> = {
  // 'deskone-bureau': 'https://cdn.example.com/videos/deskone.mp4',
};

export const videoOverridesById: Record<string, string> = {
  // 'gid://shopify/Product/123': 'https://cdn.example.com/videos/123.mp4',
};

export const videoOverridesByIndex: Record<number, string> = {
  0: 'https://cdn.shopify.com/videos/c/o/v/7c87a5a7cb864e73aa42aeca1af387e1.mp4', // DeskOne Bureau (video 1)
  1: 'https://cdn.shopify.com/videos/c/o/v/28a666268343454d875bbecbca0db8a2.mp4', // SeatPro (video 3)
  2: 'https://cdn.shopify.com/videos/c/o/v/e7683e36c7d640c8bd81c6e41cd70889.mp4', // DeskPro (video 2)
  3: 'https://cdn.shopify.com/videos/c/o/v/aac943df3b59473bbdcebd4fbb4e9977.mp4', // Monitorarm (video 4)
};

// Video mapping based on Shopify tags
export const videoOverridesByTag: Record<string, string> = {
  'video 1': 'https://cdn.shopify.com/videos/c/o/v/7c87a5a7cb864e73aa42aeca1af387e1.mp4',
  'video 2': 'https://cdn.shopify.com/videos/c/o/v/e7683e36c7d640c8bd81c6e41cd70889.mp4', 
  'video 3': 'https://cdn.shopify.com/videos/c/o/v/28a666268343454d875bbecbca0db8a2.mp4',
  'video 4': 'https://cdn.shopify.com/videos/c/o/v/aac943df3b59473bbdcebd4fbb4e9977.mp4',
  // Support alternative tag formats
  '1 video': 'https://cdn.shopify.com/videos/c/o/v/7c87a5a7cb864e73aa42aeca1af387e1.mp4',
  '2 video': 'https://cdn.shopify.com/videos/c/o/v/e7683e36c7d640c8bd81c6e41cd70889.mp4', 
  '3 video': 'https://cdn.shopify.com/videos/c/o/v/28a666268343454d875bbecbca0db8a2.mp4',
  '4 video': 'https://cdn.shopify.com/videos/c/o/v/aac943df3b59473bbdcebd4fbb4e9977.mp4',
};


