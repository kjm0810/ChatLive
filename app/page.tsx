import MainBtns from "@/components/MainBtns";
import Link from "next/dist/client/link";

export default function Home() {
  return (
    <div className="main-page">

      <video className="bg-video" src="/4788-180289892_medium.mp4" playsInline
      webkit-playsinline="true"
   loop autoPlay controls={false} muted data-not-lazy></video>
      
      <div className="middle-layer">
        <h1 className="title">
          Live Chat
        </h1>

        
          <MainBtns />
        
      </div>

    </div>
  );
}