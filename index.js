import http from "http"
import { getStories } from './scraper.js';

const app = http.createServer(async (req, res) => {
      if (req.url === '/getTimeStories' && req.method === 'GET') {
            try {
                  const stories = await getStories();
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(stories));
            }
            catch (error) {
                  console.error('Error:', error.message);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
      } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
      }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
      console.log(`This server is running on http://localhost:${PORT}`);
});