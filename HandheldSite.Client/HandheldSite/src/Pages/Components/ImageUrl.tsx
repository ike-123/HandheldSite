import React, { useEffect, useState } from 'react'

interface ProfileImageUrlProps {
    image: string | null;
    TailwindStyles: string | undefined;
}

const ImageUrl: React.FC<ProfileImageUrlProps> = ({ image, TailwindStyles }) => {

    const [imageUrl, setImageUrl] = useState<string>();
    const [_TailwindStyles, setTailwindStyles] = useState<string | undefined>("");


    useEffect(() => {

        // console.log("image changed");

        if (!image || typeof image !== 'string') {

            console.log('no image');
            setImageUrl("")
            return;
        }

        const dataUrl = `data:image/jpeg;base64,${image}`;
        setImageUrl(dataUrl);
        setTailwindStyles(TailwindStyles);


        return () => {

            try { URL.revokeObjectURL(imageUrl!); } catch { }
        }

    }, [image]);


    return (
        // <div>{image}</div>

        <>
            {
                imageUrl
                    ?
                    <img className={_TailwindStyles} src={imageUrl} alt="" />

                    : ""

            }
        </>


    )
}

export default ImageUrl