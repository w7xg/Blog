const isProd = process.env.NODE_ENV === 'production'
const cdnPrefix = process.env.CDN_PREFIX || ''

if (isProd && cdnPrefix) {
  console.log(`> [unix.bio] You have customized the CDN prefix: ${cdnPrefix}.\n`)
}

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [require('@mapbox/rehype-prism'), require('rehype-join-line')],
  },
})

const withOffline = require('next-offline')

const nextConfig = {
	workboxOpts: {
    swDest: process.env.NEXT_EXPORT
      ? 'service-worker.js'
      : 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/service-worker.js',
        destination: '/_next/static/service-worker.js',
      },
    ]
  },

	
  target: 'serverless',

  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx'],

  cssModules: true,

  generateEtags: false,

  poweredByHeader: false,

  assetPrefix: isProd ? cdnPrefix : '',

  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },

  env: {
    VERSION: require('./package.json').version,
  },
  

  experimental: {
    redirects() {
      return [
        {
          source: '/blog/others/:path*',
          permanent: true,
          destination: '/posts/:path*',
        },
        {
          source: '/blog/others/:path*/',
          permanent: true,
          destination: '/posts/:path*',
        },
        {
          source: '/blog/js/:path*',
          permanent: true,
          destination: '/posts/:path*',
        },
        {
          source: '/blog/js/:path*/',
          permanent: true,
          destination: '/posts/:path*',
        },
        {
          source: '/blog/proxy/:path*',
          permanent: true,
          destination: '/posts/:path*',
        },
        {
          source: '/blog/proxy/:path*/',
          permanent: true,
          destination: '/posts/:path*',
        },
      ]
    },
  },
}

module.exports = withMDX(withOffline(nextConfig))
