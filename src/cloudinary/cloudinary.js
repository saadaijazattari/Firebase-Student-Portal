// cloudinary.js
export const uploadImage = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "coderSaad");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dplhoc2lf/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const img = await res.json();
  return img.secure_url;
};








export const uploadImages = async (files) => {
  const urls = await Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "coderSaad");
      formData.append("cloud_name", "dplhoc2lf");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dplhoc2lf/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    })
  );

  return urls; // array of URLs
};



export const uploadPDFs = async (files) => {
  const urls = await Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "coderSaad");
      formData.append("cloud_name", "dplhoc2lf");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dplhoc2lf/raw/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    })
  );

  return urls;
};
