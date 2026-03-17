const express = require("express")
const cors = require("cors")
const { ArtifactRegistryClient } = require("@google-cloud/artifact-registry")
const { exec } = require("child_process")

const app = express()
app.use(cors())
app.use(express.json())

const client = new ArtifactRegistryClient()

const PROJECT = "banking-app-test-486402"
const LOCATION = "us-central1"
const REPO = "banking-repo"

const REPO_PATH =
`us-central1-docker.pkg.dev/${PROJECT}/${REPO}`


/* -----------------------------
   LIST IMAGES
--------------------------------*/

app.get("/images", async (req, res) => {
  try {
    const parent = `projects/${PROJECT}/locations/${LOCATION}/repositories/${REPO}`;
    const [packages] = await client.listPackages({ parent });
    let images = [];

    for (const pkg of packages) {
      const [versions] = await client.listVersions({ parent: pkg.name });

      versions.forEach(v => {
        // Log 'v' to your Cloud Run logs so you can see the structure in the GCP Console
        console.log("Processing version:", v.name);

        const nameStr = String(v.name);
        // Robust parsing using split/pop
        const nameParts = nameStr.split('/');
        const digest = nameParts.pop(); // last element
        nameParts.pop(); // remove "versions"
        const imageName = nameParts.pop(); // remove "packages" and get name

        let createdAt = "No Date";
        if (v.createTime) {
          // Handle both Timestamp objects and strings
          const seconds = v.createTime.seconds || (v.createTime.getTime ? v.createTime.getTime() / 1000 : null);
          const date = seconds ? new Date(seconds * 1000) : new Date(v.createTime);
          createdAt = !isNaN(date) ? date.toLocaleString() : "Invalid Date";
        }

        images.push({
          image: imageName,
          digest: digest,
          created: createdAt
        });
      });
    }

    // Force return as a clean JSON array
    return res.status(200).json(images);

  } catch (err) {
    console.error("ERROR IN /IMAGES:", err);
    return res.status(500).json({ error: err.toString() });
  }
});


/* -----------------------------
   DEPLOY IMAGE
--------------------------------*/

const { ServicesClient } = require('@google-cloud/run').v2;
const runClient = new ServicesClient();

app.post("/deploy", async (req, res) => {
  const { image, digest } = req.body;
  const fullImage = `${REPO_PATH}/${image}@${digest}`;
  
  // The full resource name of the service we are updating
  const servicePath = `projects/${PROJECT}/locations/${LOCATION}/services/banking-app`;

  try {
    console.log(`Deploying ${fullImage} to ${servicePath}`);

    // Get the existing service configuration
    const [service] = await runClient.getService({ name: servicePath });

    // Update the image in the container template
    service.template.containers[0].image = fullImage;

    // Trigger the update
    const [operation] = await runClient.updateService({ service });
    
    // We don't wait for the full deployment (which takes 1 min) 
    // so the UI stays responsive.
    res.json({
      status: "Deployment initiated",
      image: image,
      operation: operation.name
    });

  } catch (err) {
    console.error("Deployment Error:", err);
    res.status(500).send("Deployment failed: " + err.message);
  }
});

app.listen(8080,()=>console.log("API running"))