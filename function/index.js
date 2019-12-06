var config = {};
var builder = require('gcp-container-builder')(config);

function getConfig(configuration) {

    const cloudbuild = Object.create(null);
    cloudbuild.steps = [
        {
            name: 'gcr.io/cloud-builders/gsutil',
            args: ['cp',
                'gs://${configuration.gitCredentialBucket}/*',
                '.']
        }
        , {
            name: 'gcr.io/cloud-builders/gcloud',
            args: [
                'kms',
                'decrypt',
                '--ciphertext-file=.git-credentials.enc',
                '--plaintext-file=.git-credentials',
                '--location=europe-west1',
                '--key=${configuration.deployKey}',
                '--keyring=${configuration.keyRing}']
        }
        , {
            name: 'gcr.io/cloud-builders/git',
            args: [
                'config',
                '--global',
                'credential.helper',
                '\'store\''],
            env: ['HOME=/workspace']
        }
        , {
            name: 'gcr.io/cloud-builders/git',
            args: [
                'clone',
                '--single-branch',
                '--branch',
                configuration.branchName,
                '--depth',
                '1',
                configuration.project.name],
            env: ['HOME=/workspace']
        }, {
            name: 'gcr.io/cloud-builders/docker',
            args: [
                'build',
                '-t',
                'gcr.io/${GCP_PROJECT}/${configuration.project.name}:jvm',
                '-f',
                'src/main/docker/Dockerfile.jvm',
                '.'],
            dir: configuration.project.name,
            timeout: "600s"
        }
        ,{
            name: 'gcr.io/cloud-builders/docker',
            args: [
                'push',
                'gcr.io/${GCP_PROJECT}/${configuration.project.name}:jvm'],
            dir: configuration.project.name,
            timeout: "600s"
        }
        , {
            name: 'gcr.io/cloud-builders/gcloud-slim',
            args: [
                'beta',
                'run',
                'deploy',
                configuration.project.name,
                '--image', 'gcr.io/${GCP_PROJECT}/${configuration.project.name}:jvm',
                '--region', 'europe-west1',
                '--platform', 'managed',
                '--allow-unauthenticated'],
            dir: configuration.project.name,
            timeout: "600s"
        }
    ];

    return cloudbuild;
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.triggerCloudBuild = (req, res) => {
    const expectedHeader = req.header('X-Gitlab-Event');
    if (expectedHeader !== 'Push Hook') {
        res.status(400).send('Received request is not a push hook.');
        return;
    }
    const branchName = req.body.ref.replace('refs/heads/','');
    console.log('Starting build on branch ' + branchName);
    const configuration = {
        branchName,
        gitCredentialBucket : process.env.gitCredentialBucket,
        bucketName : process.env.codeBucket,
        deployKey: process.env.deployKey,
        keyRing: process.env.keyRing,
        project : {
            name: req.body.project.name,
            url: req.body.project.git_http_url
        }
    }
    builder.createBuild(
        getConfig(configuration),
        function(err, resp) {
        console.log(err);
        console.log(resp);
    });
    res.status(200).send('GCP build triggerd.');
};
