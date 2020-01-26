export interface TrasncriptResult {
  speakers: string[]
  segments: {
    speaker: string
    startTime: number
    endTime: number
    items: {
      startTime: number
      endTime: number
      content: string
    }[]
  }[]
  // transcript: string
  // items: {}[]
}

export function parseTranscribeResult(json: any): TrasncriptResult {
  if (json.status != 'COMPLETED') {
    throw new Error('transcribe not completed')
  }
  const {
    // transcripts,
    speaker_labels: {speakers, segments},
    items,
  } = json['results']
  // const transcript = transcripts[0]['transcript']
  const speakerNames = []
  for (let idx = 0; idx < speakers; ++idx) {
    speakerNames.push(`spk_${idx}`)
  }

  const itemsMap = new Map<string, any>()
  let lastKey = ''

  items.forEach((raw: any) => {
    const {start_time: startTime, end_time: endTime} = raw
    if (startTime && endTime) {
      lastKey = `${startTime}:${endTime}`
      itemsMap.set(lastKey, raw)
    } else {
      const word = raw['alternatives'][0]['content']
      const prev = itemsMap.get(lastKey)
      console.assert(prev)
      prev['alternatives'][0]['content'] += word
    }
  })

  const result = {
    speakers: speakerNames,
    segments: segments.map((raw: any) => {
      return {
        speaker: raw.speaker_label,
        startTime: +raw.start_time,
        endTime: +raw.end_time,
        items: raw.items.map((rawItem: any) => {
          console.assert(raw.speaker_label == rawItem.speaker_label)
          const {start_time: startTime, end_time: endTime} = rawItem
          const key = `${startTime}:${endTime}`

          const item = itemsMap.get(key)
          console.assert(item)
          itemsMap.delete(key)
          delete item['start_time']
          delete item['end_time']

          const {content} = item.alternatives[0]
          console.assert(item.alternatives.length == 1)

          return {
            startTime: +rawItem.start_time,
            endTime: +rawItem.end_time,
            content,
          }
        }),
      }
    }),
    // transcript,
    // items: items.map((raw: any) => {
    //   return {
    //     startTime: +raw.start_time,
    //     endTime: +raw.end_time,
    //     alternatives: raw.alternatives,
    //     type: raw.type,
    //   }
    // }),
  }
  console.assert(itemsMap.size == 0)
  return result
}
