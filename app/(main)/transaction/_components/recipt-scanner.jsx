"use client"
import { scanReceipt } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

const ReciptScanner = ({ onScanComplete }) => {

    const fileInputRef = useRef()

    const {
        loading: scanReceiptLoading,
        fn: scanReceiptFn,
        data: scannedData,

    } = useFetch(scanReceipt)

    const handleReceiptScan = async (file) => {
        if (file.size > 10 * 1024 * 1024) {
            const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
            toast.error(`File is ${sizeInMB}MB. Max allowed size is 10MB.`);
            return
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image");
            return;
        }

        await scanReceiptFn(file)
    }


    useEffect(() => {
        if (scannedData && !scanReceiptLoading) {
            onScanComplete(scannedData);
            toast.success("Receipt scanned successfully")
        }
    }, [scanReceiptLoading, scannedData])


    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleReceiptScan(file);
                }}
            />

            <Button
                type='button'
                variant={'outline'}
                className='w-full h-10  cursor-pointer bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-95 transition-opacity text-white hover:text-White '

                onClick={() => fileInputRef.current?.click()}
                disabled={scanReceiptLoading}
            >
                {scanReceiptLoading ? (
                    <>
                        <Loader2 className='mr-2 animate-spin ' />
                        <span>Scanning Receipt...</span>
                    </>
                ) : (
                    <>
                        <Camera className='mr-2' />
                        <span>Scan Receipt with Ai</span>
                    </>
                )} </Button>
        </div>
    )
}

export default ReciptScanner