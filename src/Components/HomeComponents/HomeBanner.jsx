import Banner from "/src/assets/newImage/HomeBanner.jpg";
import { TypeAnimation } from 'react-type-animation';

function HomeBanner() {
  return (
    <div
      className="h-[500px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${Banner})` }}
    >
      <TypeAnimation
        sequence={[
          'Explore.', 500,
          'Explore. Interact.', 500,
          'Explore. Interact. Learn', 500,
          'Explore. Interact. Learn like', 500,
          'Explore. Interact. Learn like never', 500,
          'Explore. Interact. Learn like never before.', 2000,
          '', 1000 
        ]}
        wrapper="h1"
        className="text-white p-4 text-6xl text-center leading-[100px] whitespace-pre-line"
        speed={50}
        repeat={Infinity}
      />
    </div>
  );
}

export default HomeBanner;