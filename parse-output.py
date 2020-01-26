import json
import sys


def main(filepath):
    trasncribe_result = json.load(open(filepath))
    if trasncribe_result['status'] != 'COMPLETED':
        raise ValueError('transcript not completed')

    transcript = trasncribe_result['results']['transcripts'][0]['transcript']
    speaker_labels = trasncribe_result['results']['speaker_labels']
    speakers = speaker_labels['speakers']
    segments = speaker_labels['segments']
    items = trasncribe_result['results']['items']

    print(len(transcript.split(' ')), 'words')
    print(len(items), 'items')

    words = transcript.split(' ')

    for segment in segments:
        print(segment['speaker_label'])
        texts = []
        for si in segment['items']:
            a = items.pop(0)
            # b = words.pop(0)
            # print(si, a, b)
            texts.append(a['alternatives'][0]['content'])
            # if a['alternatives'][0]['content'] != b:
            #     raise ValueError
        print(' '.join(texts))
        print('-----')


main(sys.argv[1])
