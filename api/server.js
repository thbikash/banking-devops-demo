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

app.get("/images",(req,res)=>{

 const { exec } = require("child_process")

 const cmd = `
 gcloud artifacts docker images list \
 us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo \
 --format="json"
 `

 exec(cmd,(err,stdout,stderr)=>{

  if(err){
   return res.status(500).send(stderr)
  }

  const data = JSON.parse(stdout)

  const images = data.map(img=>({
   image: img.package.split("/").pop(),
   digest: img.version,
   created: img.createTime
  }))

  res.json(images)

 })

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