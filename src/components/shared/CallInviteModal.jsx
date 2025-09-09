export const CallInviteModal = ({ call, onAnswer }) => {
  if (!call) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Incoming Call</h2>
        <p className="mb-6">User {call.caller_id} is calling you...</p>
        <div className="flex justify-around">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => onAnswer(true)}
          >
            Accept
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => onAnswer(false)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
