export const isVideoFile = (fileName: string, contentType?: string): boolean => {
  if (!fileName && !contentType) return false;
  
  const extension = fileName?.split('.').pop()?.toLowerCase() ?? '';
  const isVideoByExtension = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'ogg', 'ogv', '3gp'].includes(extension);
  
  const isVideoByContentType = contentType?.startsWith('video/') ?? false;
  
  return isVideoByExtension || isVideoByContentType;
};

export const isPdfFile = (fileName: string, contentType?: string): boolean => {
  if (!fileName && !contentType) return false;
  
  const extension = fileName?.split('.').pop()?.toLowerCase() ?? '';
  const isPdfByExtension = extension === 'pdf';
  
  const isPdfByContentType = contentType === 'application/pdf' || contentType?.includes('pdf') || false;
  
  return isPdfByExtension || isPdfByContentType;
};
