
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

interface WebflowItem {
  name: string;
  slug: string;
  _archived: boolean;
  _draft: boolean;
  field_content: string;
  field_tone: string;
}

async function publishToWebflow(collectionId: string, item: WebflowItem) {
  const { WEBFLOW_ACCESS_TOKEN } = process.env;
  if (!WEBFLOW_ACCESS_TOKEN) throw new Error('Missing WEBFLOW_ACCESS_TOKEN');
  const headers = {
    Authorization: `Bearer ${WEBFLOW_ACCESS_TOKEN}`,
    'accept-version': '1.0.0',
    'Content-Type': 'application/json'
  };
  const url = `https://api.webflow.com/collections/${collectionId}/items?live=true`;
  const { data } = await axios.post(url, { fields: item }, { headers });
  return data;
}

export async function handler(deliverable: { title: string; html: string; tone: string }) {
  const { WEBFLOW_COLLECTION_ID } = process.env;
  if (!WEBFLOW_COLLECTION_ID) throw new Error('Missing WEBFLOW_COLLECTION_ID');
  const slug = deliverable.title.toLowerCase().replace(/\s+/g, '-').slice(0, 100);
  const item: WebflowItem = {
    name: deliverable.title,
    slug,
    _archived: false,
    _draft: false,
    field_content: deliverable.html,
    field_tone: deliverable.tone
  };
  const res = await publishToWebflow(WEBFLOW_COLLECTION_ID, item);
  console.log('Published:', res);
  return res;
}

// CLI test
if (require.main === module) {
  handler({
    title: 'Hello World',
    html: '<p>Hello from CanAI Action‑Agent</p>',
    tone: 'Friendly'
  }).catch(console.error);
}
