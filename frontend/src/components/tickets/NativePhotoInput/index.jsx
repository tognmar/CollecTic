import React, {useEffect, useRef, useState} from 'react';
import useFetchPost from "../../../utilities/CustomHooks/UseFetchPost.jsx";
import {useLocation, useNavigate} from "react-router";
import {pdfjs} from 'react-pdf';
import WebcamDialog from "../../WebCamDialog/index.jsx";
import TicketImageCropper from "../../../sub-components/TicketImageCropper.jsx";
import {extractFirstError} from "../../../utilities/extractFirstError.jsx";
import {validateImage, validatePdf} from "../../../utilities/ImageProccess/validateImage.jsx";
import {useSelector} from "react-redux";
import {resizeImage} from "../../../utilities/ImageProccess/resizeImage.jsx";

// Configure the worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js';


const NativePhotoInput = ({fileInputRef}) => {

    const user = useSelector(state => state.user.details);

    const {state} = useLocation();
    const navigate = useNavigate();
    const {rawFile, fileUrl, from} = state || {};

    const [photo, setPhoto] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [fileType, setFileType] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [showWebcam, setShowWebcam] = useState(false);

    const [preview, setPreview] = useState(null);
    const [blobToSend, setBlobToSend] = useState(null);

    const cropperRef = useRef(null);
    const canvasRef = useRef(null);

    const {postData, isFetching, error, data, resetData} = useFetchPost('/tickets/extraction/');

    // On mount, validate & decide image vs PDF
    useEffect(() => {
        if (!rawFile || !fileUrl) {
            // no file → send them home
            navigate(`/profile/${user.id}`);
            return;
        }

        const isPDF = rawFile.type === 'application/pdf';
        const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(rawFile.type);

        let error =
            (isImage && validateImage(rawFile)) ||
            (isPDF && validatePdf(rawFile)) ||
            (!isPDF && !isImage && 'Unsupported file format (JPEG/JPG/PNG/PDF only).');

        if (error) {
            setLocalError({file: [error]});
            return;
        }

        setLocalError(null);

        if (isImage) {
            setFileType('image');
            setPhoto(fileUrl);
            setCropping(true);
        } else {
            setFileType('pdf');
            renderPdf(fileUrl);
        }
    }, [rawFile, fileUrl, navigate]);

    const handleCrop = () => {
        const canvas = cropperRef.current?.getCanvas(); // cropped canvas
        if (!canvas) return;

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            try {
                const croppedFile = new File([blob], 'ticket.jpg', {type: blob.type});
                const resizedFile = await resizeImage(croppedFile, 1024, 1024, 0.8);

                setBlobToSend(resizedFile);
                setPreview(URL.createObjectURL(resizedFile));
                setCropping(false);

            } catch (error) {
                const extracted = extractFirstError(error);
                setLocalError(extracted);
            }
        }, 'image/jpeg', 0.9);
    };

    const renderPdf = async (url) => {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        // Render the first page of the PDF
        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({scale});

        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            console.error("Canvas context not available");
            return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;

        canvas.toBlob(async (blob) => {
            if (!blob) {
                return;
            }

            const pdfImageFile = new File([blob], 'ticket-from-pdf.jpg', {type: blob.type});

            try {
                const resizedFile = await resizeImage(pdfImageFile, 1024, 1024, 0.8);
                const imageUrl = URL.createObjectURL(resizedFile);
                setPhoto(imageUrl);         // send resized image to cropper
                setCropping(true);
            } catch (err) {
                const extracted = extractFirstError(error);
                setLocalError(extracted);
            }
        }, 'image/jpeg', 0.9);
    };

    const handleWebcamCapture = (blob) => {
        const url = URL.createObjectURL(blob);
        setFileType('image');
        setRawFile(new File([blob], 'webcam.jpg', {type: 'image/jpeg'}));
        setPhoto(url);
        setCropping(true);
    };

    const handleSaveToBackend = async () => {

        const formData = new FormData();
        formData.append('file', blobToSend ?? rawFile, blobToSend ? 'ticket.jpg' : rawFile?.name || 'upload',);

        try {

            const res = await postData(formData);

            if (res?.id) {
                fileUrl && URL.revokeObjectURL(fileUrl);
                navigate(`/profile/${res.user_profile.id}`);
            } else {
                const extracted = extractFirstError(res);
                +setLocalError(extracted);
            }

        } catch (err) {
            const errorData = err.response?.data || err;
            const extracted = extractFirstError(errorData);
            setLocalError(extracted);
        }
    };

    useEffect(() => {
        return () => {
            preview && URL.revokeObjectURL(preview);
        };
    }, [preview]);

    useEffect(() => {
        return () => {
            fileUrl && URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    return (<>

        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-200 px-4 py-8">
            <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-6">

                {/* Error message */}
                {localError?.file && (
                    <div className="alert alert-error max-w-md w-full mt-4 shadow-lg pb-10  text-sm sm:text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01"/>
                        </svg>
                        <span className="break-words">{localError.file[0]}</span>
                    </div>
                )}

                {/* Hidden canvas for PDF rendering */}
                <canvas ref={canvasRef} className="hidden"/>

                {/* Webcam capture dialog */}
                {showWebcam && (
                    <WebcamDialog
                        onCapture={handleWebcamCapture}
                        onCancel={() => setShowWebcam(false)}
                    />
                )}

                {/* Fullscreen Cropper */}
                {cropping && photo && (


                    <TicketImageCropper
                        imageForCropping={photo}
                        onCrop={handleCrop}
                        cropperRef={cropperRef}
                    />


                )}

                {/* Cropped Preview + Save Actions */}
                {preview && (<>

                    <h3 className="text-lg font-semibold mb-4">
                        {fileType === 'pdf' ? 'PDF Preview:' : 'Cropped Image Preview:'}
                    </h3>

                    <img
                        src={preview}
                        alt="Cropped"
                        className="rounded-lg shadow-lg border max-w-full max-h-[60vh] object-contain"
                    />

                    <div className="mt-6 flex gap-3">
                        <button
                            className="btn-cropper text-white"
                            onClick={() => {
                                URL.revokeObjectURL(preview);
                                setPreview(null);
                                if (fileType === 'pdf') {
                                    renderPdf(fileUrl);
                                } else {
                                    setCropping(true);
                                }
                            }}
                        >
                            Back
                        </button>

                        <button
                            onClick={handleSaveToBackend}
                            disabled={isFetching}
                            className={`btn-cropper text-primary ${isFetching ? 'btn-cropper hover:bg-white/10 text-sm text-gray-100' : 'btn-cropper'}`}
                        >
                            {isFetching ? (
                                <div className={'flex items-center gap-2 text-primary'}>
                                    <span className="loading loading-spinner loading-sm text-primary"></span>
                                    Extracting data...
                                </div>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>

                </>)}
            </div>
        </div>
    </>);
};

export default NativePhotoInput;
