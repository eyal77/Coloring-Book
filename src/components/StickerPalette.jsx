const stickers = [
    { id: 'star', label: '⭐', name: 'Star' },
    { id: 'heart', label: '❤️', name: 'Heart' },
    { id: 'sun', label: '☀️', name: 'Sun' },
    { id: 'cloud', label: '☁️', name: 'Cloud' },
    { id: 'moon', label: '🌙', name: 'Moon' },
    { id: 'flower', label: '🌸', name: 'Flower' },
];

const StickerPalette = ({ selectedSticker, onSelectSticker }) => {
    return (
        <div className="sticker-container" style={{
            display: 'flex',
            gap: '10px',
            padding: '10px',
            background: '#2a2a2a',
            borderRadius: '8px',
            marginTop: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            borderTop: '1px solid #444'
        }}>
            {stickers.map((sticker) => (
                <div
                    key={sticker.id}
                    onClick={() => onSelectSticker(sticker.id)}
                    style={{
                        fontSize: '1.5rem',
                        padding: '5px',
                        cursor: 'pointer',
                        backgroundColor: selectedSticker === sticker.id ? '#444' : 'transparent',
                        borderRadius: '4px',
                        border: selectedSticker === sticker.id ? '1px solid white' : '1px solid transparent',
                        transition: 'transform 0.1s'
                    }}
                    title={sticker.name}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {sticker.label}
                </div>
            ))}
        </div>
    );
};

export default StickerPalette;
