const API="https://banking-app-342079872292.us-central1.run.app"

async function loadImages(){

 const res=await fetch(API+"/images")
 const images=await res.json()

 const table=document.getElementById("imageTable")

 images.forEach(img=>{

  const row=document.createElement("tr")

  row.innerHTML=`
   <td>${img.image}</td>
   <td>${img.digest}</td>
   <td>${img.created}</td>
   <td>
    <button onclick="deploy('${img.image}','${img.digest}')">
     Deploy
    </button>
   </td>
  `

  table.appendChild(row)

 })

}


async function deploy(image,digest){

 await fetch(API+"/deploy",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({image,digest})
 })

 alert("Deployment started")

}

loadImages()