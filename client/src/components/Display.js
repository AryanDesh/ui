import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
    }
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      const images = str_array.map((item, i) => {
        return (
          <a href={item} key={i} target="_blank" rel="noopener noreferrer">
            <img
              key={i}
              src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
              alt={item.substring(item.lastIndexOf("/") + 42)}
              className="image-list"
            ></img>
          </a>
        );
      });
      setData(images);
      toggleSidebar(); // Open sidebar when data is fetched
    } else {
      alert("No image to display");
    }
  };

  return (
    <>
      <div className="display-container">
        <input
          type="text"
          placeholder="Enter Address"
          className="address"
        ></input>
        <button className="center button" onClick={getdata}>
          Get Data
        </button>
      </div>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Data List</h2>
          <button className="close-button" onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <div className="sidebar-content">
          {data.length > 0 ? data : <p>No data available</p>}
        </div>
      </div>
    </>
  );
};

export default Display;
