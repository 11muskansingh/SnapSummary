# SnapSummary - Document Summarization Assistant

SnapSummary is a powerful and intuitive document summarization tool built with Next.js and powered by the Google Generative AI. It allows users to upload various document types (PDF, images, text) and receive concise, context-aware summaries of different lengths (Short, Medium, Long).

## Features

- **Multi-Format Document Upload**: Supports PDF, PNG, JPEG, and TXT file formats.
- **Variable Summary Length**: Generate summaries tailored to your needs—choose from Short, Medium, or Long.
- **Intelligent Text Extraction**: Utilizes `pdfjs-dist` for PDFs and `tesseract.js` for images to accurately extract text.
- **AI-Powered Summarization**: Leverages the Google Generative AI API to produce high-quality, coherent summaries.
- **Sleek, Responsive UI**: A modern, user-friendly interface built with React and custom CSS for a seamless experience on all devices.
- **Interactive Experience**: Features include a drag-and-drop file upload area, real-time processing indicators, and a clean, readable summary display.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: JavaScript (ES6+)
- **AI**: [Google Generative AI](https://ai.google.dev/)
- **Text Extraction**:
  - [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) for PDF files.
  - [Tesseract.js](https://tesseract.projectnaptha.com/) for Optical Character Recognition (OCR) in images.
- **Styling**: Custom CSS Modules & Modern CSS techniques.
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm, yarn, or pnpm
- A Google AI API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/11muskansingh/SnapSummary.git
   cd SnapSummary
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a file named `.env.local` in the root of your project and add your Google Generative AI API key:
   ```
   GOOGLE_API_KEY="YOUR_API_KEY_HERE"
   ```

### Running the Development Server

To run the app in development mode, execute the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/src
|-- /app
|   |-- /api/summarize       # API route for handling summarization logic
|   |-- /about               # About page
|   |-- layout.js            # Main app layout
|   |-- page.js              # Homepage
|   `-- summarize/page.js    # Main summarization interface
|-- /components              # Reusable React components
|-- /styles                  # Global and component-specific styles
/public                      # Static assets (images, scripts)
```

## How It Works

1. **File Upload**: The user uploads a document through the `UploadArea` component on the homepage.
2. **Client-Side Processing**: The file is processed in the browser.
   - If it's a PDF, `pdfjs-dist` extracts the text content.
   - If it's an image, `Tesseract.js` performs OCR to extract text.
   - Text files are read directly.
3. **API Request**: The extracted text and the desired summary length are sent to the `/api/summarize` API route.
4. **AI Summarization**: The backend API handler securely calls the Google Generative AI API with a formatted prompt, requesting a summary of the provided text.
5. **Display Summary**: The generated summary is streamed back to the client and displayed in a clean, readable format on the `/summarize` page.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the creators of Next.js, Google Generative AI, and all the open-source libraries that made this project possible.
- Project inspired by the need for quick and accessible document analysis.
