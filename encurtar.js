// api/encurtar.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  try {
    const response = await fetch('https://api.tinyurl.com/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TINYURL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    res.status(200).json({ encurtado: data.data?.tiny_url || data });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encurtar link', detalhe: error.message });
  }
}
