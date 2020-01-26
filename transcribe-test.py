import boto3

job_name = 'testjob'

client = boto3.client('transcribe')
rv = client.start_transcription_job(
    TranscriptionJobName=job_name,
    Media={'MediaFileUri': 'https://mojimoji-voices.s3-ap-northeast-1.amazonaws.com/test.mp4'},
    MediaFormat='mp4',
    MediaSampleRateHertz=44100,
    LanguageCode='ja-JP',
    Settings={
        # 'VocabularyName': 'aws',
        'ShowSpeakerLabels': True,
        'MaxSpeakerLabels': 2,
    },
)
print(rv)
