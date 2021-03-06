/**
@license MIT
*/
/**
`plastic-map-info` is a Polymer 3.0 element which provides greater flexibility than the native infoWindow
in `google-map-marker`. Specifically it allows the use of event handlers and CSS classes on the contents
of the infoWindow.

## Live Demos with Sample Code

At [the Github Project Page](https://mlisook.github.io/plastic-map-info) you will find multiple live demos and the source code behind them.

## Style Mixins

The following mixins are available for styling:

Custom property                | Description                                 | Default
-------------------------------|---------------------------------------------|----------
`--plastic-map-info-mixin`     | Mixin applied to the paper-material backing | `{}`
`--plastic-map-info-beak-mixin | Mixin applied to the beak                   | `{stroke: black; fill: blue;}`
`--plastic-map-info-content`   | Mixin applied to the content container      | `{}`



@element plastic-map-info

*/

import { PolymerElement } from '../@polymer/polymer/polymer-element.js';

import '../@polymer/iron-icon/iron-icon.js';
import '../plastic-resize-aware/plastic-resize-aware.js';
import './plastic-map-info-icons.js';
import '../@polymer/paper-styles/shadow.js';
import '../@polymer/paper-styles/element-styles/paper-material-styles.js';
import { html } from '../@polymer/polymer/lib/utils/html-tag.js';
import { GestureEventListeners } from '../@polymer/polymer/lib/mixins/gesture-event-listeners.js';
/**
 * `plastic-map-info`
 * A more flexible infowindow for google maps
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PlasticMapInfo extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
    <style include="paper-material-styles">
       :host {
        display: inline-block;
      }

      .info-card-backing {
        position: absolute;
        z-index: 99;
        max-width: 80%;
        max-height: 75%;
        top: 0;
        left: 0;
        background-color: white;
        box-sizing: border-box;
        padding: 12px 28px 12px 12px;
        border-radius: 4px;
        color: black;
        opacity: 0;
        display: none;
        @apply --plastic-map-info-mixin;
      }

      .infocard-beak {
        position: absolute;
        opacity: 0;
        display: none;
      }

      #stdbeak svg rect {
        fill: blue;
        stroke: black;
        stroke-width: 1;
        @apply --plastic-map-info-beak-mixin;
      }

      div.card-content {
        overflow: hidden;
        @apply --plastic-map-info-content;
      }

      iron-icon.closeicon {
        --iron-icon-width: 24px;
        --iron-icon-height: 24px;
        position: absolute;
        right: 3px;
        top: 3px;
      }
    </style>
    <div id="stdbeak" class="infocard-beak">
      <svg width="20" height="20">
        <rect x="4" y="4" width="12" height="12" transform="rotate(45 10,10)">
      </rect></svg>
    </div>
    <div id="custombeak" class="infocard-beak">
      <slot id="custombeakcontent" name="info-beak"></slot>
    </div>
    <div id="infocarddiv" class="paper-material info-card-backing" elevation\$="[[elevation]]">
      <plastic-resize-aware id="raware">
        <div class="card-content">
          <slot id="cardcontent"></slot>
        </div>
      </plastic-resize-aware>
      <iron-icon class="closeicon" icon="papmapinf:close" on-tap="close"></iron-icon>
    </div>
`;
  }

  static get is() {
    return 'plastic-map-info';
  }
  static get properties() {
    return {

      /**
       * Elevation of the paper material background (0 - 5)
       */
      elevation: {
        type: Number,
        notify: true,
        value: 4,
        reflectToAttribute: true
      },

      /**
       * Use fade in animation?
       */
      fadeIn: {
        type: Boolean,
        notify: true,
        value: false
      },

      /**
       * is showing - is the infowindow showing
       */
      isShowing: {
        type: Boolean,
        notify: true,
        value: false
      },

      /**
       * dimensions of objects necessary for positioning the info card
       */
      _dim: {
        type: Object,
        notify: true,
        value: () => {
          return {
            card: {
              height: 10,
              width: 10
            },
            map: {
              height: 100,
              width: 100
            },
            marker: {
              x: 0,
              y: 42
            },
            beak: {
              width: 20,
              height: 20,
              customBeak: false
            }
          };
        }
      },

      /**
       * Reference to the google map
       */
      map: {
        type: Object,
        notify: true,
        observer: '_mapChanged'
      },

      /**
       * reference to map listeners so they can be removed later
       */
      _mapListeners: {
        type: Array,
        notify: true,
        value: () => {
          return [];
        }
      },

      /**
       * Reference to google map marker
       */
      _marker: {
        type: Object,
        notify: true
      },

      /**
       * Reference to google map overlay
       */
      _overlay: {
        type: Object,
        notify: true
      },

      /**
       * beak
       */
      _bk: {
        type: Object
      },

      /**
       * not beak
       */
      _nbk: {
        type: Object
      },

      /**
       * is custom beak
       */
      _isCustomBeak: {
        type: Boolean,
        notify: true,
        value: false
      },

      /**
       * watching size of window
       */
      _watchingSize: {
        type: Boolean,
        notify: true,
        value: false
      }

    };
  }

  /**
   * close infowindow
   */
  close() {
    this._releaseListeners();
    // turn off the resize-aware ??
    this.isShowing = false;
    this.$.infocarddiv.style.opacity = 0;
    this.$.infocarddiv.style.left = 0;
    this.$.infocarddiv.style.display = "none";
    this.$.stdbeak.style.display = "none";
    this.$.custombeak.style.display = "none";
    this.$.stdbeak.style.opacity = 0;
    this.$.custombeak.style.opacity = 0;
    //this._marker = undefined;

  }

  /**
   * handle change to content
   */
  _contentChanged() {
    if (this.isShowing) {
      this._getInfowindowSize();
      let placement = this._setInfowindowPosition();
      // do not do _panToShowInfowindow - see issue #8
    }
  }

  /**
   * clean up when this element is detached from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._releaseListeners();
    this.isShowing = false;
    this.$.infocarddiv.style.left = 0;
    this.$.infocarddiv.style.opacity = this.fadeIn ? 0 : 1;
    this.$.infocarddiv.style.display = "none";
    this.$.stdbeak.display = "none";
    this.$.custombeak.display = "none";
    this.$.stdbeak.opacity = 0;
    this.$.custombeak.opacity = 0;
    this._marker = undefined;
    this.map = undefined;
  }

  /**
   * perform fade in animation for card
   */
  _doFadeIn() {
    if (this.isShowing) {
      let currentOpacity = parseFloat(this.$.infocarddiv.style.opacity);
      if (currentOpacity >= 0.9) {
        this.$.infocarddiv.style.opacity = "1";
      } else {
        currentOpacity += 0.1;
        this.$.infocarddiv.style.opacity = currentOpacity.toString();
        setTimeout(() => {
          this._doFadeIn();
        }, 40);
      }
    }
  }

  /**
   * get infowindow size
   */
  _getInfowindowSize() {
    let icd = this.$.infocarddiv;
    this._dim.card.width = icd.offsetWidth;
    this._dim.card.height = icd.offsetHeight;
    // and the beak
    if (this._isCustomBeak) {
      this._dim.beak.height = this._bk.offsetHeight;
      this._dim.beak.width = this._bk.offsetWidth;
      this._dim.customBeak = true;
    } else {
      this._dim.beak = {
        height: 20,
        width: 20
      };
      this._dim.customBeak = false;
    }
  }

  /**
   * get marker size
   */
  _getMarkerSize() {
    if (this._marker && this._marker.getIcon()) {
      let mIcon = this._marker.getIcon();
      this._dim.marker.y = mIcon.anchor.y;
      this._dim.marker.x = 0;
    } else {
      this._dim.marker = {
        x: 0,
        y: 42
      }; // height of standard pin
    }
  }

  /**
   * get map size
   */
  _getMapSize() {
    let gm = this.map.getDiv();
    this._dim.map.width = (gm).offsetWidth;
    this._dim.map.height = (gm).offsetHeight;
  }

  /**
   * initialize map event listeners
   */
  _initListeners() {
    this._mapListeners = [];

    this._overlay = new google.maps.OverlayView();
    this._overlay.draw = function () {};
    this._overlay.setMap(this.map);

    let reposition = () => {
      if (this.isShowing) {
        this._getInfowindowSize();
        this._setInfowindowPosition();
      }
    };

    this._mapListeners.push(google.maps.event.addListener(this.map, 'projection_changed', () => {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = function () {};
      this._overlay.setMap(this.map);
    }));

    this._mapListeners.push(google.maps.event.addListener(this.map, 'zoom_changed', (e) => {
      if (this.isShowing) {
        this._getInfowindowSize();
        this._setInfowindowPosition();
      }
    }));

    this._mapListeners.push(google.maps.event.addListener(this.map, 'center_changed', (e) => {
      if (this.isShowing) {
        reposition();
      }
    }));
    this._mapListeners.push(google.maps.event.addListener(this._marker, 'drag', (e) => {
      if (this.isShowing) {
        this._setInfowindowPosition();
      }
    }));
    this._mapListeners.push(google.maps.event.addListener(this.map, 'idle', (e) => {
      if (this.isShowing) {
        this._setInfowindowPosition();
      }
    }));

    if (!this._watchingSize) {
      this.$.raware.addEventListener('element-resize', () => {
        this._contentChanged();
      });
    }
  }

  /**
   * when the map is set, initialize the overlay,
   * which can take a moment since it is not loaded automatically
   * with the rest of the map apis
   */
  _mapChanged(newVal, oldVal) {
    if (this.map) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = function () {};
      this._overlay.setMap(this.map);
    }
  }

  /**
   * Pan the map to move the info card into view
   * @param {Iplacement} placement current info card placement
   */
  _panToShowInfowindow(placement) {
    let panby = {
      x: 0,
      y: 0
    };
    if (placement.left < 0) {
      panby.x = placement.left - 10;
    } else {
      if ((placement.left + this._dim.card.width) > this._dim.map.width) {
        panby.x = (placement.left + this._dim.card.width) - this._dim.map.width + 10;
      }
    }
    if (placement.top < 0) {
      panby.y = placement.top - 10;
    } else {
      if ((placement.top + this._dim.card.height + this._dim.marker.y + 10) > this._dim.map.height) {
        panby.y = (placement.top + this._dim.card.height + this._dim.marker.y) - this._dim.map.height + 20;
      }
    }
    if (panby.x != 0 || panby.y != 0) {
      this.map.panBy(panby.x, panby.y);
    }
  }

  /**
   * Is the current info card placement within the bounds of the map's containing div?
   * @param  {Iplacement} placement current placement of the info card (top, left)
   * @return {boolean}              true if the info card fits inside the map's containing div
   */
  _placementInBounds(placement) {
    let result = (placement.top >= 0 &&
      placement.left >= 0 &&
      (placement.left + this._dim.card.width) < this._dim.map.width &&
      (placement.top + this._dim.card.height + this._dim.marker.y + 10) < this._dim.map.height);
    return result;
  }

  /**
   * initialize component
   */
  ready() {
    super.ready();
    if (this.map) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = function () {};
      this._overlay.setMap(this.map);
    }
  }

  /**
   * release event listeners
   */
  _releaseListeners() {
    for (let l of this._mapListeners) {
      google.maps.event.removeListener(l);
    }
    this._mapListeners = [];
    // turn off resize listener?
  }
  /**
   * Sets the info card's position relative to the map's containing div
   * @return {Iplacement} New position of the info card
   */
  _setInfowindowPosition() {
    if (!this._overlay) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = function () {};
      this._overlay.setMap(this.map);
      console.log("overlay not set");
    }
    let result = {
      left: 0,
      top: 0
    };
    try {
      let point = this._overlay.getProjection().fromLatLngToContainerPixel(this._marker.getPosition());
      // calculate placement
      let pleft = Math.round(point.x - this._dim.card.width / 2);
      let ptop = Math.round(point.y - this._dim.card.height - this._dim.marker.y - this._dim.beak.height + 10); // beak tucks 10px above bottom edge of window
      this.$.infocarddiv.style.left = pleft + 'px';
      this.$.infocarddiv.style.top = ptop + 'px';
      this._bk.style.left = (point.x - this._dim.beak.width / 2) + "px";
      this._bk.style.top = Math.floor(ptop - 10 + this._dim.card.height) + "px"; // beak tucks 10px above bottom edge of window
      result = {
        left: pleft,
        top: ptop
      };
    } catch (err) {
      console.log("setInfowindowPosition error");
      console.log(err);
    };
    return result;
  }

  /**
   * Shows the info card on top of the given google map marker
   * @param {google.maps.Marker} marker  The marker to attach the card to
   */
  showInfoWindow(marker) {
    if (this.map && marker) {
      if (this.isShowing) {
        this.close();
      }
      this._marker = marker;
      this._getMapSize();
      this._getMarkerSize();
      this.$.infocarddiv.style.display = "block";
      if (this.$.custombeakcontent.assignedNodes({
          flatten: true
        }).length > 0) {
        this._bk = this.$.custombeak;
        this._nbk = this.$.stdbeak;
        this._isCustomBeak = true;
      } else {
        this._bk = this.$.stdbeak;
        this._nbk = this.$.custombeak;
        this._isCustomBeak = false;
      }
      this._bk.style.opacity = "0";
      this._bk.style.display = "block";
      this._nbk.style.opacity = "0";
      this._nbk.style.display = "none";
      // to minimize repositioning due to content size changes
      // as polymer instantiates webcomponents in the content,
      // we will pause a few ms before instantiating the infowindow.
      setTimeout(() => {
        this._getInfowindowSize();
        let placement = this._setInfowindowPosition();
        this.$.infocarddiv.style.opacity = this.fadeIn ? 0 : 1;
        this._bk.style.opacity = "1";
        this._initListeners();
        this.isShowing = true;
        if (this.fadeIn) {
          this._doFadeIn();
        }
        if (!this._placementInBounds(placement)) {
          this._panToShowInfowindow(placement);
        }
      }, 33);
    }
  }
}

window.customElements.define(PlasticMapInfo.is, PlasticMapInfo);
