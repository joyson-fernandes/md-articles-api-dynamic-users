import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { DOMParser } from 'xmldom';  // Import xmldom to handle XML parsing

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' directory

// API endpoint to fetch Medium articles
app.get('/medium-articles/:username', async (req, res) => {
    const username = req.params.username; // Get the username from the URL
    const feedUrl = `https://medium.com/feed/@${username}`; // Construct the feed URL

    try {
        const response = await fetch(feedUrl);
        const body = await response.text();

        // Parse the XML response
        const xmlData = new DOMParser().parseFromString(body, 'text/xml');
        const items = xmlData.getElementsByTagName('item');  // Get all <item> elements

        // Build an array of articles
        const articles = Array.from(items).map(item => {
            return {
                title: item.getElementsByTagName('title')[0]?.textContent || 'No Title Available',
                link: item.getElementsByTagName('link')[0]?.textContent || '#',
                content: item.getElementsByTagName('content:encoded')[0]?.textContent || 'No Content Available',
            };
        });

        res.json(articles);  // Send back the articles as JSON
    } catch (error) {
        console.error('Error fetching Medium articles:', error.message);
        res.status(500).send('Error fetching Medium articles');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
