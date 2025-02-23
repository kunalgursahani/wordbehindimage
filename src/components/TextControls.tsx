import React from 'react';
import ReactSlider from 'react-slider';
import { TextLayer } from '../types';
import { Trash2, RotateCcw, RotateCw, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

interface TextControlsProps {
  layers: TextLayer[];
  onLayerUpdate: (layer: TextLayer) => void;
  onLayerDelete: (id: string) => void;
  onAddLayer: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const fontFamilies = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Verdana',
  'Courier New'
];

const alignmentOptions = [
  { value: 'left', icon: AlignLeft },
  { value: 'center', icon: AlignCenter },
  { value: 'right', icon: AlignRight },
];

export function TextControls({
  layers,
  onLayerUpdate,
  onLayerDelete,
  onAddLayer,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: TextControlsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">Text Layers</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${
                canUndo 
                  ? 'text-indigo-500 hover:bg-indigo-50' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Undo"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${
                canRedo 
                  ? 'text-indigo-500 hover:bg-indigo-50' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Redo"
            >
              <RotateCw size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {layers.map((layer) => (
          <div key={layer.id} className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={layer.text}
                onChange={(e) => onLayerUpdate({ ...layer, text: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter text"
              />
              <button
                onClick={() => onLayerDelete(layer.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete layer"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Font Family</label>
                <select
                  value={layer.fontFamily}
                  onChange={(e) => onLayerUpdate({ ...layer, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={layer.color}
                    onChange={(e) => onLayerUpdate({ ...layer, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={layer.color}
                    onChange={(e) => onLayerUpdate({ ...layer, color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Text Alignment</label>
              <div className="flex gap-2">
                {alignmentOptions.map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => onLayerUpdate({ ...layer, textAlign: value as 'left' | 'center' | 'right' })}
                    className={`p-2 rounded-lg flex-1 ${
                      layer.textAlign === value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className="mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Font Size: {layer.fontSize}px
                </label>
                <input
                  type="number"
                  value={layer.fontSize}
                  onChange={(e) => onLayerUpdate({ ...layer, fontSize: Math.min(400, Math.max(12, Number(e.target.value))) })}
                  className="w-20 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="12"
                  max="400"
                />
              </div>
              <ReactSlider
                value={layer.fontSize}
                onChange={(value) => onLayerUpdate({ ...layer, fontSize: value })}
                min={12}
                max={400}
                className="h-2 bg-gray-200 rounded-full"
                thumbClassName="w-4 h-4 -mt-1 bg-indigo-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                trackClassName="h-2 bg-indigo-200 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rotation: {layer.rotation}°
              </label>
              <ReactSlider
                value={layer.rotation}
                onChange={(value) => onLayerUpdate({ ...layer, rotation: value })}
                min={-180}
                max={180}
                className="h-2 bg-gray-200 rounded-full"
                thumbClassName="w-4 h-4 -mt-1 bg-indigo-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                trackClassName="h-2 bg-indigo-200 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Opacity: {Math.round(layer.opacity * 100)}%
              </label>
              <ReactSlider
                value={layer.opacity * 100}
                onChange={(value) => onLayerUpdate({ ...layer, opacity: value / 100 })}
                min={0}
                max={100}
                className="h-2 bg-gray-200 rounded-full"
                thumbClassName="w-4 h-4 -mt-1 bg-indigo-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                trackClassName="h-2 bg-indigo-200 rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Outline Width: {layer.outlineWidth}px
                </label>
                <ReactSlider
                  value={layer.outlineWidth}
                  onChange={(value) => onLayerUpdate({ ...layer, outlineWidth: value })}
                  min={0}
                  max={10}
                  className="h-2 bg-gray-200 rounded-full"
                  thumbClassName="w-4 h-4 -mt-1 bg-indigo-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  trackClassName="h-2 bg-indigo-200 rounded-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Outline Color</label>
                <input
                  type="color"
                  value={layer.outlineColor}
                  onChange={(e) => onLayerUpdate({ ...layer, outlineColor: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Shadow Blur: {layer.shadowBlur}px
                </label>
                <ReactSlider
                  value={layer.shadowBlur}
                  onChange={(value) => onLayerUpdate({ ...layer, shadowBlur: value })}
                  min={0}
                  max={20}
                  className="h-2 bg-gray-200 rounded-full"
                  thumbClassName="w-4 h-4 -mt-1 bg-indigo-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  trackClassName="h-2 bg-indigo-200 rounded-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shadow Color</label>
                <input
                  type="color"
                  value={layer.shadowColor}
                  onChange={(e) => onLayerUpdate({ ...layer, shadowColor: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Position X: {layer.x}%
                </label>
                <ReactSlider
                  value={layer.x}
                  onChange={(value) => onLayerUpdate({ ...layer, x: value })}
                  min={0}
                  max={100}
                  className="h-2 bg-gray-200 rounded-full"
                  thumbClassName="w-4 h-4 -mt-1 bg-indigo-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  trackClassName="h-2 bg-indigo-200 rounded-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Position Y: {layer.y}%
                </label>
                <ReactSlider
                  value={layer.y}
                  onChange={(value) => onLayerUpdate({ ...layer, y: value })}
                  min={0}
                  max={100}
                  className="h-2 bg-gray-200 rounded-full"
                  thumbClassName="w-4 h-4 -mt-1 bg-indigo-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  trackClassName="h-2 bg-indigo-200 rounded-full"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={onAddLayer}
          className="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
        >
          Add Text Layer
        </button>
      </div>
    </div>
  );
}