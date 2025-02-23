import React, { useEffect, useRef } from 'react';
import { TextLayer, ImageState } from '../types';

interface CanvasProps {
  imageState: ImageState;
  textLayers: TextLayer[];
  blurAmount: number;
}

export function Canvas({ imageState, textLayers, blurAmount }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageState.preview) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = imageState.preview;
    
    image.onload = () => {
      // Set canvas size to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Create temporary canvases for layers
      const backgroundCanvas = document.createElement('canvas');
      const textCanvas = document.createElement('canvas');
      const subjectCanvas = document.createElement('canvas');
      
      backgroundCanvas.width = canvas.width;
      backgroundCanvas.height = canvas.height;
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      subjectCanvas.width = canvas.width;
      subjectCanvas.height = canvas.height;

      const bgCtx = backgroundCanvas.getContext('2d');
      const textCtx = textCanvas.getContext('2d');
      const subjectCtx = subjectCanvas.getContext('2d');
      
      if (!bgCtx || !textCtx || !subjectCtx) return;

      // Draw and blur background
      bgCtx.filter = `blur(${blurAmount}px)`;
      bgCtx.drawImage(image, 0, 0);
      bgCtx.filter = 'none';

      // Draw text on separate canvas
      textLayers.forEach(layer => {
        textCtx.save();
        
        // Set text properties
        textCtx.font = `${layer.fontSize}px ${layer.fontFamily}`;
        textCtx.fillStyle = layer.color;
        textCtx.textAlign = layer.textAlign;
        textCtx.globalAlpha = layer.opacity;
        
        const x = (layer.x / 100) * canvas.width;
        const y = (layer.y / 100) * canvas.height;
        
        // Apply rotation
        textCtx.translate(x, y);
        textCtx.rotate((layer.rotation * Math.PI) / 180);
        
        // Apply shadow
        if (layer.shadowBlur > 0) {
          textCtx.shadowColor = layer.shadowColor;
          textCtx.shadowBlur = layer.shadowBlur;
          textCtx.shadowOffsetX = 0;
          textCtx.shadowOffsetY = 2;
        }
        
        // Draw text outline
        if (layer.outlineWidth > 0) {
          textCtx.strokeStyle = layer.outlineColor;
          textCtx.lineWidth = layer.outlineWidth;
          textCtx.strokeText(layer.text, 0, 0);
        }
        
        // Draw text fill
        textCtx.fillText(layer.text, 0, 0);
        
        textCtx.restore();
      });

      // Extract subject using the mask
      if (imageState.mask) {
        // Draw original image on subject canvas
        subjectCtx.drawImage(image, 0, 0);
        
        // Apply mask to subject
        const imageData = subjectCtx.getImageData(0, 0, canvas.width, canvas.height);
        const maskData = imageState.mask;

        for (let i = 0; i < imageData.data.length; i += 4) {
          // Apply feathering to the mask edges
          const featherRadius = 2;
          let alpha = maskData.data[i + 3];
          
          if (alpha > 0 && alpha < 255) {
            let surroundingAlpha = 0;
            let count = 0;
            
            // Sample surrounding pixels for smooth edges
            for (let dx = -featherRadius; dx <= featherRadius; dx++) {
              for (let dy = -featherRadius; dy <= featherRadius; dy++) {
                const offset = (i / 4 + dx + dy * canvas.width) * 4;
                if (offset >= 0 && offset < maskData.data.length) {
                  surroundingAlpha += maskData.data[offset + 3];
                  count++;
                }
              }
            }
            
            alpha = surroundingAlpha / count;
          }

          // Apply the smoothed alpha to the subject
          imageData.data[i + 3] = alpha;
        }

        subjectCtx.putImageData(imageData, 0, 0);
      }

      // Layer composition on main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw background with blur
      ctx.drawImage(backgroundCanvas, 0, 0);
      
      // 2. Draw text
      ctx.drawImage(textCanvas, 0, 0);
      
      // 3. Draw subject on top
      if (imageState.mask) {
        ctx.drawImage(subjectCanvas, 0, 0);
      } else {
        ctx.drawImage(image, 0, 0);
      }
    };
  }, [imageState, textLayers, blurAmount]);

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-lg shadow-lg">
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
      />
    </div>
  );
}