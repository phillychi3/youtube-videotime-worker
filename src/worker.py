from fastapi import FastAPI
import youtube_dl
import re

async def on_fetch(request, env):
    import asgi

    return await asgi.fetch(app, request, env)


app = FastAPI()


@app.get("/")
async def root():
    return {"Hello": "Just a youtube video Video length api"}


@app.put("/api/video/{video_id}")
async def update_item(video_url: str):
    if re.match(r"^((?:https?:)\/\/)((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$"):
        vdurl = video_url
    else:
        vdurl = "https://www.youtube.com/watch?v={sID}".format(sID=video_url)
    with youtube_dl.YoutubeDL() as ydl:
        dictMeta = ydl.extract_info(
            vdurl, download=False
        )
        videoinfo = {
            "title": dictMeta["title"],
            "uploader": dictMeta["uploader"],
            "duration": dictMeta["duration"],
        }
    return videoinfo
