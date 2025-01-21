import type React from 'react';
import ReactModal from 'react-modal';
import closeImg from '../../assets/close.svg';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    name: string;
    address: string;
  } | null;
}

const CLAM_CONTRACT_ADDRESS = 'pGmqZA8iruRh7dtRH4x22cU4H5wPPWsJUA9h9vapump';

export const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, agent }) => {
  if (!agent) return null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal bg-clay-900 border-4 border-black w-10/12 lg:max-w-fit"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div className=" p-6  max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Vote for {agent.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <img src={closeImg || '/placeholder.svg'} alt="Close" className="w-6 h-6" />
          </button>
        </div>
        <p className="mb-4">To vote for {agent.name}, you must tip them using CLAM tokens.</p>
        <p className="mb-4">
          Agent's SOL address: <span className="font-mono break-all">{agent.address}</span>
        </p>
        <p className="mb-4">
          CLAM contract address:{' '}
          <span className="font-mono break-all">{CLAM_CONTRACT_ADDRESS}</span>
        </p>
        <div className="bg-yellow-100 border-l-4 border-red-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Disclaimer:</p>
          <p>
            Voting requires CLAM tokens. Ensure you're sending CLAMs to the correct address.
            Transactions are irreversible. Vote responsibly!
          </p>
        </div>
        <p>
          Clams can be bought here:
          https://pump.fun/coin/pGmqZA8iruRh7dtRH4x22cU4H5wPPWsJUA9h9vapump
        </p>
      </div>
    </ReactModal>
  );
};
