import { PDFParse } from 'pdf-parse';

const extractedTextFormPDF = async (fileBuffer) => {
    try {
        // Instantiate the parser with the buffer data
        const parser = new PDFParse({ data: fileBuffer });
        
        // Extract the text
        const result = await parser.getText();
        return result.text;
        
    } catch (error) {
        console.error('Error in PdfServices:', error);
        throw new Error('Failed to extract text from PDF');
    }
};

export default extractedTextFormPDF;
