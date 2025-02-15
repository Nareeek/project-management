import { useEffect, useState } from "react";

export default function Notification({ message, type, onClose }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!show) return null;

    return (
        <div 
            className={`fixed top-5 right-5 z-50 p-3 rounded shadow-lg text-white ${
                type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
            {message}
        </div>
    );
}
