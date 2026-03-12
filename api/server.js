const express = require("express")
const cors = require("cors")
const { exec } = require("child_process")

const app = express()
app.use(cors())
app.use(express.json())

const REGION="us-central1"
const PROJECT="banking-app-test-486402"
const REPO="banking-repo"

app.get("/images",(req,res)=>{

 const cmd=`gcloud artifacts docker images list ${REGION}-docker.pkg.dev/${PROJECT}/${REPO}`

 exec(cmd,(err,stdout)=>{
  if(err) return res.send(err)
  res.send(stdout)
 })

})

app.post("/deploy",(req,res)=>{

 const image=req.body.image

 const cmd=`gcloud run deploy banking-app \
 --image ${image} \
 --region ${REGION} \
 --quiet`

 exec(cmd,(err,stdout)=>{
  if(err) return res.send(err)
  res.send(stdout)
 })

})

app.listen(8080,()=>console.log("API running"))