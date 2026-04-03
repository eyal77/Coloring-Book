const colors = [
    // Reds / Pinks
    '#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300',
    '#FF69B4', '#FFB6C1', '#DC143C',
    // Oranges / Yellows
    '#FF8C00', '#FFA500', '#FFD700', '#FFFFE0',
    // Greens
    '#DAF7A6', '#33FF57', '#006400', '#98FB98', '#00FA9A',
    // Blues
    '#33FF57', '#3357FF', '#33FFF5', '#000080', '#87CEEB', '#4682B4',
    // Purples
    '#4B0082', '#8A2BE2', '#DDA0DD', '#F533FF',
    // Grayscale / Earth
    '#FFFFFF', '#C0C0C0', '#808080', '#000000', '#8B4513', '#A0522D'
];

const ColorPalette = ({ selectedColor, onSelectColor }) => {
    return (
        <div className="palette-container" style={{
            display: 'flex',
            gap: '10px',
            padding: '10px',
            background: '#2a2a2a',
            borderRadius: '8px',
            marginTop: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }}>
            {colors.map((color) => (
                <div
                    key={color}
                    onClick={() => onSelectColor(color)}
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: color,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: selectedColor === color ? '3px solid white' : '2px solid transparent',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        transition: 'transform 0.1s'
                    }}
                    title={color}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
            ))}
            <input
                type="color"
                value={selectedColor}
                onChange={(e) => onSelectColor(e.target.value)}
                style={{
                    width: '30px',
                    height: '30px',
                    padding: 0,
                    border: 'none',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}
            />
        </div>
    );
};

export default ColorPalette;
