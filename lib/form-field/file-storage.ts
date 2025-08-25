export async function getFile(fileId: string): Promise<File> {
  throw new Error('Not implemented');
}

export const getPublicFileUrl = async (fileId: string | undefined | null): Promise<string> => {
  throw new Error('Not implemented');
};

const createBucket = async (name: string): Promise<string> => {
  throw new Error('Not implemented');
};

/**
 * Generates a unique filename for upload
 */
const generateUniqueFileName = (file: File, directory: string): string => {
  const originalName = file.name.replace(/\s+/g, '_');
  return `db_${directory}_${originalName}`;
};

export const uploadBatchFiles = async (
  files: (File | undefined)[] | undefined,
  directory: string,
): Promise<string[] | undefined> => {
  if (!files || files.length === 0) return;

  // Upload each file with retries
  const uploadPromises = files.map(async (file) => {
    const data = await uploadFile(file, directory);
    if (!data) throw new Error('Unable to upload file : ' + file?.name);
    return data;
  });

  return Promise.all(uploadPromises);
};

/**
 * Uploads a file to storage with automatic retry for name conflicts
 */
const uploadFile = async (
  file: File | undefined,
  directory: string,
): Promise<string | undefined> => {
  throw new Error('Not implemented');
};

const deleteFile = async (fileId: string): Promise<void> => {
  throw new Error('Not implemented');
};

export { deleteFile, uploadFile };
