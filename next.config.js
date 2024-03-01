module.exports = {
  webpack: (config, { isServer }) => {
    // Fix for Module not found: Can't resolve 'fs'
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
  images: {
    domains: [
      "www.notion.so",
      "lh5.googleusercontent.com",
      "s3-us-west-2.amazonaws.com",
    ],
  },
}
