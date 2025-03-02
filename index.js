const express = require('express');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Buat agent dari cookies.json
const agent = ytdl.createAgent(JSON.parse(fs.readFileSync('cookies.json')));

// Serve file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk parsing JSON
app.use(express.json());

// Route untuk root (/)
app.get('/', (req, res) => {
    res.json({"anjay":"300"})
});

// Endpoint untuk download video (MP4)
app.get('/download', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl || !ytdl.validateURL(videoUrl)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        res.header('Content-Type', 'video/mp4');

        ytdl(videoUrl, {
            quality: 'highest',
            filter: 'audioandvideo',
            agent: agent
        }).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading video');
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
