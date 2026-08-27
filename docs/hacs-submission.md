# Getting listed in HACS

Right now people install this by adding the repository as a *custom
repository*. Getting it into HACS's own list means it appears in a search
instead. It is a separate process from anything in this repo, and most of it
happens elsewhere.

## What HACS checks

Its automated validation wants all of this, and the `validate` workflow in
`.github/workflows/` already runs the same checks on every push:

- [x] Repository is **public**
- [x] A description and topics set on the repository
- [x] A README
- [x] A licence
- [x] `hacs.json` at the root, naming the integration
- [x] `custom_components/<domain>/manifest.json` with `version`, `documentation`
      and `issue_tracker`
- [x] `codeowners` in the manifest, matching a real GitHub user
- [x] At least one published release, tagged
- [x] **hassfest** passing — Home Assistant's own manifest validator
- [ ] **Brand images accepted into `home-assistant/brands`** — see below

Everything unticked is the only work left.

## Brand images

This is the part that is not in this repository and cannot be automated from
here. Home Assistant keeps every integration's icon centrally, and HACS will
not list an integration whose brand is missing — it is also why the card shows
"icon not available" next to Hubbubb Home in the integrations list today.

Open a pull request against [`home-assistant/brands`](https://github.com/home-assistant/brands)
adding:

    custom_integrations/hubbubb_home/icon.png     256x256, transparent
    custom_integrations/hubbubb_home/logo.png     optional, any width, <=256 high

The icon should be the bubble mark on its own, square, with transparency —
not the logo with the wordmark, and not a screenshot. `icon@2x.png` at 512
square is accepted alongside it and looks better on a retina display.

That PR is reviewed by hand and can take a week or two.

## Then the listing itself

Once the brand PR is merged, open an issue on
[`hacs/default`](https://github.com/hacs/default) using its *Add repository*
template, category **integration**. Their bot re-runs the validation above and
a maintainer approves it.

## Worth doing first

Nothing here is urgent. A custom repository install works perfectly well, and
the version of this that strangers find should have been running in somebody's
house for more than an afternoon.
