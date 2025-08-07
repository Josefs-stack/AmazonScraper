import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

app.get("/api/scrape", async (req, res) => {
  const keyword = (req.query.keyword as string) || "";

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36"
    );

    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    await page.waitForSelector("[data-component-type='s-search-result']");

    const items = await page.evaluate(() => {
      const results = Array.from(
        document.querySelectorAll("[data-component-type='s-search-result']")
      );

      return results.map((el) => {
        const title =
          el.querySelector("h2 a span")?.textContent?.trim() ||
          el.querySelector("h2 a")?.textContent?.trim() ||
          el.querySelector("h2")?.textContent?.trim() ||
          "Sem título";

        const rating =
          el.querySelector("span.a-icon-alt")?.textContent?.trim() || "Sem nota";

        const reviews =
          el.querySelector("span[aria-label*=' ratings']")?.textContent?.trim() ||
          el.querySelector("span[aria-label*=' avaliações']")?.textContent?.trim() ||
          "0";

        const image = el.querySelector("img")?.getAttribute("src") || "";

        return { title, rating, reviews, image };
      });
    });

    await browser.close();
    res.json(items);
  } catch (error) {
    console.error("Erro na raspagem com Puppeteer:", error);
    res.status(500).json({ error: "Erro ao buscar os dados da Amazon." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
