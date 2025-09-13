export const SubmitButton = ({ label }) => {
  return (
    <button
      type="submit"
      className="uppercase text-white bg-primary font-bold cursor-pointer p-2 rounded mb-2 w-full hover:bg-blue-900 transition-colors"
    >
      {label}
    </button>
  );
};
