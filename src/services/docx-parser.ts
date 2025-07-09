
import mammoth from "mammoth";
import {  GlobalWorkerOptions } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// You may need to provide the correct path to pdf.worker.js depending on your build setup
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/**
 * Detect file type and extract text from .docx or .pdf
 */
export async function parseFileToText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "docx") {
    return parseDocxToText(file);
  } else if (ext === "pdf") {
    return parsePdfToText(file);
  } else {
    throw new Error("Unsupported file type. Only .docx or .pdf allowed.");
  }
}

async function parseDocxToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export async function parsePdfToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += pageText + "\n";
  }

  return text.trim();
}

