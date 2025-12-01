import React, { useEffect, useState } from 'react'
import No_User from '../../../public/No-User.png'

interface ProfileImageUrlProps {
    image: string | null;
    TailwindStyles: string | undefined;
}

const ProfileImageUrl: React.FC<ProfileImageUrlProps> = ({ image, TailwindStyles }) => {

    const [imageUrl, setImageUrl] = useState<string>();


    useEffect(() => {

        if (!image || typeof image !== 'string') {

            setImageUrl(No_User)
            return;
        }

        const dataUrl = `data:image/jpeg;base64,${image}`;
        setImageUrl(dataUrl);

        return () => {

            try { URL.revokeObjectURL(imageUrl!); } catch { }
        }

    }, [image]);


    return (
        // <div>{image}</div>
        
        <img className={TailwindStyles} src={imageUrl} alt="" />

    )
}

export default ProfileImageUrl