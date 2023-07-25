import Head from "next/head";
import styles from "../styles/Home.module.css";

import { createClient } from "@supabase/supabase-js";
import { useRef } from "react";

// create supabase client with anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    persistSession: false,
  }
);

export default function Home() {
  const imageRef = useRef(null);

  const handleUpload = async (e) => {
    let file;

    if (e.target.files) {
      file = e.target.files[0];
    }
    // upload the file to the 'FooBucket' bucket in 'public' folder
    const { data, error } = await supabase.storage
      .from("FooBucket")
      .upload("public/" + file.name, file);
    console.log(file);
    console.log(data, error);
  };

  const handleDownload = async () => {
    // download the file from the 'FooBucket' bucket in 'public' folder
    const { data, error } = await supabase.storage
      .from("FooBucket")
      .download("public/" + "foo.png");
    console.log(data, error);
    // set the image source using the downloaded data
    imageRef.current.src = URL.createObjectURL(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <input
        type="file"
        accept="image/*"
        className="block w-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
        id="file_input"
        onChange={(e) => {
          handleUpload(e);
        }}
      />
      <button onClick={handleDownload}>click me</button>
      <img ref={imageRef}></img>
    </div>
  );
}
