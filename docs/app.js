const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

const REPO =
"us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo";

/*
LIST IMAGES
*/
app.get("/images", (req, res) => {

 const cmd =
 `gcloud artifacts docker images list ${REPO} \
 --sort-by=~CREATE_TIME \
 --limit=10 \
 --format="value(IMAGE,DIGEST)"`;

 exec(cmd, (error, stdout, stderr) => {

  if (error) {
   console.error(stderr);
   return res.status(500).json({ error: stderr });
  }

  const images = stdout
   .trim()
   .split("\n")
   .map(line => line.trim());

  res.json(images);

 });

});

/*
DEPLOY IMAGE
*/
app.post("/deploy", (req, res) => {

 const image = req.body.image;

 if (!image) {
  return res.status(400).json({ error: "Image not provided" });
 }

 const fullImage = `${REPO}/${image}`;

 const cmd =
 `gcloud run deploy banking-app \
 --image=${fullImage} \
 --region=us-central1 \
 --platform=managed \
 --allow-unauthenticated`;

 exec(cmd, (error, stdout, stderr) => {

  if (error) {
   console.error(stderr);
   return res.status(500).json({ error: stderr });
  }

  res.json({
   status: "Deployment started",
   image: image
  });

 });

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
 console.log(`Deploy API running on port ${PORT}`);
});