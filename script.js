const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function convertToVideo() {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const audioInput = document.getElementById("audioInput").files[0];
    if (!audioInput) {
        alert("Please upload an audio file.");
        return;
    }

    const bgColor = document.getElementById("bgColor").value;
    const audioName = "audio.mp3";
    const outputName = "output.mp4";

    ffmpeg.FS("writeFile", audioName, await fetchFile(audioInput));

    await ffmpeg.run(
        "-f", "lavfi",
        "-i", `color=c=${bgColor}:s=1280x720:d=10`,
        "-i", audioName,
        "-vf", "format=yuv420p",
        "-c:v", "libx264",
        "-c:a", "aac",
        "-b:a", "192k",
        outputName
    );

    const data = ffmpeg.FS("readFile", outputName);
    const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
    const videoURL = URL.createObjectURL(videoBlob);

    document.getElementById("outputVideo").src = videoURL;
    document.getElementById("downloadBtn").href = videoURL;
    document.getElementById("downloadBtn").download = "converted_video.mp4";
    document.getElementById("downloadBtn").style.display = "block";
      }
      
