import MainBtns from "@/components/MainBtns";

export default function Home() {
  return (
    <div className="main-page">
      <video
        className="bg-video"
        src="/4788-180289892_medium.mp4"
        playsInline
        loop
        autoPlay
        controls={false}
        muted
        data-not-lazy
      />
      <div className="middle-layer">
        <div className="title-group">
          <p className="eyebrow">Realtime Community Lounge</p>
          <h1 className="title">Live Chat</h1>
          <p className="subtitle">
            빠르게 접속하고, 가볍게 소통하는 실시간 채팅 공간
          </p>
        </div>
        <MainBtns />
      </div>
    </div>
  );
}
