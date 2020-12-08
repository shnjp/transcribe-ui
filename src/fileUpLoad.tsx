import React from 'react'

const url =
  'https://mojimoji-voices.s3.amazonaws.com/0000f1a9-0621-4597-903c-94027762e905?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASJLBJ3RGAFH76TQL%2F20201208%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20201208T054837Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=81148e3cbdfd1a0c27617fed949659688fe5f63060052b40ec6444e841cdee18'

class FileUpLoadForm extends React.Component {
  private handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.files', e.target.files)
    if (e.target.files == null) {
      console.log('file is null')
      return 0
    }

    const response = await fetch(url, {
      method: 'PUT',
      body: e.target.files[0],
    })
    console.log(response)
  }

  render() {
    return (
      <form>
        <h1>File Upload</h1>
        <input type="file" accept="video/mp4" onChange={this.handleChange} />
        <input type="submit" />
      </form>
    )
  }
}

export default FileUpLoadForm
