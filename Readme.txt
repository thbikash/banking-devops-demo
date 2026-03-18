 
 Commands to build banking-app (Main Application)
 ===================================================
 cd banking-devops-demo
 docker build -t banking-app .
 docker tag banking-app us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo/banking-app:v12
 docker push us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo/banking-app:v12
 << Run below run deploy command only if you want to deploy from command line, it should be deployed from github pages link (https://thbikash.github.io/banking-devops-demo/)>>
 gcloud run deploy banking-app --image us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo/banking-app:v12 --region us-central1 --allow-unauthenticated 
 
 
Commands to build deploy-api (Dashboard to deploy Main Application into Google cloud Run) 
===============================================================================================
 cd banking-devops-demo/api
 docker build -t deploy-api .
 docker tag deploy-api us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo/deploy-api:v14
 docker push us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo/deploy-api:v14
 gcloud run deploy deploy-api --image us-central1-docker.pkg.dev/banking-app-test-486402/banking-repo/deploy-api:v14 --region us-central1 --allow-unauthenticated


