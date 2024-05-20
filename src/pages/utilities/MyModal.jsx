export default function MyModal({ visible, children, closeModal}) {
  if (!visible) return null;
  const handleClose = (e) => {
    if (e.target.id === "container") closeModal();
  };
  

  return (
    <div
      id="container"
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-30  backdrop-blur-sm flex justify-center 
             items-center opacity-100 transition-all duration-500 ease-in-out"
    >
      <div className="bg-white rounded-3xl w-1/2 max-sm:w-5/6">
        {children}
      </div>
     
    </div>
  );
}
