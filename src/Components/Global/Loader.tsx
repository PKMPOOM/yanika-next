import { FiLoader } from "react-icons/fi";

function Loader() {
  return (
    <main className=" min-h-full flex items-center justify-center pt-6">
      <div className=" mt-80 animate-spin text-4xl text-emerald-500">
        <FiLoader />
      </div>
    </main>
  );
}

export default Loader;
