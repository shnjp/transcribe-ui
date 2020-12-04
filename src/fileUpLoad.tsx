import React from 'react'

interface State {
  file: File | null
}

class FileUpLoadForm extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.setState({file: null})
  }

  private handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.files', e.target.files)
    if (e.target.files == null) {
      console.log('file is null')
      return 0
    }
    this.setState({file: e.target.files[0]})
    const params = new FormData()
    params.append('file', e.target.files[0])
    console.log('params', params)
    const url =
      'https://mojimoji-voices.s3.amazonaws.com/a59892ee-b373-4a01-84c8-f68483bdb940?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASJLBJ3RGAFH76TQL%2F20201204%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20201204T061409Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ef38c288c76f05389a4212973bedd8d37198d7325b34f717b9c655d1bb2babae'
    const response = await fetch(url, {
      method: 'POST',
      body: params,
      mode: 'no-cors',
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    console.log(response)
  }

  render() {
    return (
      <form
        action="https://mojimoji-voices.s3.amazonaws.com/a59892ee-b373-4a01-84c8-f68483bdb940?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASJLBJ3RGAFH76TQL%2F20201204%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20201204T061409Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ef38c288c76f05389a4212973bedd8d37198d7325b34f717b9c655d1bb2babae"
        method="post"
        encType="multipart/form-data"
      >
        <h1>File Upload</h1>
        <input type="file" onChange={this.handleChange} />
        <input type="submit" />
      </form>
    )
  }
}

export default FileUpLoadForm
