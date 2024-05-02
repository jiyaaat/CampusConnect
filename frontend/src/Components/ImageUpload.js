import { useState } from "react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

const ImageUpload = ({ publicId, setPublicId }) => {
  const [cloudName] = useState("dtehlvsg6");
  const [uploadPreset] = useState("sjzieumg");

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    multiple: false,
  });

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);

  return (
    <div>
      <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
      <AdvancedImage
        style={{ maxWidth: "100%" }}
        cldImg={myImage}
        plugins={[responsive(), placeholder()]}
      />
    </div>
  );
};

export default ImageUpload;
