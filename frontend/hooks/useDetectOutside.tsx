import React, { useEffect } from 'react'

interface DetectOutsideProps {
    ref: React.RefObject<HTMLDivElement>;
    callback: () => void;
}

const useDetectOutside = ({ref, callback}: DetectOutsideProps) => {

    useEffect(() => {
        // handler to detect click outside ref element
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        // add event listener
        document.addEventListener("mousedown", handleClickOutside);
        // remove event listener (cleanup)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);

    return (
        <div>
        
        </div>
    )
}

export default useDetectOutside
