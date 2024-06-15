aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 730335484477.dkr.ecr.eu-central-1.amazonaws.com
docker build -t pharm_backend .
docker tag pharm_backend:latest 730335484477.dkr.ecr.eu-central-1.amazonaws.com/pharm_backend:latest
docker push 730335484477.dkr.ecr.eu-central-1.amazonaws.com/pharm_backend:latest
