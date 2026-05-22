import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIDEO = ROOT / "media" / "investor-diligence-war-room-demo-narrated.mp4"
THUMB = ROOT / "media" / "investor-diligence-war-room-demo-thumb.png"


def ffprobe_json(path: Path) -> dict:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration,size",
            "-show_streams",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


if not VIDEO.exists():
    raise SystemExit(f"missing demo video: {VIDEO.relative_to(ROOT)}")

probe = ffprobe_json(VIDEO)
duration = float(probe["format"]["duration"])
size = int(probe["format"]["size"])
stream_types = {stream["codec_type"] for stream in probe["streams"]}

if not 50 <= duration <= 75:
    raise SystemExit(f"unexpected demo duration: {duration}")
if size < 1_000_000:
    raise SystemExit(f"demo video too small: {size}")
for required in ["video", "audio", "subtitle"]:
    if required not in stream_types:
        raise SystemExit(f"missing {required} stream")

subtitles = [stream for stream in probe["streams"] if stream["codec_type"] == "subtitle"]
if not subtitles or subtitles[0].get("codec_name") != "mov_text":
    raise SystemExit("expected mov_text subtitle track")

subprocess.run(
    [
        "ffmpeg",
        "-y",
        "-ss",
        "00:00:30",
        "-i",
        str(VIDEO),
        "-frames:v",
        "1",
        str(THUMB),
    ],
    check=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

print("investor_diligence_demo_assets_ok")
print(f"duration={duration:.2f}")
print(f"size={size}")
print(f"streams={','.join(sorted(stream_types))}")
print(f"thumbnail={THUMB.relative_to(ROOT)}")
