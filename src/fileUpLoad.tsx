import React from 'react'

const endpoint = 'https://zz2c9x1hp4.execute-api.ap-northeast-1.amazonaws.com/Prod/pre-signed'

interface State {
  uploadFile: null | File
}

class FileUpLoadForm extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {uploadFile: null}
  }

  getPreSignedURL = async () => {
    if (this.state.uploadFile == null) {
      return
    }
    const data = {fileName: this.state.uploadFile.name}
    console.log('data:', data)
    const param = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        mode: 'no-cors',
      },
      body: JSON.stringify(data),
    }
    const url = await fetch(endpoint, param)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        return data['preSignedURL']
      })
      .catch((e) => {
        console.log(e)
      })
    return url
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) {
      console.log('file is null')
      return
    }
    this.setState({uploadFile: event.target.files[0]})
  }

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('event: ', event)
    if (this.state.uploadFile == null) {
      console.log('file is null')
      return
    }
    const url = await this.getPreSignedURL()
    console.log('presigned URL:', url)
    const response = await fetch(url, {
      method: 'PUT',
      body: this.state.uploadFile,
    })
    console.log(response)
    return
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>File Upload</h1>
        <input type="file" accept="video/mp4,audio/*" onChange={this.handleChange} />
        <input type="submit" value="アップロード" />
      </form>
    )
  }
}

export default FileUpLoadForm
