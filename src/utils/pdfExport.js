import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exporta un elemento del DOM a un archivo PDF
 * @param {HTMLElement} element - Elemento DOM a exportar
 * @param {string} filename - Nombre del archivo PDF
 * @param {boolean} landscape - Orientación apaisada (true) o vertical (false)
 */
export const exportToPdf = async (element, filename, landscape = true) => {
  try {
    // Notificar al usuario que se está generando el PDF
    const notification = document.createElement('div');
    notification.textContent = 'Generando PDF...';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'var(--color-primary)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);

    // Crear canvas a partir del elemento
    const canvas = await html2canvas(element, {
      scale: 2, // Mayor calidad
      useCORS: true, // Permitir imágenes externas
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Determinar tamaño y orientación del PDF
    const orientation = landscape ? 'l' : 'p';
    const imgWidth = landscape ? 297 : 210; // Tamaño A4 en mm
    const imgHeight = landscape ? 210 : 297;
    
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    
    // Calcular dimensiones para mantener proporciones
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const aspectRatio = canvasWidth / canvasHeight;
    
    let pdfWidth = imgWidth;
    let pdfHeight = pdfWidth / aspectRatio;
    
    // Si la altura calculada es mayor que la del PDF, ajustar por altura
    if (pdfHeight > imgHeight) {
      pdfHeight = imgHeight;
      pdfWidth = pdfHeight * aspectRatio;
    }
    
    // Centrar en la página
    const xPos = (imgWidth - pdfWidth) / 2;
    const yPos = (imgHeight - pdfHeight) / 2;
    
    // Añadir imagen al PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', xPos, yPos, pdfWidth, pdfHeight);
    
    // Guardar PDF
    pdf.save(`${filename}.pdf`);

    // Quitar notificación
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return false;
  }
};
