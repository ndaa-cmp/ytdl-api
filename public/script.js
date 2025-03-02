async function fetchVideoInfo() {
    const url = document.getElementById('youtubeUrl').value.trim();
    const status = document.getElementById('status');
    const videoInfo = document.getElementById('videoInfo');
    const thumbnail = document.getElementById('thumbnail');
    const title = document.getElementById('title');
    const downloadVideoBtn = document.getElementById('downloadVideo');

    if (!url) {
        status.textContent = 'Masukkan URL YouTube terlebih dahulu!';
        return;
    }

    status.textContent = 'Mengambil info video...';
    videoInfo.classList.add('d-none');

    try {
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            throw new Error('URL tidak valid');
        }

        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1]?.split('?')[0];
        if (!videoId) throw new Error('Tidak bisa menemukan ID video');

        thumbnail.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        title.textContent = 'Video Siap Diunduh';
        videoInfo.classList.remove('d-none');
        videoInfo.classList.add('show');

        downloadVideoBtn.disabled = false;
        status.textContent = 'Klik untuk mengunduh video!';
    } catch (error) {
        status.textContent = `Error: ${error.message}`;
        downloadVideoBtn.disabled = true;
    }
}

function download() {
    const url = document.getElementById('youtubeUrl').value.trim();
    const status = document.getElementById('status');

    if (!url) {
        status.textContent = 'Masukkan URL YouTube terlebih dahulu!';
        return;
    }

    status.textContent = 'Mengunduh video...';
    window.location.href = `/download?url=${encodeURIComponent(url)}`;
}