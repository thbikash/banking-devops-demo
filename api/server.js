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

app.get("/images", async (req,res)=>{

 try{

  const parent =
  `projects/${PROJECT}/locations/${LOCATION}/repositories/${REPO}`

  const [packages] = await client.listPackages({parent})

  let images=[]

  for(const pkg of packages){

   const [versions] = await client.listVersions({
    parent: pkg.name
   })

    versions.forEach(v=>{

 const full = v.name

 const image = full.split("/packages/")[1].split("/")[0]
 const digest = full.split("/versions/")[1]

 // Capture the createTime. 
  // It usually comes as { seconds: "...", nanos: "..." } or a Date string.
  let createdAt = "unknown";
  if (v.createTime) {
    // If it's a Protobuf timestamp (has .seconds), convert to JS Date
    const date = v.createTime.seconds 
      ? new Date(v.createTime.seconds * 1000) 
      : new Date(v.createTime);
    
    createdAt = date.toLocaleString(); // Format: "M/D/YYYY, H:MM:SS AM/PM"
  }

 images.push({
  image: image,
  digest: digest,
  created: createdAt
 })

})

  }

  res.json(images)

 }catch(err){
  res.status(500).send(err.toString())
 }

})


/* -----------------------------
   DEPLOY IMAGE
--------------------------------*/

app.post("/deploy",(req,res)=>{

 const image=req.body.image
 const digest=req.body.digest

 const fullImage=`${REPO_PATH}/${image}@${digest}`

 const cmd=`
 gcloud run deploy banking-app \
 --image=${fullImage} \
 --region=us-central1 \
 --platform=managed \
 --allow-unauthenticated
 `

 exec(cmd,(err,stdout,stderr)=>{

  if(err){
   return res.status(500).send(stderr)
  }

  res.json({
   status:"Deployment started",
   image,
   digest
  })

 })

})

app.listen(8080,()=>console.log("API running"))