"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, ImageIcon, Sparkles } from "lucide-react"
import Image from "next/image"
import axios from "axios"


const IMAGE_SIZES = [
  { value: "1-1", label: "1-1", width: 512, height: 512 },
  { value: "16-9", label: "16-9", width: 768, height: 768 },
  { value: "3-2", label: "3-2", width: 1024, height: 1024 },
  { value: "9-16", label: "9-16", width: 1024, height: 1024 },
]


async function getImagesFromServer(prompt:string,size:string) {
  const options = {
  method: 'POST',
  url: process.env.NEXT_PUBLIC_URL,
  headers: {
    'x-rapidapi-key': process.env.NEXT_PUBLIC_SECRETKEY,
    'x-rapidapi-host': process.env.NEXT_PUBLIC_APIHOST,
    'Content-Type': 'application/json'
  },
  data: {
    prompt:prompt,
    style_id: 2,
    size: size
  }
};
try {
	const response = await axios.request(options);
  return response.data;
} catch (error) {
	console.error(error);
}
}


export default function TextToImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [selectedSize, setSelectedSize] = useState("1-1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

const handleGenerate = async () => {
  if (!prompt.trim()) return;

  setIsGenerating(true);
  setGeneratedImage(null);

  try {
    const response = await getImagesFromServer(prompt, selectedSize);
    console.log(response);
    
    const imageFromServer = response?.final_result?.[0]?.origin;
    const size = IMAGE_SIZES.find((s) => s.value === selectedSize);
    
    let finalImage = imageFromServer;

    if (!finalImage && size) {
      finalImage = `/placeholder.svg?height=${size.height}&width=${size.width}&text=${encodeURIComponent(prompt.slice(0, 50))}`;
    }
    setGeneratedImage(finalImage);
    console.log("Set final image to:", finalImage);
    
  } catch (error) {
    console.error("Error generating image:", error);
  } finally {
    setIsGenerating(false);
  }
};


  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const selectedSizeData = IMAGE_SIZES.find((s) => s.value === selectedSize)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            PromptBot Studio
          </h1>
          <p className="text-gray-600">Transform your ideas into stunning visuals with AI</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Create Your Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Describe your image
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="A serene landscape with mountains and a lake at sunset, digital art style..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isGenerating}
                />
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Image Size</Label>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  disabled={isGenerating}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3"
                >
                  {IMAGE_SIZES.map((size) => (
                    <div key={size.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={size.value} id={size.value} />
                      <Label
                        htmlFor={size.value}
                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {size.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Image
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    {/* Shimmer Loading Effect */}
                    <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse">
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">Creating your masterpiece...</p>
                        <p className="text-sm text-gray-500">This may take a few moments</p>
                      </div>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={generatedImage || "/placeholder.svg"}
                      alt="Generated image"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Your generated image will appear here</p>
                    <p className="text-sm">Enter a prompt and click generate to start</p>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {generatedImage && !isGenerating && (
                <div className="mt-6">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full h-12 text-lg font-semibold bg-transparent"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Image
                  </Button>
                  <div className="mt-2 text-center text-sm text-gray-500">Size: {selectedSizeData?.label} pixels</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Utkarsh • Enjoy your images</p>
        </div>
      </div>
    </div>
  )
}
