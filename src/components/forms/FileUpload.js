import React from 'react';
import Resizer from 'react-image-file-resizer';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Avatar, Badge } from 'antd';

const FileUpload = ({ values, setValues, setLoading }) => {
    const { user } = useSelector((state) => ({ ...state }));

    const fileUploadAndResize = (e) => {
        let files = e.target.files;
        let allUploadedFiles = values.images;

        if (files) {
            setLoading(true);
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    'jpeg',
                    100,
                    0,
                    (uri) => {
                        axios
                            .post(
                                `${process.env.REACT_APP_API}/upload-images`,
                                { image: uri },
                                {
                                    headers: {
                                        authtoken: user ? user.token : '',
                                    },
                                }
                            )
                            .then((res) => {
                                console.log(res);
                                setLoading(false);
                                allUploadedFiles.push(res.data);
                                setValues({
                                    ...values,
                                    images: allUploadedFiles,
                                });
                            })
                            .catch(() => {
                                setLoading(false);
                                console.log(
                                    'Upload images to cloudinary failed'
                                );
                            });
                    },
                    'base64'
                );
            }
        }
    };

    const handleImageRemove = (public_id) => {
        setLoading(true);
        axios
            .post(
                `${process.env.REACT_APP_API}/remove-images`,
                { public_id },
                { headers: { authtoken: user ? user.token : '' } }
            )
            .then(() => {
                setLoading(false);
                const { images } = values;
                let filteredImages = images.filter((image) => {
                    return image.public_id !== public_id;
                });
                setValues({ ...values, images: filteredImages });
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (
        <>
            <div className="row mb-3">
                {values.images &&
                    values.images.map((image) => (
                        <div className="col-2" key={image.public_id}>
                            <Badge
                                count="X"
                                onClick={() =>
                                    handleImageRemove(image.public_id)
                                }
                                style={{ cursor: 'pointer' }}
                            >
                                <Avatar
                                    src={image.url}
                                    size={100}
                                    shape="square"
                                />
                            </Badge>
                        </div>
                    ))}
            </div>
            <div className="row">
                <div className="col-4">
                    <label className="btn btn-primary">
                        Choose File
                        <input
                            type="file"
                            multiple
                            hidden
                            accept="images/*"
                            onChange={fileUploadAndResize}
                        />
                    </label>
                </div>
            </div>
        </>
    );
};

export default FileUpload;
