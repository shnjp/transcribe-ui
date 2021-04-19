import requests
import slack
import boto3
import re

transcribe = boto3.client("transcribe")


def lambda_handler(event, context):
    print("event:", event)
    print("context:", context)
    TranscriptionJobName = event["detail"]["TranscriptionJobName"]
    TranscriptionJobStatus = event["detail"]["TranscriptionJobStatus"]
    print(f"{TranscriptionJobName} is {TranscriptionJobStatus}!")

    transcription_job = transcribe.get_transcription_job(
        TranscriptionJobName=TranscriptionJobName
    )
    print(transcription_job)
    TranscriptFileUri = transcription_job["TranscriptionJob"]["Transcript"][
        "TranscriptFileUri"
    ]
    print("output:", TranscriptFileUri)
    file_name = get_file_name(TranscriptFileUri)
    print(
        f"https://mojimoji-voices.s3-ap-northeast-1.amazonaws.com/output/index.html?{file_name}"
    )

    url = f"https://mojimoji-voices.s3-ap-northeast-1.amazonaws.com/output/index.html?{file_name}"
    text = f"【{file_name}】の文字起こしが完了しました。\n<{url}|こちら>からアクセスできます。"
    RYO = "U01AH94NELX"
    slack.post_DM(RYO, text)


def get_file_name(file_uri):
    head_pattern = re.compile(r"https.*/(.*?)\.json")
    file_name = head_pattern.findall(file_uri)
    if file_name:
        print("Error: ファイル名がみつからなかった")
        return file_name[0]
    return ""


if __name__ == "__main__":
    print(
        get_file_name(
            "https://s3.ap-northeast-1.amazonaws.com/mojimoji-voices/output/test.json"
        )
    )
