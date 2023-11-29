import "../stylesheets/modal.css";

const Modal = ({ show, onClose, task1, task2 }) => {
    if (!show) {
      return null;
    }
  
    return (
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title font-bold">Tasks</h4>
          </div>
          <div className="modal-body">
            <p>Task 1: {task1}</p>
            <p>Task 2: {task2}</p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };
  
export default Modal;