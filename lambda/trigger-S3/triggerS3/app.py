import boto3
import urllib
import datetime

s3 = boto3.client("s3")
transcribe = boto3.client("transcribe")


def lambda_handler(event, context):
    print("event:", event)
    print("context", context)
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = urllib.parse.unquote_plus(
        event["Records"][0]["s3"]["object"]["key"], encoding="utf-8"
    )
    try:
        media_file_uri = f"https://s3.ap-northeast-1.amazonaws.com/{bucket}/{key}"
        print("media_file_uri:", media_file_uri)
        response = transcribe.start_transcription_job(
            TranscriptionJobName=datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            + "_Transcription",
            LanguageCode="ja-JP",
            Media={"MediaFileUri": media_file_uri},
            MediaFormat="mp4",
            MediaSampleRateHertz=32000,
            Settings={
                # 'VocabularyName': 'aws',
                "ShowSpeakerLabels": True,
                "MaxSpeakerLabels": 4,
                "ShowAlternatives": True,
                "MaxAlternatives": 5,
            },
            OutputBucketName="mojimoji-voices",
            OutputKey=f"output/{key}.json",
        )
        print("start_transcription_job response:", response)
    except Exception as e:
        print(e)
        print(
            f"Error getting object {key} from bucket {bucket}. Make sure they exist and your bucket is in the same region as this function."
        )
