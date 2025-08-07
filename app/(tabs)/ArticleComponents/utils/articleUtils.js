export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const cleanHtml = (htmlContent) => {
    if (!htmlContent) return '';
    return htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};