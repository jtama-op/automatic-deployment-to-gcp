# From GitLab to GCP

This tutorial expects that you have `admin` role on a GitLab projet and `owner` role a GCP project and the GCP Cloud sdk available either on your machine or using the Google Cloud Shell.

I will use [Quarkus](https://quarkus.io/) as base framework for the code, but feel free to adapt to your needs.

[![](https://design.jboss.org/quarkus/logo/final/PNG/quarkus_logo_horizontal_rgb_450px_default.png)](https://quarkus.io/)

<a href="https://cloud.google.com/"><img src="https://cloud.google.com/_static/382895f69c/images/cloud/cloud-logo.svg" width="450px" /></a>

<a href="https://gitlab.com/explore"><img src="https://about.gitlab.com/images/press/logo/png/gitlab-logo-gray-rgb.png" width="450px"/></a>

## Scaffolding the application.

I'm simply following [Quarkus guide](https://quarkus.io/guides/rest-json) to generate my project starter.

```bash
mvn io.quarkus:quarkus-maven-plugin:1.0.1.Final:create \
    -DprojectGroupId=com.groupeonepoint.gcp \
    -DprojectArtifactId=automatic-deployment \
    -DclassName="com.groupeonepoint.gcp.resource.HelloGCPResource" \
    -Dpath="/hello" \
    -Dextensions="resteasy-jsonb"
```

Update the `pom.xml` file to use Java 11 runtime.

## Deploying GCP resources

To achieve an automated process we will use :

. GCP Cloud Storage to store encoded gitlab deploy token
. GCP Cloud Function to handle push events and trigger builds
. GCP Cloud Build to -obviously- build the app
. GCP CloudRun or GCP AppEngine as runtime environment

### Using GCP Deployment Manager



## Setting up the GitLab project

Those steps will allow :

* Triggering build on push event
* Cloning project from the GCP env

They will be effective on both public GitLab instance and private instances given your private instance is publicly accessible.

