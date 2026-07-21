import { Router } from "express";
import {
  reviewText,
  generateText,
  explainRule,
  analyzeScreen
} from "../controllers/ai.controller";
import { getFigmaImage } from "../controllers/figma.controller";
import { lintText } from "../controllers/lint.controller";
import { submitFeedback } from "../controllers/feedback.controller";

const router = Router();

router.post("/review", reviewText);
router.post("/generate", generateText);
router.post("/explain", explainRule);
router.post("/analyze", analyzeScreen);
router.post("/figma/image", getFigmaImage);

// Fase 5 — robustez
router.post("/lint", lintText);          // filtro determinístico (sem LLM)
router.post("/feedback", submitFeedback); // seam v2 (hoje só loga)

export default router;
