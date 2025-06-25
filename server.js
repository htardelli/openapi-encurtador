import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/encurtar', async (req, res) => {
  const { url } = req.body;
  const token = process.env.TINYURL_TOKEN;

  if (!url || !token) {
    return res.status(400).json({ error: 'URL ou token ausente' });
  }

  try {
    const response = await fetch('https://api.tinyurl.com/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url, domain: 'tinyurl.com' })
    });

    const data = await response.json();
    return res.json({ encurtado: data.data.tiny_url });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no encurtamento', detalhe: error.message });
  }
});

app.get('/openapi.json', (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "API de Encurtamento de Links",
      version: "1.0.0"
    },
    paths: {
      "/api/encurtar": {
        post: {
          summary: "Encurta um link usando a API TinyURL do usuário",
          operationId: "encurtarLink",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description: "O link longo que será encurtado"
                    }
                  },
                  required: ["url"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Link encurtado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      encurtado: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
