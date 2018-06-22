define(["./my-app.js"],function(_myApp){"use strict";class MyView1 extends _myApp.PolymerElement{static get template(){return _myApp.html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }
        #mapcontainerdiv {
          width: 100%;
          height: 100%;    
          position: relative;
          padding: 0;
          margin: 0;    
        }
        #maparea {
          width: 400px;
          height: 300px;
          position: relative;
          padding: 0;
          margin: 0;
        }
      </style>
      
      <template is="dom-if" if="[[apiKey]]" restamp="true">
        <iron-jsonp-library library-url="[[_gmapApiUrl]]" notify-event="map-api-load" library-loaded="{{_ijplLoaded}}" on-map-api-load="_mapsApiLoaded"></iron-jsonp-library>
      </template>
          <div id="maparea">
            <div id="mapcontainerdiv">
            </div>
            <plastic-map-info id="infowin" fade-in map="[[_theMap]]" elevation="4">
              <div class="layout vertical">
                <div style="width:100%; background-color: blue; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">[[_selectedLocation.place]]</div>
                <div class="layout vertical" style="border: 2px solid blue; padding: 5px 5px 5px 9px;">
                  <template is="dom-repeat" items="[[_selectedLocation.schedule]]" as="sch">
                    <div class="layout horizontal">
                      <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                      <span>[[sch.meetingTime]]</span>
                    </div>
                  </template>
                </div>
              </div>
            </plastic-map-info>
          </div>
          <div id="sources"></div>
    `}static get properties(){return{apiKey:{type:String,value:"AIzaSyAsblFIAb_-l6kS1DAd8rzE-TeQC2uSVW8",notify:!0},apiLoaded:{type:Boolean,value:!1,notify:!0},_gmapApiUrl:{type:String,notify:!0,computed:"_computeUrl(apiKey)"},_theMap:{type:Object,value:null,notify:!0},_selectedLocation:{type:Object,notify:!0},_locationMarkers:{type:Array,value:function(){return[]}}}}static get observers(){return["_doMarkers(_theMap, _locationMarkers)"]}connectedCallback(){super.connectedCallback();this._locationMarkers=[{locationId:"a20",latLng:{lat:40.750454,lng:-73.993519},place:"Pen Station / Madison Square Garden",schedule:[{meetingId:"m120",meetingTime:"07/01/2017 10:00am"},{meetingId:"m125",meetingTime:"07/05/2017 2:00pm"},{meetingId:"m130",meetingTime:"07/31/2017 11:00am"}]},{locationId:"a22",latLng:{lat:40.761449,lng:-73.977622},place:"MoMA",schedule:[{meetingId:"m121",meetingTime:"07/02/2017 10:30am"},{meetingId:"m126",meetingTime:"07/06/2017 3:00pm"}]},{locationId:"a24",latLng:{lat:40.74829,lng:-73.985599},place:"Empire State Building",schedule:[{meetingId:"m131",meetingTime:"07/29/2017 9:30am"},{meetingId:"m122",meetingTime:"08/02/2017 10:30am"},{meetingId:"m127",meetingTime:"08/06/2017 1:00am"},{meetingId:"m133",meetingTime:"08/29/2017 9:45am"}]}];setTimeout(()=>{this._showSource()},1e3)}_addMarkerListener(marker,location){google.maps.event.addListener(marker,"click",e=>{this._markerClick(marker,location,e)})}_markerClick(marker,location){this._selectedLocation=location;this.$.infowin.showInfoWindow(marker)}_doMarkers(map,cl){if(map&&cl&&0<cl.length){let bounds=new google.maps.LatLngBounds;cl.forEach(loc=>{if(loc.latLng){let m=new google.maps.Marker({position:loc.latLng,title:loc.place,map:this._theMap});loc.marker=m;bounds.extend(loc.latLng);this._addMarkerListener(m,loc)}});this._theMap.fitBounds(bounds)}}_computeUrl(akey){return"https://maps.googleapis.com/maps/api/js?callback=%%callback%%&v=3.exp&libraries=drawing,geometry,places,visualization&key="+akey}_mapsApiLoaded(){this._theMap=new google.maps.Map(this.$.mapcontainerdiv,{zoom:4,center:{lat:43.923,lng:-121.3465}})}_showSource(){const mapMarkup=hljs.highlight("xml",`
    <div id="maparea">
      <div id="mapcontainerdiv">
      </div>
      <plastic-map-info id="infowin" fade-in map="[[_theMap]]" elevation="4">
        <div class="layout vertical">
          <div style="width:100%; background-color: blue; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">
            [[_selectedLocation.place]]
          </div>
          <div class="layout vertical" style="border: 2px solid blue; padding: 5px 5px 5px 9px;">
            <template is="dom-repeat" items="[[_selectedLocation.schedule]]" as="sch">
              <div class="layout horizontal">
                <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                <span>[[sch.meetingTime]]</span>
              </div>
            </template>
          </div>
        </div>
      </plastic-map-info>
    </div>
    `);this.$.sources.innerHTML=`
    <p>In this example the Google Maps Javascript API is used in code to create the map and markers.</p>
    <h3>Markup</h3>
    <pre><code class="html">${mapMarkup.value}</code></pre>`;const jsCode=hljs.highlight("javascript",`
  /**
   * Compute the URL for loading maps api
   * @param {String} akey - Google Maps API Key
   */
  _computeUrl(akey) {
    return "https://maps.googleapis.com/maps/api/js?callback=%%callback%%&v=3.exp&libraries=drawing,geometry,places,visualization&key=" +
      akey;
  }
  /**
   * Handle map api loaded event
   * Initialize the map
   * @param {Event} e 
   */
  _mapsApiLoaded(e) {
    this._theMap = new google.maps.Map(this.$.mapcontainerdiv, {
      zoom: 4,
      center: {
        lat: 43.923,
        lng: -121.3465
      }
    });
  }
  /**
   * Adds a list of markers to the map
   * @param {Object} map - Reference to the google map object
   * @param {Array<Object>} cl - Array of locations to map 
   */
  _doMarkers(map, cl) {
    if (map && cl && cl.length > 0) {
      let bounds = new google.maps.LatLngBounds();
      cl.forEach((loc) => {
        if (loc.latLng) {
          let m = new google.maps.Marker({
            position: loc.latLng,
            title: loc.place,
            map: this._theMap
          });
          loc.marker = m;
          bounds.extend(loc.latLng);
          this._addMarkerListener(m, loc);
        }
      });
      this._theMap.fitBounds(bounds);
    }
  }
  /**
   * add a click event listener, capturing the marker and location
   */
  _addMarkerListener(marker, location) {
    google.maps.event.addListener(marker, 'click', (e) => {
      this._markerClick(marker, location, e);
    });
  }
  /**
   * Handle marker click
   * @param {marker} marker - google maps marker
   * @param {object} location - mltm location object
   * @param {object} e - event data
   */
  _markerClick(marker, location, e) {
    this._selectedLocation = location;
    this.$.infowin.showInfoWindow(marker);
  }
    `);this.$.sources.innerHTML+=`<h3>Javascript</h3>
    <p>This illustrates initializing the map, adding markers and showing the infowindow</p>
    <pre><code class="javascript">${jsCode.value}</code></pre>`}}window.customElements.define("my-view1",MyView1)});