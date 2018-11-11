# node-red-contrib-magic-home
NodeRED control for MagicHome RGB LED controller



Works with MagicHome (ARILUX) default firmware.

## Thanks go to
- jangxx (https://github.com/jangxx/node-magichome) his magic-home npm package takes care of the heavy lifting.
- joocer (https://www.npmjs.com/package/node-red-contrib-magichome) for the inspiration. His contribution has also been used as template for this contribution.

## ToDo
- implement brightness control
- sanitize inputs properly
- expose effects interface to Node RED
- automatic poll status query
- configurable poll time
- add discovery functionality to config node
- display color names below node using (color-to-name)
- allow change of brightness (it's trickier than you think)
- refactoring - plenty of it