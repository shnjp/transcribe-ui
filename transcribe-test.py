# Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 32000 Hz, mono, fltp, 53 kb/s (default)
import boto3
import pprint

pp = pprint.PrettyPrinter(indent=2)

filename = 'likers-c'

client = boto3.client('transcribe')


def create_job(filename):
    rv = client.start_transcription_job(
        TranscriptionJobName=filename,
        Media={'MediaFileUri': f'https://mojimoji-voices.s3-ap-northeast-1.amazonaws.com/demo/{filename}.m4a'},
        MediaFormat='mp4',
        MediaSampleRateHertz=32000,
        LanguageCode='ja-JP',
        Settings={
            # 'VocabularyName': 'aws',
            'ShowSpeakerLabels': True,
            'MaxSpeakerLabels': 4,
            'ShowAlternatives': True,
            'MaxAlternatives': 5,
        },
    )
    print(rv)


def list_jobs():
    rv = client.list_transcription_jobs()
    pp.pprint(rv)

    for summary in rv['TranscriptionJobSummaries']:
        job_name = summary['TranscriptionJobName']
        status = summary['TranscriptionJobStatus']

        print(f'{job_name} : {status}')

        if status == 'COMPLETED':
            uri = client.get_transcription_job(TranscriptionJobName=job_name)['TranscriptionJob']['Transcript'][
                'TranscriptFileUri'
            ]
            print(f'  {uri}')
        print()


list_jobs()
# create_job('hokkaidolikers_0903')
# create_job('GMT20200805-085318_----------')
