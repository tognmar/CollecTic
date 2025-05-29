import React, {useEffect, useState} from 'react';
import {Cropper} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import '../styles/components.css';

export default function TicketImageCropper({imageForCropping, onCrop, cropperRef}) {
    const [image, setImage] = useState("");

    useEffect(() => {
        if (!(imageForCropping)) return;
        setImage(imageForCropping);
    }, [imageForCropping]);

    const defaultSize = ({imageSize, visibleArea}) => {
        return {
            width: (visibleArea || imageSize).width,
            height: (visibleArea || imageSize).height,
        };
    }

    const zoom = (zoomRatio) => {
        if (cropperRef.current) {
            cropperRef.current.zoomImage(zoomRatio); // zoom-in 2x
        }
    };

    const rotate = (angle) => {
        if (cropperRef.current) {
            cropperRef.current.rotateImage(angle);
        }
    };

    return (
        <div className="relative w-full max-w-screen-md mx-auto">
            <Cropper
                stencilProps={{grid: true}}
                ref={cropperRef}
                src={image}
                style={{width: '100%', height: '100%', padding: "1%"}}
                className={'cropper'}
                defaultCoordinates={defaultSize}
            />
            <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2  bg-black/20 rounded-lg p-2">
                <button className={'btn-cropper'} onClick={() => zoom(1.25)}>+</button>
                <button className={'btn-cropper'} onClick={() => zoom(0.75)}>−</button>
                <button className={'btn-cropper'} onClick={() => rotate(-90)}>⟲</button>
                <button className={'btn-cropper'} onClick={() => rotate(90)}>⟳</button>
                <button className={'btn-cropper text-primary'} onClick={onCrop}>Crop</button>
            </div>
        </div>
    )
};