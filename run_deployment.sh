#!/usr/bin/env bash

gcloud deployment-manager deployments update cicd --verbosity debug --template cicd.jinja \
       --properties gitCredentialBucket:git-credential-bucket,deployKey:deploy-key,keyRing:gitlab-deploy-key,functionName:push-event-endpoint,location:europe-west1