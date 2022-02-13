module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["links.papareact.com", "fakestoreapi.com", "pngimg.com"],
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  },
};


// stripe listen webhook refresh in every 90 days
// stripe listen --forward-to localhost:3000/api/webhook
