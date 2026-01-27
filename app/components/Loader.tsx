import Image from "next/image";

const Loader = () => {
  return (
    <div className="absolute top-[40%] w-full text-center">
      <Image
        src="/arcavian-logo.png"
        width={100}
        height={100}
        alt="Hero"
        className="mx-auto h-30 w-30 animate-pulse object-cover max-sm:mt-5"
      />
    </div>
  );
};

export default Loader;