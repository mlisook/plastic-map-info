# \<plastic-map-info\>

A fully composable element that displays a paper-material backed infowindow-like card on a `<google-map>` element,
or a google map instantiated by the Google Maps Javascript API at the position of a map marker.

## Polymer 2.0 Native

This element is a native Polymer 2.0 class based element.

You can use this element with the 2.0 or higher release of `google-map`.  You can also use this element with a Google Map built directly with the Google Maps Javascript API.

### Polymer 1.0 Version
A prior version of this element for Polymer 1.x, `paper-map-info`, is still available.  You may install that version
with:

`bower install --save paper-map-info`

Note that the 1.0 version was "paper" and the 2.0 is "plastic".

## Live Demos

At [the Github Project Page](https://mlisook.github.io/plastic-map-info) you will find multiple live demos and the source code behind them.

## WHY!?

In its current implementation (as of August 2017) the native infowindow does not support event handlers, so interactive infowindows are out.  For example:
```html
    <google-map-marker ...>
      <paper-button on-tap="makeReservation">Reserve</paper-button>
      ...
    </google-map-marker>
```
This will _not work_ because all bindings are lost when the infowindow is built. There is an issue open ([#288](https://github.com/GoogleWebComponents/google-map/issues/288)), it has been open for more than a year, but as of now it is not resolved.

Additionally, the native infowindow does not support the use of CSS style classes under native shadow dom (classes work under shady dom).

These issues have to do with the way native infoWindow works and the way `google-map-marker` has to copy the infoWindow content, effectively moving the marker content from light DOM of the `google-map-marker` to shadow DOM of the `google-map`. This can't really be fixed in `google-map-marker` while continuing to use the native infoWindow and it seems very unlikely the native infoWindow would be modified to support the Polymer element scenario. Therefore, I believe the issue will persist indefinately.

If you don't need event handlers, and will style your elements in the infowindow only with `style="..."` on each tag, _use the native infowindow_.  If you do need events, or CSS style classes, this element may help you.

## Normal Infowindow Functionality Supported

Normal Google Map infowindow behavior is supported, including moving the window as the user pans the map, changes zoom, or drags the marker. The behavior where the map pans automatically to allow the infowindow to be displayed when the clicked marker was too close to an edge is also supported. In addition, since dynamic content is allowed, if the size of the content changes, the position of the window will adjust accordingly.

## Sample Usage
```html
    <google-map latitude="40.7555" longitude="-73.985" on-google-map-ready="mapReady" fit-to-markers>
      <template is="dom-repeat" items="[[salons]]" as="s">
        <google-map-marker click-events latitude="[[s.lat]]" longitude="[[s.lng]]" on-google-map-marker-click="markerClick">
        </google-map-marker>
      </template>
      <plastic-map-info id="myinfocard" fade-in>
        <div class="layout vertical">
          <div style="width:100%; background-color: blue; font-weight: bold; color: white; padding: 5px;">[[selectedSalon.name]]</div>
          <div class="layout vertical" style="border: 2px solid blue; padding: 5px;">
            <paper-button raised on-tap="booking">Book an Appointment</paper-button>
          </div>
        </div>
      </plastic-map-info>
    </google-map>
```
```javascript
    markerClick: function(e) {
      this.selectedSalon = e.model.get('s');
      this.$.myinfocard.showInfoWindow(e.srcElement.marker);
    }
```
The element is meant to be fully composable so you can have anything inside, even neon-animated-pages, streaming data charts, etc., if you want.

## Styling

You can style the content of the infoWindow with CSS classes or style="...".

The paper-material background can be customized by using the `--plastic-map-info-mixin`.  

The style of the beak (pointer from the card to the pin) can be modified with the `--plastic-map-info-beak-mixin`.

The inner container which holds your infoWindow content can be modified with the `--plastic-map-info-content` mixin.

You can replace the default beak entirely by providing your own image or svg in a `div` marked `slot="info-beak"` inside the content of the paper-map-info:
```html
    <div slot="info-beak">
      ... your image or svg here ...
    <div>
```
The [Demo Page](https://mlisook.github.io/plastic-map-info) includes examples of each of these styling options.

## Install in Your Project

Install with bower:

`bower install --save plastic-map-info`

## Issues and Contributions

Please file issues on the github page. Contributions via pull request are certainly welcome and appreciated.
