const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (e.g., index.html, load.html)
app.use(express.static('public'));

// Proxy route
app.get('/proxy', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('No URL provided');
  }

  // Create a proxy middleware for the target URL
  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${targetUrl}`);
    },
    onError: (err, req, res) => {
      res.status(500).send('Proxy error');
    },
  });

  // Handle the proxy request
  proxy(req, res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
