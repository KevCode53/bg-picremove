import { useCallback, useEffect, useMemo, useState } from 'react';
import {useDropzone, FileRejection, FileError} from 'react-dropzone'
import FileUploadProgress from '../UI/FileUploadProgress';
import { SnackbarUtilities } from '../../utilities/snackbar-manager';
import { MyFileI } from '../../models/image-status.model';
import { baseStyle, focusStyle } from './styles';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import styles from './styles.module.css'

export interface UploadbleFile {
  file: MyFileI;
  errors: FileError[]
}

const index = () => {
  const [files, setFiles] = useState<UploadbleFile[]>([])

  const onDrop = useCallback((acceptedFiles:File[], rejectFiles:FileRejection[]) => {
    // Hacer lo que corresponde con los archivos
    acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))
    rejectFiles.map(({file, errors}) => {
      errors.map(({code, message}) => {
        // console.error(code, message)
        SnackbarUtilities.error(message)
      })
    })
    const accept = acceptedFiles.map((file) => ({file, errors:[]}))
    setFiles(accept)
  },[])

  const {
    acceptedFiles,
    fileRejections,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    maxFiles:1,
    accept:{
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/webp': ['.webp'],
    },
    onDrop
  },)

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusStyle: {}),
    ...(isDragActive? focusStyle: {})
  }),[
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive
  ])


  return (
    <form
      {...getRootProps({style})}
      action="https://res.cloudinary.com/v1_1/dn83qw1rq/image/upload"
      className={
        `${styles.formContainer}`
      }
    >
      {files.length > 0
        ? files.map(({file}) => (
          <FileUploadProgress key={file.path} file={file} />
        ))
        : (<div className={styles.uploadDiv}>
          {/* <button className="font-bold pointer-events-none bg-blue-600 rounded-full text-white text-xl px-8 py-3"> */}
          <button className={styles.uploadButton} type="button">
            <DriveFolderUploadIcon fontSize="large" className='mr-2' />
            Upload Image
          </button>
          <strong className={styles.small}>or drop a file</strong>
        </div>)
      }
    </form>
  );
}

export default index;