
/**
 * Initiates a file download in the browser.
 * @param {string} filename - The desired name of the file.
 * @param {string} content - The content of the file.
 * @param {string} mimeType - The MIME type of the file.
 */
const downloadFile = (filename: string, content: string, mimeType: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

/**
 * Converts simple HTML content to a Markdown-like plain text format.
 * This preserves basic formatting like bold, italic, and underline.
 * @param {string} htmlContent - The HTML string from the editor.
 * @returns {string} The converted plain text with Markdown-style formatting.
 */
const htmlToMarkdown = (htmlContent: string): string => {
    let text = htmlContent;

    // Replace <br> with a single newline.
    text = text.replace(/<br\s*\/?>/gi, '\n');

    // Handle block elements like <div> and <p>. The editor uses <div> for paragraphs.
    // Add two newlines to ensure paragraph separation.
    text = text.replace(/<\/(p|div)>/gi, '\n\n');
    
    // Convert inline formatting tags to Markdown.
    text = text.replace(/<(?:b|strong)>(.*?)<\/(?:b|strong)>/gi, '**$1**');
    text = text.replace(/<(?:i|em)>(.*?)<\/(?:i|em)>/gi, '*$1*');
    text = text.replace(/<u>(.*?)<\/u>/gi, '_$1_'); // Using underscores for underline

    // Strip all remaining HTML tags.
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities (e.g., &nbsp;, &amp;) into characters.
    const tempEl = document.createElement('textarea');
    tempEl.innerHTML = text;
    text = tempEl.value;

    // Clean up: remove leading/trailing whitespace and reduce multiple newlines.
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
}

/**
 * Extracts pure plain text from HTML content, stripping all tags.
 * Used for generating document titles in the sidebar.
 * @param {string} htmlContent - The HTML string.
 * @returns {string} The plain text content.
 */
export const getPlainText = (htmlContent: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || "";
}

/**
 * Exports the editor content as a .txt file, preserving basic formatting as Markdown.
 * @param {string} htmlContent - The HTML content from the editor.
 */
export const exportAsTxt = (htmlContent: string) => {
    const markdownText = htmlToMarkdown(htmlContent);
    downloadFile("document.txt", markdownText, "text/plain;charset=utf-8;");
};

/**
 * Exports the editor content as a .doc file that can be opened by Microsoft Word.
 * This method preserves rich text formatting by embedding the original HTML.
 * @param {string} htmlContent - The HTML content from the editor.
 */
export const exportAsDocx = (htmlContent: string) => {
    // By embedding the original HTML content, we allow Word to interpret the
    // formatting (bold, italic, underline, alignment, etc.) directly.
    const content = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Export HTML To Doc</title>
                <style>
                    /* Basic styling for Word to interpret */
                    body {
                        font-family: Calibri, sans-serif;
                        font-size: 11pt;
                    }
                </style>
            </head>
            <body>${htmlContent}</body>
        </html>`;
    downloadFile("document.doc", content, "application/msword");
};
