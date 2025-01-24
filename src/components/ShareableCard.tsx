import type React from 'react';

interface ShareableCardProps {
  playerName: string;
  description: string;
}

export const ShareableCard: React.FC<ShareableCardProps> = ({ playerName, description }) => {
  const baseUrl = 'https://artificialisle.lol';
  const shareUrl = `${baseUrl}/ai/${playerName.toLowerCase().split(' ')[0]}.html?a=1`;

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out ${playerName} in Artificial Isle! `);
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterShareUrl, '_blank');
  };

  return (
    <div className="mt-1">
      <p className="mb-4">{description}</p>
      <div className="flex items-center justify-between space-x-2">
        <img
          src={`/assets/agents-social-image/${playerName}.png`}
          alt={playerName}
          className="h-14 w-14 object-cover "
          onError={(e) => {
            e.currentTarget.src = '/assets/agents-social-image/Stella.png';
          }}
        />
        <button
          onClick={shareOnTwitter}
          className="button text-white bg-clay-700 px-4 py-1 rounded-full hover:bg-clay-600 transition-colors"
        >
          Share on Twitter
        </button>
      </div>
    </div>
  );
};
