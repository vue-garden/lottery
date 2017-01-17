let readFileAsDataUrl = (file) => {
  let reader = new window.FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = (evt) => resolve(evt.target.result)
    reader.onerror = (evt) => reject(evt)
    reader.onabort = (evt) => reject(evt)
    reader.readAsDataURL(file)
  })
}

export { readFileAsDataUrl }
