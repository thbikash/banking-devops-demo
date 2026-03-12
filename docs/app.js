const API="https://banking-app-342079872292.us-central1.run.app"

async function loadImages(){

 const res=await fetch(API+"/images")

 const text=await res.text()

 const lines=text.split("\n")

 const select=document.getElementById("images")

 lines.forEach(l=>{
  if(l.includes("banking-app")){
   let opt=document.createElement("option")
   opt.value=l
   opt.text=l
   select.appendChild(opt)
  }
 })
}

async function deploy(){

 const image=document.getElementById("images").value

 await fetch(API+"/deploy",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({image})
 })

 alert("Deployment started")
}

loadImages()