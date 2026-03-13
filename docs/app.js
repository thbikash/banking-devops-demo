const API = "https://deploy-api-342079872292.us-central1.run.app"

async function loadImages(){

 const res = await fetch(API + "/images")

 const images = await res.json()

 const select = document.getElementById("images")

 images.forEach(img => {

  const option = document.createElement("option")

  option.value = img
  option.text = img

  select.appendChild(option)

 })

}

async function deploy(){

 const image = document.getElementById("images").value

 await fetch(API + "/deploy",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body: JSON.stringify({image})
 })

 alert("Deployment started")

}

loadImages()