import React, {useEffect, useRef, useState} from 'react'
import {parseTranscribeResult, TrasncriptResult} from './transcript'
import styles from './App.css'

interface AppProps {
  voiceFile: string
  transcriptResultFile: string
}

function useTranscript(url: string): TrasncriptResult | undefined {
  const [transcript, setTranscript] = useState<TrasncriptResult | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      // いつも通りfetchを呼ぶ
      const res = await fetch(url)
      setTranscript(parseTranscribeResult(await res.json()))
    })()
  }, [])

  return transcript
}

const App: React.FunctionComponent<AppProps> = ({voiceFile, transcriptResultFile}) => {
  const transcript = useTranscript(transcriptResultFile)
  const audioRef = useRef<HTMLAudioElement>(null)

  if (!transcript) {
    return <div>Loading ...</div>
  }

  console.log(transcript)
  return (
    <main>
      <header className={styles.SiteHeader}>
        <div className="">
          <audio ref={audioRef} controls={true} src={voiceFile} />
        </div>
      </header>

      <div className={styles.Talks}>
        {transcript.segments.map(({speaker, startTime, endTime, items}) => {
          const key = `${startTime}:${endTime}`

          return (
            <div key={key} className={styles.Talk}>
              <div className={styles.Speaker}>{speaker}</div>
              <div className={styles.Items}>
                {items.map(({startTime, endTime, content}) => {
                  const key = `${startTime}:${endTime}`
                  return <span key={key}>{content}</span>
                })}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default App
