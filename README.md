# node-red-contrib-magichome-controller
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/tedstriker/node-red-contrib-magichome-controller/graphs/commit-activity)
[![GitHub license](https://img.shields.io/github/license/tedstriker/node-red-contrib-magichome-controller.svg)](https://github.com/tedstriker/node-red-contrib-magichome-controller/blob/master/LICENSE)
![Libraries.io for GitHub](https://img.shields.io/librariesio/github/tedstriker/node-red-contrib-magichome-controller.svg)
![npm](https://img.shields.io/npm/v/node-red-contrib-magichome-controller.svg)

# Attention
please do not use this repository, as no updates are planned. I don't have had and will not have the time to take care of it in foreseeable future.

# Description
Use this node contribution to control your [Magic Home LED Controller](https://www.aliexpress.com/item/LED-Strip-light-WiFi-Bluetooth-RGB-RGBW-Controller-DC-5V-12V-24V-Android-IOS-APP-Amazon/32883892255.html) with NodeRED.

Works with MagicHome default firmware.

# Installing
Within NodeRED you can sleect 'Manage palette' from the burger menu and install ```node-red-contrib-magichome-controller```

Your 2nd option is to install it via npm to the NodeRED user directory by typing
```npm install node-red-contrib-magichome-controller``` on your command line.

# Getting started



# Properties
## Input commands
All properties have to be supplied within ```msg.payload``` property as the following properties:
### ```power``` (_boolean_|_string_)
set ```msg.payload.power```to ```true``` or ```"on"``` to turn the light on.<br>
set it to ```false``` or ```"off"``` to turn it off.

### ```brightness``` (_integer: 0..255_)
Hint: It doesn't work at the moment and can't be set. Currently it is reflecting the maximum value all colors including white.
e.g. if color is
- red: 120
- green: 34
- blue: 200
- white: 178

the brightness is 200.

### ```white``` (_integer: 0..255_)
Set the brightness of the white LED with this property. If your LED controller doesn't support white, this property can just be ignored.
The value can only be changed if the light has been turned on.

### ```color``` (_object_)
contains of three propoerties red, green and blue. Each can hold a value between 0 and 255. The color can only be changed, if the light has been turned on.
Omitting properties is possible.

```JavaScript 
{ "red": 0..255, "green": 0..255, "blue": 0..255 }
```

## Output status
Below is an example what the output status object looks like. The values of brightness, color and white are kept even when the light is turned off.

```JSON
{
    "power":"off",
    "brightness":255,
    "color":
    {
        "red":0,
        "green":111,
        "blue":250
    },
    "white":255
}
```

# Example
Import this example flow into NodeRED to try it out with controls on a dashboard.
The dashboads URL is: ```http[s]://[YOUR NODERED IP]:[1880|CUSTOM PORT]/[NODE ROOT PATH/]ui```

Reminder: Please set your lamps IP address (or host name) in the configuration node.


``` JSON
[{"id":"5c9eaefd.2a9c28","type":"MagicHome","z":"1d79652f.07841b","name":"test","server":"8c37aba5.f25cb8","x":510,"y":120,"wires":[["2bdeec9e.c1a1d4","18d8e2c7.08c1bd","a8ac24b7.be8228","bd844efc.ec43c","ef3ac2ca.e4a","f29c59a1.626798","18991924.c1f5f7"]]},{"id":"aeb56122.233f8","type":"ui_slider","z":"1d79652f.07841b","name":"","label":"red","group":"8b836425.a49b88","order":2,"width":0,"height":0,"passthru":false,"outs":"end","topic":"","min":0,"max":"255","step":1,"x":510,"y":360,"wires":[["3b81110a.56ac1e"]]},{"id":"18c8491b.da3f57","type":"ui_slider","z":"1d79652f.07841b","name":"","label":"green","group":"8b836425.a49b88","order":3,"width":0,"height":0,"passthru":false,"outs":"end","topic":"","min":0,"max":"255","step":1,"x":510,"y":420,"wires":[["bd36455c.a367f8"]]},{"id":"12a29235.80a2ce","type":"ui_slider","z":"1d79652f.07841b","name":"","label":"blue","group":"8b836425.a49b88","order":4,"width":0,"height":0,"passthru":false,"outs":"end","topic":"","min":0,"max":"255","step":1,"x":510,"y":480,"wires":[["aaddce9e.82a08"]]},{"id":"865d0746.19c5a","type":"ui_slider","z":"1d79652f.07841b","name":"","label":"white","group":"e1a73554.558bb8","order":2,"width":0,"height":0,"passthru":false,"outs":"end","topic":"","min":0,"max":"255","step":1,"x":510,"y":540,"wires":[["3a6a33f.50ddbcc"]]},{"id":"eae54b5c.e46cb8","type":"ui_colour_picker","z":"1d79652f.07841b","name":"","label":"color","group":"8b836425.a49b88","format":"rgb","outformat":"object","showSwatch":true,"showPicker":false,"showValue":true,"showHue":false,"showAlpha":false,"showLightness":true,"dynOutput":"false","order":1,"width":"4","height":"1","passthru":false,"topic":"","x":510,"y":300,"wires":[["46345e63.77267"]]},{"id":"8fa728f2.21747","type":"ui_switch","z":"1d79652f.07841b","name":"","label":"power","group":"e1a73554.558bb8","order":1,"width":0,"height":0,"passthru":false,"decouple":"true","topic":"","style":"","onvalue":"on","onvalueType":"str","onicon":"","oncolor":"","offvalue":"off","offvalueType":"str","officon":"","offcolor":"","x":510,"y":240,"wires":[["19a5d69a.6eef69"]]},{"id":"2d0e97d7.836578","type":"ui_slider","z":"1d79652f.07841b","name":"","label":"brightness","group":"e1a73554.558bb8","order":3,"width":0,"height":0,"passthru":false,"outs":"end","topic":"","min":0,"max":"255","step":1,"x":530,"y":600,"wires":[["d380eb0d.211608"]]},{"id":"46345e63.77267","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"set","p":"payload.color.red","pt":"msg","to":"payload.r","tot":"msg"},{"t":"set","p":"payload.color.green","pt":"msg","to":"payload.g","tot":"msg"},{"t":"set","p":"payload.color.blue","pt":"msg","to":"payload.b","tot":"msg"},{"t":"delete","p":"payload.a","pt":"msg"},{"t":"delete","p":"payload.r","pt":"msg"},{"t":"delete","p":"payload.g","pt":"msg"},{"t":"delete","p":"payload.b","pt":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":700,"y":300,"wires":[["5c9eaefd.2a9c28"]]},{"id":"2bdeec9e.c1a1d4","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"power","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":330,"y":240,"wires":[["8fa728f2.21747"]]},{"id":"fdb10026.c9d5d","type":"ui_button","z":"1d79652f.07841b","name":"","group":"e1a73554.558bb8","order":4,"width":0,"height":0,"passthru":false,"label":"query status","color":"","bgcolor":"","icon":"","payload":"{\"query\":true}","payloadType":"json","topic":"","x":310,"y":120,"wires":[["5c9eaefd.2a9c28"]]},{"id":"19a5d69a.6eef69","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"payload","pt":"msg","to":"payload.power","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":710,"y":240,"wires":[["5c9eaefd.2a9c28"]]},{"id":"18d8e2c7.08c1bd","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"color.red","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":330,"y":360,"wires":[["aeb56122.233f8"]]},{"id":"bd844efc.ec43c","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"color.blue","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":480,"wires":[["12a29235.80a2ce"]]},{"id":"a8ac24b7.be8228","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"color.green","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":420,"wires":[["18c8491b.da3f57"]]},{"id":"ef3ac2ca.e4a","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"white","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":320,"y":540,"wires":[["865d0746.19c5a"]]},{"id":"3b81110a.56ac1e","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"payload","pt":"msg","to":"payload.color.red","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":710,"y":360,"wires":[["5c9eaefd.2a9c28"]]},{"id":"18991924.c1f5f7","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"color.red","pt":"msg","to":"payload.r","tot":"msg"},{"t":"move","p":"color.green","pt":"msg","to":"payload.g","tot":"msg"},{"t":"move","p":"color.blue","pt":"msg","to":"payload.b","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":320,"y":300,"wires":[["eae54b5c.e46cb8"]]},{"id":"f29c59a1.626798","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"brightness","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":600,"wires":[["2d0e97d7.836578"]]},{"id":"bd36455c.a367f8","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"payload","pt":"msg","to":"payload.color.green","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":710,"y":420,"wires":[["5c9eaefd.2a9c28"]]},{"id":"aaddce9e.82a08","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"payload","pt":"msg","to":"payload.color.blue","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":710,"y":480,"wires":[["5c9eaefd.2a9c28"]]},{"id":"3a6a33f.50ddbcc","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"payload","pt":"msg","to":"payload.white","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":710,"y":540,"wires":[["5c9eaefd.2a9c28"]]},{"id":"d380eb0d.211608","type":"change","z":"1d79652f.07841b","name":"","rules":[{"t":"move","p":"payload","pt":"msg","to":"payload.brightness","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":710,"y":600,"wires":[["5c9eaefd.2a9c28"]]},{"id":"8c37aba5.f25cb8","type":"MagicHome-config","z":"","name":"Room or lamp name","host":"127.0.0.1","interval":10},{"id":"8b836425.a49b88","type":"ui_group","z":"","name":"Color","tab":"a2d6e827.7acec","order":1,"disp":true,"width":"6","collapse":false},{"id":"e1a73554.558bb8","type":"ui_group","z":"","name":"General","tab":"a2d6e827.7acec","order":2,"disp":true,"width":"6","collapse":false},{"id":"a2d6e827.7acec","type":"ui_tab","z":"","name":"MagicHome","icon":"dashboard","order":1}]
```


## Thanks go to
- jangxx (https://github.com/jangxx/node-magichome) his magic-home npm package takes care of the heavy lifting inside this contribution.
- joocer (https://www.npmjs.com/package/node-red-contrib-magichome) for the inspiration. Parts of his work has been used as template for this contribution.

## ToDo
See [project board](https://github.com/tedstriker/node-red-contrib-magichome-controller/projects/1)

## License
This project is licensed under the Apache v2.0 License - see the [LICENSE.md] file for details
