import { useState, useRef } from 'react';
import CanvasEditor from './components/CanvasEditor';
import ColorPalette from './components/ColorPalette';
import StickerPalette from './components/StickerPalette';

function App() {
    const [imageSrc, setImageSrc] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#FF5733');
    const [selectedTool, setSelectedTool] = useState(null); // null = fill, string = sticker id
    const canvasRef = useRef(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                if (file.type === 'application/pdf') {
                    // Dynamic import to avoid loading pdfjs if not needed immediately
                    const { convertPdfToImage } = await import('./utils/pdfLoader');
                    const image = await convertPdfToImage(file);
                    setImageSrc(image);
                } else {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setImageSrc(event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            } catch (error) {
                console.error("Error loading file:", error);
                alert("Failed to load file. See console for details.");
            }
        }
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setSelectedTool(null); // Explicitly switch to fill mode
    };

    const handleUndo = () => {
        if (canvasRef.current) {
            canvasRef.current.undo();
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: '"Inter", sans-serif'
        }}>
            <h1 style={{ marginBottom: '20px', fontSize: '2.5rem', fontWeight: 'bold', background: '-webkit-linear-gradient(45deg, #FF5733, #33FF57)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Magical Coloring Book
            </h1>

            {!imageSrc ? (
                <div style={{
                    border: '2px dashed #666',
                    borderRadius: '12px',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#2a2a2a',
                    transition: 'border-color 0.3s'
                }}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#fff'; }}
                    onDragLeave={(e) => { e.currentTarget.style.borderColor = '#666'; }}
                    onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = '#666';
                        const file = e.dataTransfer.files[0];
                        if (file) {
                            try {
                                if (file.type === 'application/pdf') {
                                    const { convertPdfToImage } = await import('./utils/pdfLoader');
                                    const image = await convertPdfToImage(file);
                                    setImageSrc(image);
                                } else {
                                    const reader = new FileReader();
                                    reader.onload = (event) => setImageSrc(event.target.result);
                                    reader.readAsDataURL(file);
                                }
                            } catch (error) {
                                console.error("Error loading file:", error);
                                alert("Failed to load file. See console for details.");
                            }
                        }
                    }}
                >
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '3rem' }}>🎨</span>
                        <span style={{ fontSize: '1.2rem', color: '#ccc' }}>Click to upload or drag & drop an image or PDF</span>
                        <span style={{ fontSize: '0.9rem', color: '#888' }}>Supports PNG, JPG, PDF</span>
                    </label>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setImageSrc(null)} style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #555',
                            background: '#333',
                            color: 'white',
                            cursor: 'pointer'
                        }}>
                            Change Image
                        </button>
                        <button onClick={handleUndo} style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #555',
                            background: '#333',
                            color: 'white',
                            cursor: 'pointer'
                        }}>
                            Undo ↩️
                        </button>
                    </div>

                    <CanvasEditor ref={canvasRef} imageSrc={imageSrc} selectedColor={selectedColor} selectedTool={selectedTool} />

                    <ColorPalette selectedColor={selectedColor} onSelectColor={handleColorSelect} />

                    <StickerPalette selectedSticker={selectedTool} onSelectSticker={setSelectedTool} />
                </div>
            )}
        </div>
    );
}

export default App;
