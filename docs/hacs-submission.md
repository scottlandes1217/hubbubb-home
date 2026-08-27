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
- [x] **Brand assets** — in this repository at
      `custom_components/hubbubb_home/brand/`. HACS checks there first and only
      falls back to the central brands repository, which is worth knowing: it
      means the listing is not blocked on somebody else's review queue.

All of HACS's checks pass.

## Brand images

The icon in `brand/` is a placeholder drawn to match the logo's bubbles and
colours. Replace it with the real asset when there is one — 256x256, square,
transparent, the mark on its own rather than the wordmark.

Home Assistant's integrations page reads its icons from the central brands
repository, not from here, which is why Hubbubb Home shows "icon not
available" there. Fixing that needs a pull request against [`home-assistant/brands`](https://github.com/home-assistant/brands)
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
