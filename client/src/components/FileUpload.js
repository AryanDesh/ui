import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YjYyMjE1Ni05ZWFjLTQyOWEtYjNlMi02YmQ1YmY4ZTUyMjQiLCJlbWFpbCI6ImFkZXNobXVraDg0M0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2M0YTBiZGE4MWVjMDM5ODQyMjQiLCJzY29wZWRLZXlTZWNyZXQiOiIxZGVlYTBjZjE0NDY4NDM4OTE0MWE2ZWNkNGE0MDdkOWM4NTc4ZjA2ZTA4MmMwMDA1MWRhMTU0ZDU1NWQ2YjliIiwiaWF0IjoxNzA5NjkyNzY3fQ.Bskq31BpW1Et7lPQ00Lsdh4vjxHD6AIW_lnsDbDX-1Y',
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(resFile.data);
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        const signer = contract.connect(provider.getSigner());
        await signer.add(account, ImgHash);

        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
        console.error(e);
      }
    }
    setFileName("No image selected");
    setFile(null);
  };

  const retrieveFile = async (e) => {
    const data = await e.target.files[0];
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
