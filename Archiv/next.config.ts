export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.presenterra.at', // Deine WordPress-Domain
        pathname: '/wp-content/uploads/**' // Pfad zu deinen Produktbildern
      }
    ]
  }
};
