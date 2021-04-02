import React, {useCallback, useEffect, useRef, useState} from 'react'
import classNames from 'classnames'
import {parseTranscribeResult, TrasncriptResult} from './transcript'
import styles from './App.css'

import FileUpLoadForm from './fileUpLoad'

interface AppProps {
  jobName: string
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

const App: React.FunctionComponent<AppProps> = ({jobName}) => {
  if (jobName == '') {
    return <FileUpLoadForm />
  }
  const voiceFile = `./input/${jobName}.m4a`
  const transcriptResultFile = `./output/${jobName}.json`

  const transcript = useTranscript(transcriptResultFile)
  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const onTimeUpdated = useCallback((e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audioNode: HTMLAudioElement = e.currentTarget
    console.assert(e.currentTarget === audioRef.current)
    setCurrentTime(audioNode.currentTime)
  }, [])

  const onClickTalkSegment = useCallback((e: React.SyntheticEvent<HTMLElement>) => {
    if (!audioRef.current || !e.currentTarget.dataset.starttime) {
      return
    }

    e.stopPropagation()

    const audioNode: HTMLAudioElement = audioRef.current!
    const startTime = +e.currentTarget.dataset.starttime

    audioNode.currentTime = startTime
    audioNode.play()
  }, [])

  if (!transcript) {
    return <div>Loading ...</div>
  }
  return (
    <div>
      <header className={styles.SiteHeader}>
        <div className="">
          <audio ref={audioRef} controls={true} src={voiceFile} onTimeUpdate={onTimeUpdated} />
        </div>
      </header>

      <div className={styles.Talks}>
        {transcript.segments.map(({speaker, startTime, endTime, items}) => {
          const key = `${startTime}:${endTime}`
          const isActive = currentTime >= startTime && currentTime <= endTime

          return (
            <div
              key={key}
              className={classNames(styles.Talk, isActive && styles.isActive)}
              onClick={onClickTalkSegment}
              data-starttime={startTime}
            >
              <div className={styles.Speaker}>{speaker}</div>
              <div className={styles.Items}>
                {items.map(({startTime, endTime, content}) => {
                  const key = `${startTime}:${endTime}`
                  const isActive = currentTime >= startTime && currentTime <= endTime
                  return (
                    <span
                      className={classNames(styles.TalkItem, isActive && styles.isActive)}
                      key={key}
                      onClick={onClickTalkSegment}
                      data-starttime={startTime}
                    >
                      {content}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
