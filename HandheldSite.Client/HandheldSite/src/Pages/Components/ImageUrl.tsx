import React, { useEffect, useState } from 'react'

interface ProfileImageUrlProps {
    image: string | null;
    TailwindStyles: string | undefined;
}

const ImageUrl: React.FC<ProfileImageUrlProps> = ({ image,TailwindStyles }) => {

    const [imageUrl, setImageUrl] = useState<string>();
    

    useEffect(() => {

        if (!image) return;

        if (typeof image === 'string') {
            console.log("heeeey 2")
            const dataUrl = `data:image/jpeg;base64,${image}`;
            setImageUrl(dataUrl);
            return;
        }

        return () => {

            try { URL.revokeObjectURL(imageUrl!); } catch { }
        }

    }, [image]);


    return (
        // <div>{image}</div>
        <img className={TailwindStyles} src={imageUrl} alt="" />

    )
}

export default ImageUrl