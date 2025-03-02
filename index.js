const express = require('express');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const app = express();

const agent = ytdl.createAgent(JSON.parse(fs.readFileSync('cookies.json')));

app.use(express.json());

// Fungsi handler Vercel
module.exports = async (req, res) => {
    if (req.url.startsWith('/download')) {
        try {
            const videoUrl = req.query.url;
            
            if (!videoUrl || !ytdl.validateURL(videoUrl)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide a valid YouTube URL'
                });
            }

            const info = await ytdl.getInfo(videoUrl, { agent });
            const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');

            res.setHeader('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
            
            ytdl(videoUrl, {
                quality: 'highest',
                filter: 'audioandvideo',
                agent: agent
            }).pipe(res);

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error downloading video: ' + error.message
            });
        }
    } else if (req.url.startsWith('/info')) {
        try {
            const videoUrl = req.query.url;
            
            if (!videoUrl || !ytdl.validateURL(videoUrl)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide a valid YouTube URL'
                });
            }

            const info = await ytdl.getInfo(videoUrl, { agent });
            
            const videoInfo = {
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                duration: info.videoDetails.lengthSeconds,
                views: info.videoDetails.viewCount,
                thumbnail: info.videoDetails.thumbnails[0].url
            };

            res.json({
                status: 'success',
                data: videoInfo
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error getting video info: ' + error.message
            });
        }
    }
};