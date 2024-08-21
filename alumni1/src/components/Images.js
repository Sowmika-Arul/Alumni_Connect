import React, { useEffect, useState } from 'react';

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:5050/images');
                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5050/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error uploading image');
            }

            // Clear the file input
            setFile(null);

            // Fetch images again to update the gallery
            const imagesResponse = await fetch('http://localhost:5050/images');
            const imagesData = await imagesResponse.json();
            setImages(imagesData);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <h1>Image Gallery</h1>
            <div style={{ marginBottom: '20px' }}>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.imageUrl}
                        alt={`Artwork ${index}`} // Use a more descriptive alt text
                        style={{ 
                            width: '300px', 
                            height: 'auto', 
                            margin: '10px', 
                            borderRadius: '0' // Ensure images are not circular
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
