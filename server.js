// Add this to your Next.js API routes or Express server
// Security headers middleware

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)'
  }
];

// For Next.js (next.config.js):
/*
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
*/

// For Express:
/*
const express = require('express');
const app = express();

app.use((req, res, next) => {
  securityHeaders.forEach(header => {
    res.setHeader(header.key, header.value);
  });
  next();
});
*/
