import React, { useState, useRef} from "react";
import ProfileImage from "../../img/profileImg.jpg";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
// import {  useDispatch } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage,uploadPost} from "../../actions/UploadAction";

const PostShare = () => {
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const { users } = useSelector((state) => state.authReducer);
  const loading = useSelector((state) => state.postReducer.uploading);

  // const post=useSelector((state)=>state.postReduser.userId)

  console.log(users)
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const desc = useRef();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img)

    }
  };

  const reset=()=>{
    setImage(null)
    desc.current.value="";
  }
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      //post data
      const newPost = {
        userId: user._id,
        desc: desc.current.value,
      };
  
      // if there is an image with post
      if (image) {
        const data = new FormData();
        const fileName = Date.now() + image.name;
        data.append("name", fileName);
        data.append("file", image);
        newPost.image = fileName;
        console.log(newPost);
        try {
          dispatch(uploadImage(data));
        } catch (err) {
          console.log(err);
        }
      }
      dispatch(uploadPost(newPost));
      // resetShare();
      reset()

    };


  return (
    <div className="PostShare">
      <img src={user.profilePicture
              ? serverPublic + user.profilePicture
              : serverPublic + "defaultProfile.png"} alt="" />
      <div>
        <input type="text" placeholder="What's happening"
        ref={desc} />
        <div className="postOptions">
          <div className="option" style={{ color: "var(--photo)" }}
          onClick={()=>imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>{" "}
          <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>{" "}
          <div className="option" style={{ color: "var(--shedule)" }}>
            <UilSchedule />
            Shedule
          </div>
          <button className="button ps-button"
          onClick={handleSubmit} disabled={loading}>
            {loading?"updating.." :"share"}
            </button>
          <div style={{ display: "none" }}>
            <input
              type="file"
              name="myImage"
              ref={imageRef}
              onChange={onImageChange}
            />
          </div>
        </div>
      {image && (

        <div className="previewImage">
          <UilTimes onClick={()=>setImage(null)}/>
          <img src={URL.createObjectURL(image)} alt="" />
        </div>

      )}


      </div>
    </div>
  );
};

export default PostShare;
