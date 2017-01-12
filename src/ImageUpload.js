import React, { Component } from 'react';

const ImageUpload = ({
  editorState,
  onChange,
  modifier
}) => {
  let inputFile
  const triggerFileInput = () => {
    console.log('yipee');
    inputFile.click()
  }

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    const url = URL.createObjectURL(file);
    onChange(modifier(editorState, url));
  }

  return (
    <div className='image-upload'>
      <input className="fileInput hidden" type="file" onChange={handleImageChange} ref={input => inputFile = input} />
      <div onClick={triggerFileInput}>📷</div>
    </div>
  )
}

export default ImageUpload
