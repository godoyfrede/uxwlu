import { Request, Response } from "express";

export async function getFigmaImage(req: Request, res: Response) {
  try {
    const { fileId, nodeId, token } = req.body;
    
    if (!fileId || !nodeId || !token) {
      return res.status(400).json({ error: "fileId, nodeId e token são obrigatórios." });
    }

    // 1. Obter a URL da imagem a partir do Figma API
    const figmaRes = await fetch(`https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png&scale=2`, {
      headers: {
        "X-Figma-Token": token
      }
    });
    
    if (!figmaRes.ok) {
      const errText = await figmaRes.text();
      throw new Error(`Erro na API do Figma: ${figmaRes.status} ${errText}`);
    }

    const figmaData = await figmaRes.json();

    if (figmaData.err) {
      return res.status(400).json({ error: figmaData.err });
    }

    const imageUrl = figmaData.images[nodeId];
    if (!imageUrl) {
      return res.status(404).json({ error: "Imagem do node não encontrada. Verifique se o link está correto e aponta para um frame válido." });
    }

    // 2. Fazer o download da imagem e converter para base64
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error("Erro ao baixar a imagem do S3 do Figma.");
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    res.json({ base64: `data:image/png;base64,${base64}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
