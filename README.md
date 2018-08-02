# Serverless API git description to SSM Parameter Store

A simple plugin that, when deploying your API, updates SSM Parameter Store with the current git tag + commit. The aim is to provide an automatic history log of API deployments and their versions, tracking back to version control.

## Configuration

The API git versions are updated into SSM using a specific key prefix, which by default is '/api-gateway/versions/'. If you want to supply a custom prefix, you can do so by putting the following configuration in your serverless config file:

```yaml
custom:
  ssmApiGitVersion:
    ssmPrefix: '/my-custom/prefix/'
```

Note that the plugin currently always uses the region supplied in the `provider` section of serverless configuration, regardless of the command line region parameter.

## Usage

Simply include the plugin in your serverless project:

```yaml
plugins:
  - serverless-ssm-api-git-version
```

On `sls deploy`, SSM is updated automatically.