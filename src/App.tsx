import React, { useState, useCallback, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';
import { ImageUpload } from './components/ImageUpload';
import { TextControls } from './components/TextControls';
import { Canvas } from './components/Canvas';
import { TextLayer, ImageState, TextHistory } from './types';
import { Download, Sparkles, Image as ImageIcon, Type, Wand2, Github, Twitter, Instagram } from 'lucide-react';

const MAX_HISTORY = 50;

function App() {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    preview: null,
    mask: null
  });

  const [history, setHistory] = useState<TextHistory>({
    past: [],
    present: [],
    future: []
  });

  const [blurAmount, setBlurAmount] = useState(5);
  const [model, setModel] = useState<bodyPix.BodyPix | null>(null);

  // Load BodyPix model
  useEffect(() => {
    bodyPix.load().then(loadedModel => {
      setModel(loadedModel);
    });
  }, []);

  const processImage = useCallback(async (imageUrl: string) => {
    if (!model) return;

    const img = new Image();
    img.src = imageUrl;
    
    await img.decode();
    const segmentation = await model.segmentPerson(img);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const imageData = ctx.createImageData(img.width, img.height);
      for (let i = 0; i < segmentation.data.length; i++) {
        const pixelIndex = i * 4;
        imageData.data[pixelIndex + 3] = segmentation.data[i] ? 255 : 0;
      }
      setImageState(prev => ({ ...prev, mask: imageData }));
    }
  }, [model]);

  const handleImageUpload = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    setImageState({ file, preview, mask: null });
    processImage(preview);
  }, [processImage]);

  const handleAddLayer = useCallback(() => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'New Text',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#FFFFFF',
      rotation: 0,
      opacity: 1,
      outlineWidth: 2,
      outlineColor: '#000000',
      shadowBlur: 4,
      shadowColor: 'rgba(0,0,0,0.5)',
      textAlign: 'center'
    };
    
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: [...prev.present, newLayer],
      future: []
    }));
  }, []);

  const handleLayerUpdate = useCallback((updatedLayer: TextLayer) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: prev.present.map(layer => 
        layer.id === updatedLayer.id ? updatedLayer : layer
      ),
      future: []
    }));
  }, []);

  const handleLayerDelete = useCallback((id: string) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: prev.present.filter(layer => layer.id !== id),
      future: []
    }));
  }, []);

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future].slice(0, MAX_HISTORY)
      };
    });
  }, []);

  const handleRedo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      const newFuture = prev.future.slice(1);
      const newPresent = prev.future[0];
      return {
        past: [...prev.past, prev.present].slice(-MAX_HISTORY),
        present: newPresent,
        future: newFuture
      };
    });
  }, []);

  const handleDownload = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'text-behind-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold text-gray-900">TextBehind</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#examples" className="text-gray-600 hover:text-gray-900">Examples</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
              Text Behind Image
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create stunning visuals by adding text behind your subjects. Perfect for social media posts, marketing materials, and creative projects.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 mb-12">
            <div className="relative p-8 bg-white rounded-2xl shadow-sm">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
                1
              </div>
              <ImageIcon className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
              <p className="mt-2 text-gray-600">
                Upload your photo. Our AI will automatically detect and separate the subject.
              </p>
            </div>
            <div className="relative p-8 bg-white rounded-2xl shadow-sm">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
                2
              </div>
              <Type className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Add Text</h3>
              <p className="mt-2 text-gray-600">
                Add your text and customize its style, position, and effects.
              </p>
            </div>
            <div className="relative p-8 bg-white rounded-2xl shadow-sm">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
                3
              </div>
              <Wand2 className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Create Magic</h3>
              <p className="mt-2 text-gray-600">
                Download your creation and share it with the world.
              </p>
            </div>
          </div>

          {/* Editor Section */}
          <div className={`transition-all duration-300 ${imageState.preview ? 'opacity-100' : 'opacity-0'}`}>
            {imageState.preview && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <Canvas
                      imageState={imageState}
                      textLayers={history.present}
                      blurAmount={blurAmount}
                    />
                    <div className="mt-6 flex justify-between items-center">
                      <button
                        onClick={() => setImageState({ file: null, preview: null, mask: null })}
                        className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Upload New Image
                      </button>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        <Download size={20} />
                        Download Image
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Background Blur: {blurAmount}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={blurAmount}
                        onChange={(e) => setBlurAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <TextControls
                    layers={history.present}
                    onLayerUpdate={handleLayerUpdate}
                    onLayerDelete={handleLayerDelete}
                    onAddLayer={handleAddLayer}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={history.past.length > 0}
                    canRedo={history.future.length > 0}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className={`transition-all duration-300 ${!imageState.preview ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                <span className="text-lg font-bold text-gray-900">TextBehind</span>
              </div>
              <p className="text-gray-600">
                Create stunning visuals with text behind your subjects.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} TextBehind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;