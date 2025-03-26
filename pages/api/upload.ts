import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { BlobServiceClient } from '@azure/storage-blob';
import fs from 'fs';
import { createClient } from '@sanity/client';

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2021-03-26',
});

// Disable Next.js's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files', err);
        return res.status(400).json({ error: 'Error parsing the files' });
      }

      const file = files.file[0];

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Upload to Azure Blob Storage
      const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME!);

      const blobName = `${Date.now()}-${file.originalFilename}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const fileStream = fs.createReadStream(file.filepath);

      try {
        await blockBlobClient.uploadStream(fileStream, file.size);
      } catch (azureError) {
        console.error('Azure Blob Storage upload error:', azureError);
        return res.status(500).json({ error: 'Failed to upload file to Azure Blob Storage' });
      }

      const fileUrl = blockBlobClient.url;

      // Upload file reference to Sanity
      try {
        const asset = await sanityClient.assets.upload('file', fs.createReadStream(file.filepath), {
          filename: file.originalFilename,
        });

        const document = {
          _type: 'complaint',
          file: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
          fileUrl,
        };

        const sanityResponse = await sanityClient.create(document);

        return res.status(200).json({ success: true, data: sanityResponse });
      } catch (sanityError) {
        console.error('Sanity upload error:', sanityError);
        return res.status(500).json({ error: 'Failed to upload file to Sanity' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
