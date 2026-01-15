export default function Input(props) {
  return (
    <input
      {...props}
      className={`w-full bg-[#0b0f1a]/80 backdrop-blur-xl
      border border-white/20 rounded-xl px-4 py-2 text-white
      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
      hover:bg-white/5 transition ${props.className || ""}`}
    />
  );
}
