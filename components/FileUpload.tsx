"use client";
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';

type DataPoint = Record<string, any>;

interface FileUploadProps {
  onFileProcessed: (data: DataPoint[], headers: string[], numericHeaders: string[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setFileName(null);
    const file = acceptedFiles[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length) {
            setError(`Error parsing ${file.name}: ${results.errors[0].message}`);
            return;
          }
          if (!results.data || results.data.length === 0) {
            setError("The CSV file is empty or could not be read.");
            return;
          }
          
          setFileName(file.name);
          const data = results.data as DataPoint[];
          const headers = Object.keys(data[0]);
          const numericHeaders = headers.filter(h => typeof data[0][h] === 'number' && !isNaN(data[0][h]));

          if (numericHeaders.length < 2) {
            setError("Dataset must contain at least two numeric columns for analysis.");
            return;
          }
          onFileProcessed(data, headers, numericHeaders);
        },
        error: (err) => {
          setError(`Failed to parse file: ${err?.message}`);
        }
      });
    }
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const baseStyle = 'p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center';
  const activeStyle = 'border-indigo-500 bg-indigo-500/10';
  const acceptStyle = 'border-green-500 bg-green-500/10';
  const rejectStyle = 'border-red-500 bg-red-500/10';

  return (
    <div className="w-full">
      <div {...getRootProps({ className: `${baseStyle} ${isDragActive ? activeStyle : ''} ${isDragAccept ? acceptStyle : ''} ${isDragReject ? rejectStyle : ''}` })}>
        <input {...getInputProps()} />
        <UploadCloud size={40} className={`mb-3 transition-colors ${isDragAccept ? 'text-green-500' : isDragReject ? 'text-red-500' : 'text-slate-500'}`} />
        {isDragActive ? <p className="font-semibold text-indigo-400">Drop the file here...</p> : <p className="text-slate-400">Drag & drop a CSV file here, or click to select</p>}
      </div>
      {fileName && !error && (
        <div className="mt-3 p-2 bg-green-500/10 text-green-300 rounded-md flex items-center gap-2 text-sm"><CheckCircle size={16}/><span>{fileName} loaded successfully.</span></div>
      )}
      {error && (
        <div className="mt-3 p-2 bg-red-500/10 text-red-400 rounded-md text-sm flex items-center gap-2"><XCircle size={16}/><span>{error}</span></div>
      )}
    </div>
  );
};
export default FileUpload;