'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { IoMdArrowBack } from 'react-icons/io';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [priceRange, setPriceRange] = useState<string>('');
  const [filteredLaptops, setFilteredLaptops] = useState<Laptop[]>([]);
  const [display, setDisplay] = useState(false);

  interface Laptop {
    Merek: string;
    Model: string;
    Harga: number;
    CPU: string;
    RAM: string;
    Penyimpanan: string;
  }
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (validateFile(uploadedFile)) {
        setFile(uploadedFile);
        setError(null);
      } else {
        setError('Please upload only XLSX files.');
        setFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  const validateFile = (file: File) => {
    const validExtensions = ['xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return validExtensions.includes(fileExtension || '') && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulating file upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/api/laptops/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      setDisplay(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setIsUploading(false);
    setFile(null);
    setUploadProgress(0);
  };

  const handleFilter = async () => {
    if (!priceRange) {
      alert('Please enter a valid price range.');
      return;
    }

    try {
      setIsFiltering(true);
      const [minPrice, maxPrice] = priceRange.split('-').map((price) => price.trim());
      const response = await axios.get('http://localhost:8000/api/laptops/filter', {
        params: {
          min_price: minPrice,
          max_price: maxPrice,
        },
      });
      setFilteredLaptops(response.data);
      setIsFiltering(false);
    } catch (error) {
      console.error('Error filtering laptops:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className={!display ? 'self-start ml-6' : 'hidden'}>
        <IoMdArrowBack className="w-6 h-6 text-white" />
      </Link>

      <div onClick={() => setDisplay(false)} className={display ? 'hover:cursor-pointer' : 'hidden'}>
        <IoMdArrowBack className="w-6 h-6 text-white" />
      </div>

      <div className="inline-block w-full text-center">
        <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">Filter </span>
        <span className="text-4xl font-bold text-violet-800 dark:text-violet-500"> Laptop</span>
        <div className="text-lg mt-4 text-neutraArjunal-800 dark:text-neutral-200">Filter laptop by price and Spec for your needs</div>
      </div>
      <Card className={display ? 'hidden' : `w-full max-w-md mx-auto mt-16`}>
        <CardContent className="p-6">
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag & drop your XLSX file here, or click to select</p>
              </div>
            )}
          </div>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          {isUploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <Button className="w-full mt-4" onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </CardContent>
      </Card>

      <Card className={display ? 'max-w-xl mx-auto mt-10 p-10 bg-white shadow-lg rounded-lg dark:bg-black' : 'hidden'}>
        <input type="text" placeholder="Enter price range (e.g., 5000000-10000000)" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-4" />
        <Button variant="outline" className="w-full" onClick={handleFilter} disabled={isFiltering}>
          {isFiltering ? 'Filtering...' : 'Filter'}
        </Button>

        {isFiltering ? (
          <div className="flex justify-center mt-6">
            <svg className="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {filteredLaptops.length > 0 ? (
              filteredLaptops.map((laptop, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-slate-950">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {laptop.Merek} {laptop.Model}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CPU: {laptop.CPU}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">RAM: {laptop.RAM}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Penyimpanan: {laptop.Penyimpanan}</p>
                  <p className="text-sm font-medium text-violet-700 dark:text-violet-400">Harga: Rp{laptop.Harga.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No laptops found.</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
//       <path d="M12 12v9" />
//       <path d="m16 16-4-4-4 4" />
//     </svg>
//   );
// }
