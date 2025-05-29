import {useEffect, useRef} from 'react';

const WebcamDialog = ({onCapture, onCancel}) => {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);

  /* start the webcam once the dialog mounts */
  useEffect(() => {
    (async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({video: true});
        videoRef.current.srcObject = streamRef.current;
      } catch (err) {
        console.error(err);
        onCancel(err);
      }
    })();

    /* stop the webcam when we unmount */
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [onCancel]);

  const shoot = () => {
    const v = videoRef.current;
    const c = document.createElement('canvas');
    c.width  = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    c.toBlob(blob => onCapture(blob), 'image/jpeg', 0.9);
  };

   return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-xl bg-base-200">
        <h3 className="text-lg font-bold mb-3">Camera preview</h3>

        {/* keep the video 16:9 and fully contained */}
        <div className="aspect-video rounded-box overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* modal actions – DaisyUI automatically right-aligns them */}
        <form method="dialog" className="modal-action mt-4">
          <button
            type="button"
            onClick={shoot}
            className="btn btn-primary gap-2"
          >
            <span>Take photo</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default WebcamDialog;