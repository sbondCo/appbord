<h1 align="center">AppBord</h1>
<h3 align="center">The simple, clean and configurable self-hosted app dashboard.</h3>

<p align="center">
  <img src="https://raw.githubusercontent.com/IRHM/appbord/master/public/favicon.svg" alt="logo" width="200px" />
</p>

## What is AppBord

AppBord is a simple dashboard that you can list your self-hosted services on. It's minimal, simple and great looking.

## Configuration

The app is configured with the [config.yml](/config.yml) file.

If AppBord is still running and you update the config.yml file, after a few seconds the dashboard will be re-generated and you'll see your updates!

```
# API key used in configWatcher to revalidate the dashboard.
# **Make sure this is set to a long random string to ensure no
# one else can access the revalidation api endpoint.**
api_key: "PLEASE_SET-THIS-TO-SOMETHING_SECURE"

weather:
  # Get weather - collects data from **google search** currently.
  # If the results are for the wrong city, you can try adding the
  # country or state name to the var, just like you would when using google search.
  city: "London, UK"

  # WEATHER the dashboard should use celsius (true) or fahrenheit (false).
  # If you hover over the tempurate in the dashboard for long enough, you can
  # make sure weather data is in the correct unit and location.
  celsius: true

# Each service needs a name and url, and optionally an icon.
# The app currently only supports simpleicons: https://simpleicons.org/
services:
  - name: GitHub
    url: https://github.com/IRHM/appbord
    icon: github

  - name: Issues
    url: https://github.com/IRHM/appbord/issues
    new_tab: true
```

## Docker

Pulling the docker image (we also have [tags for each version](https://github.com/IRHM/appbord/pkgs/container/appbord)):

```
docker pull ghcr.io/irhm/appbord:latest
```

#### docker-compose

You can [find this example here too](/docker-compose.yml).

```
version: "3.9"

services:
  appbord:
    image: ghcr.io/irhm/appbord:latest
    container_name: appbord
    volumes:
      - ./config.yml:/app/config.yml
    ports:
      - "3000:3000"
    restart: unless-stopped
```
