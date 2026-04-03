import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { floodFill } from '../utils/floodFill';

const CanvasEditor = forwardRef(({ imageSrc, selectedColor, selectedTool }, ref) => {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const historyRef = useRef([]);

    useImperativeHandle(ref, () => ({
        undo: () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (historyRef.current.length > 0) {
                const lastImageData = historyRef.current.pop();
                ctx.putImageData(lastImageData, 0, 0);
            }
        }
    }));

    const saveHistory = (ctx, canvas) => {
        if (historyRef.current.length > 10) {
            historyRef.current.shift(); // Limit history to 10 steps
        }
        historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };

    useEffect(() => {
        if (!imageSrc) return;
        // Clear history on new image
        historyRef.current = [];

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const img = new Image();

        img.onload = () => {
            // Set canvas internal resolution to match image
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // We don't need manual scale state anymore, we'll use CSS for display size
        };

        img.src = imageSrc;
    }, [imageSrc]);

    const handleCanvasClick = (e) => {
        if (!selectedColor) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Get the bounding rectangle of the canvas as it appears on screen
        const rect = canvas.getBoundingClientRect();

        // Calculate the scale factors between displayed size and internal resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Map screen coordinates to internal canvas coordinates
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        // Save state before modifying
        saveHistory(ctx, canvas);

        if (selectedTool && selectedTool !== 'fill') {
            // Draw sticker
            drawSticker(ctx, x, y, selectedTool);
        } else {
            // Perform flood fill
            floodFill(ctx, x, y, selectedColor);
        }
    };

    const drawSticker = (ctx, x, y, type) => {
        ctx.lineWidth = 2;
        const size = 50; // Base size for stickers

        ctx.save();
        ctx.translate(x, y);

        ctx.beginPath();
        if (type === 'star') {
            ctx.fillStyle = '#FFD700'; // Gold
            ctx.strokeStyle = '#DAA520'; // GoldenRod
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * size,
                    -Math.sin((18 + i * 72) * Math.PI / 180) * size);
                ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * size / 2,
                    -Math.sin((54 + i * 72) * Math.PI / 180) * size / 2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (type === 'heart') {
            ctx.fillStyle = '#FF0000'; // Red
            ctx.strokeStyle = '#8B0000'; // DarkRed
            const topCurveHeight = size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            // top left curve
            ctx.bezierCurveTo(
                0, -size / 2,
                -size, -size / 2,
                -size, topCurveHeight
            );
            // bottom left curve
            ctx.bezierCurveTo(
                -size, (size + topCurveHeight) / 2,
                0, size,
                0, size
            );
            // bottom right curve
            ctx.bezierCurveTo(
                0, size,
                size, (size + topCurveHeight) / 2,
                size, topCurveHeight
            );
            // top right curve
            ctx.bezierCurveTo(
                size, -size / 2,
                0, -size / 2,
                0, topCurveHeight
            );
            ctx.fill();
            ctx.stroke();
        } else if (type === 'sun') {
            ctx.fillStyle = '#FFA500'; // Orange
            ctx.strokeStyle = '#FF4500'; // OrangeRed
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                ctx.moveTo(Math.cos(i * Math.PI / 4) * (size / 2 + 5), Math.sin(i * Math.PI / 4) * (size / 2 + 5));
                ctx.lineTo(Math.cos(i * Math.PI / 4) * (size), Math.sin(i * Math.PI / 4) * (size));
            }
            ctx.stroke();
        } else if (type === 'cloud') {
            ctx.fillStyle = '#E0FFFF'; // LightCyan
            ctx.strokeStyle = '#87CEEB'; // SkyBlue
            ctx.arc(-20, 0, 20, Math.PI * 0.5, Math.PI * 1.5);
            ctx.arc(20, 0, 20, Math.PI * 1, Math.PI * 2);
            ctx.arc(50, 0, 20, Math.PI * 1.2, Math.PI * 2.2);
            ctx.moveTo(-20, 20);
            ctx.lineTo(50, 20);
            ctx.closePath(); // Close the cloud shape to fill it propertly
            ctx.fill();
            ctx.stroke();
        } else if (type === 'moon') {
            ctx.fillStyle = '#F0E68C'; // Khaki
            ctx.strokeStyle = '#BDB76B'; // DarkKhaki
            ctx.arc(0, 0, size * 0.8, -Math.PI / 2, Math.PI / 2, true);
            ctx.quadraticCurveTo(size * 0.5, 0, 0, -size * 0.8);
            ctx.fill();
            ctx.stroke();
        } else if (type === 'flower') {
            ctx.fillStyle = '#FF69B4'; // HotPink
            ctx.strokeStyle = '#C71585'; // MediumVioletRed
            for (let i = 0; i < 6; i++) {
                ctx.save();
                ctx.rotate(i * Math.PI / 3);
                ctx.translate(0, size * 0.4);
                ctx.beginPath();
                ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            ctx.beginPath();
            ctx.fillStyle = '#FFFF00'; // Yellow center
            ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    };

    return (
        <div className="canvas-container" style={{
            width: '100%',
            height: 'calc(100vh - 200px)', // Leave space for header and palette
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #444',
            borderRadius: '8px',
            background: '#1a1a1a',
            position: 'relative'
        }}>
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    cursor: `crosshair`, // Simplified cursor to avoid encoding issues
                }}
            />
        </div>
    );
});

export default CanvasEditor;
