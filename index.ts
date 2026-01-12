import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔴 هنا فقط ضع مفتاح OpenAI الخاص بك بين علامتي الاقتباس ""
const OPENAI_API_KEY = "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"; // <<< هذا كل شيء لتغيير المفتاح

// الصفحة الرئيسية مباشرة من السيرفر
app.get("/", (req: Request, res: Response) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AI Image Generator</title>
<style>
body { font-family: Arial; text-align:center; padding:30px; background: linear-gradient(120deg,#6a11cb,#2575fc); color:white; }
textarea { width:90%; height:100px; border-radius:10px; padding:10px; font-size:16px; }
button { margin-top:15px; padding:12px 30px; font-size:18px; border:none; border-radius:10px; background:#ffcc00; cursor:pointer; }
img { margin-top:20px; max-width:90%; border-radius:15px; }
#images { display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:15px; margin-top:20px; }
</style>
</head>
<body>

<h1>🎨 AI Image Generator</h1>
<textarea id="prompt" placeholder="اكتب وصف الصورة هنا..."></textarea><br>
<button onclick="generate()">Generate</button>
<div id="images"></div>

<script>
async function generate() {
  const prompt = document.getElementById("prompt").value;
  const imagesDiv = document.getElementById("images");
  imagesDiv.innerHTML = "⏳ Generating...";

  try {
    const response = await fetch("/generate", {
      method:"POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if(data.data && data.data.length > 0){
      const img = document.createElement("img");
      img.src = data.data[0].url;
      imagesDiv.innerHTML = "";
      imagesDiv.appendChild(img);
    } else {
      imagesDiv.innerHTML = "❌ لم يتم إنشاء الصورة";
    }

  } catch(err){
    imagesDiv.innerHTML = "❌ خطأ: "+err;
  }
}
</script>

</body>
</html>
  `);
});

// نقطة النهاية لإنشاء الصور عبر OpenAI
app.post("/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({ error:"Prompt is required" });

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method:"POST",
      headers:{
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ model:"gpt-image-1", prompt, size:"512x512" })
    });

    const data = await response.json();
    if(!data.data || data.data.length === 0){
      return res.status(500).json({ error:"No image generated" });
    }

    res.json(data);

  } catch(err: any){
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
